"use client";

import { useRef, useEffect, useCallback, useState } from "react";

// ── Mecanum IK from the actual Arduino code ──
// FL = Vx + Vy - ω
// FR = Vx - Vy + ω
// RL = Vx - Vy - ω
// RR = Vx + Vy + ω
// MOTOR_SIGN is applied later in setMotor() for wiring — not shown here.
const PWM_MAX = 210;

function mecanumIK(vx: number, vy: number, omega: number) {
  const raw = [
    vx + vy - omega, // FL
    vx - vy + omega, // FR
    vx - vy - omega, // RL
    vx + vy + omega, // RR
  ];

  let maxVal = 0;
  for (const r of raw) {
    const a = Math.abs(r);
    if (a > maxVal) maxVal = a;
  }

  const scale = maxVal > 1e-6 ? PWM_MAX / Math.max(maxVal, 1) : 0;
  return raw.map((r) => Math.round(r * scale));
}

// ── Main canvas sim ──
export default function PidSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const keysRef = useRef(new Set<string>());
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  // Wheelchair state
  const stateRef = useRef({
    x: 0,
    y: 0,
    heading: 0, // radians
    vx: 0,
    vy: 0,
    omega: 0,
    trail: [] as { x: number; y: number }[],
  });

  const [pwm, setPwm] = useState([0, 0, 0, 0]);
  const [inputVec, setInputVec] = useState({ vx: 0, vy: 0, omega: 0 });

  const getInputFromKeys = useCallback(() => {
    const keys = keysRef.current;
    let vx = 0, vy = 0, omega = 0;
    if (keys.has("w") || keys.has("arrowup")) vx = 1;
    if (keys.has("s") || keys.has("arrowdown")) vx = -1;
    if (keys.has("a") || keys.has("arrowleft")) vy = -1;
    if (keys.has("d") || keys.has("arrowright")) vy = 1;
    if (keys.has("e")) omega = -1;  // CW  — matches Arduino 'e'
    if (keys.has("f")) omega = 1;   // CCW — matches Arduino 'f'
    return { vx, vy, omega };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Center wheelchair
    const rect = canvas.getBoundingClientRect();
    stateRef.current.x = rect.width / 2;
    stateRef.current.y = rect.height / 2;

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["w", "a", "s", "d", "e", "f", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        e.preventDefault();
        keysRef.current.add(key);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    // Touch joystick
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const r = canvas.getBoundingClientRect();
      touchRef.current = { x: touch.clientX - r.left, y: touch.clientY - r.top };
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!touchRef.current) return;
      const touch = e.touches[0];
      const r = canvas.getBoundingClientRect();
      touchRef.current = { x: touch.clientX - r.left, y: touch.clientY - r.top };
    };
    const onTouchEnd = () => {
      touchRef.current = null;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    let lastTime = 0;

    const loop = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      const state = stateRef.current;
      const dpr = window.devicePixelRatio || 1;
      const cRect = canvas.getBoundingClientRect();
      canvas.width = cRect.width * dpr;
      canvas.height = cRect.height * dpr;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
      const W = cRect.width;
      const H = cRect.height;

      // Get input
      let input = getInputFromKeys();

      // Touch override: treat touch position relative to wheelchair center as joystick
      if (touchRef.current) {
        const dx = touchRef.current.x - state.x;
        const dy = touchRef.current.y - state.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 10) {
          // Rotate touch delta into wheelchair frame
          const cos = Math.cos(-state.heading);
          const sin = Math.sin(-state.heading);
          const localX = dx * cos - dy * sin;
          const localY = dx * sin + dy * cos;
          const mag = Math.min(dist / 80, 1);
          input = {
            vx: (-localY / dist) * mag,
            vy: (localX / dist) * mag,
            omega: 0,
          };
        }
      }

      // Smooth input (simple lerp for inertia feel)
      const lerpRate = 5 * dt;
      state.vx += (input.vx - state.vx) * Math.min(lerpRate, 1);
      state.vy += (input.vy - state.vy) * Math.min(lerpRate, 1);
      state.omega += (input.omega - state.omega) * Math.min(lerpRate, 1);

      // Kill tiny residuals
      if (Math.abs(state.vx) < 0.01) state.vx = 0;
      if (Math.abs(state.vy) < 0.01) state.vy = 0;
      if (Math.abs(state.omega) < 0.01) state.omega = 0;

      // Compute wheel PWMs
      const wheelPwm = mecanumIK(state.vx, state.vy, state.omega);

      // Update position (world frame)
      const speed = 120; // pixels per second at full input
      const rotSpeed = 2.5; // rad/s at full input
      const cos = Math.cos(state.heading);
      const sin = Math.sin(state.heading);
      // vx is forward (up in local), vy is right (strafe)
      state.x += (state.vx * sin + state.vy * cos) * speed * dt;
      state.y += (-state.vx * cos + state.vy * sin) * speed * dt;
      state.heading += state.omega * rotSpeed * dt;

      // Wrap around
      const margin = 30;
      if (state.x < -margin) state.x = W + margin;
      if (state.x > W + margin) state.x = -margin;
      if (state.y < -margin) state.y = H + margin;
      if (state.y > H + margin) state.y = -margin;

      // Trail
      if (Math.abs(state.vx) > 0.05 || Math.abs(state.vy) > 0.05 || Math.abs(state.omega) > 0.05) {
        state.trail.push({ x: state.x, y: state.y });
        if (state.trail.length > 300) state.trail.shift();
      }

      // ── Draw ──
      // Background
      ctx.fillStyle = "#fafaf9";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "#f0efed";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Trail
      if (state.trail.length > 1) {
        ctx.strokeStyle = "rgba(26, 26, 26, 0.08)";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(state.trail[0].x, state.trail[0].y);
        for (let i = 1; i < state.trail.length; i++) {
          ctx.lineTo(state.trail[i].x, state.trail[i].y);
        }
        ctx.stroke();
      }

      // ── Draw wheelchair (top-down) ──
      ctx.save();
      ctx.translate(state.x, state.y);
      ctx.rotate(state.heading);

      const bodyW = 48;
      const bodyH = 56;

      // Body
      ctx.fillStyle = "#e8e8e8";
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-bodyW / 2, -bodyH / 2, bodyW, bodyH, 6);
      ctx.fill();
      ctx.stroke();

      // Direction arrow
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.moveTo(0, -bodyH / 2 + 8);
      ctx.lineTo(-6, -bodyH / 2 + 18);
      ctx.lineTo(6, -bodyH / 2 + 18);
      ctx.closePath();
      ctx.fill();

      // 4 mecanum wheels
      const wheelW = 10;
      const wheelH = 20;
      const wheelOffsets = [
        { x: -bodyW / 2 - wheelW / 2, y: -bodyH / 2 + 8, label: "FL", idx: 0 },   // front-left
        { x: bodyW / 2 + wheelW / 2, y: -bodyH / 2 + 8, label: "FR", idx: 1 },     // front-right
        { x: -bodyW / 2 - wheelW / 2, y: bodyH / 2 - 8, label: "RL", idx: 2 },     // rear-left
        { x: bodyW / 2 + wheelW / 2, y: bodyH / 2 - 8, label: "RR", idx: 3 },      // rear-right
      ];

      for (const w of wheelOffsets) {
        const pwmVal = wheelPwm[w.idx];
        const intensity = Math.abs(pwmVal) / PWM_MAX;
        const isForward = pwmVal > 0;

        // Wheel body
        ctx.fillStyle = intensity > 0.01
          ? (isForward ? `rgba(34, 197, 94, ${0.3 + intensity * 0.7})` : `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`)
          : "#ccc";
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(w.x - wheelW / 2, w.y - wheelH / 2, wheelW, wheelH, 2);
        ctx.fill();
        ctx.stroke();

        // Roller lines (diagonal)
        ctx.strokeStyle = "rgba(0,0,0,0.25)";
        ctx.lineWidth = 1;
        const rollerCount = 4;
        for (let i = 0; i < rollerCount; i++) {
          const ry = w.y - wheelH / 2 + (wheelH / (rollerCount + 1)) * (i + 1);
          ctx.beginPath();
          ctx.moveTo(w.x - wheelW / 2 + 1, ry - 2);
          ctx.lineTo(w.x + wheelW / 2 - 1, ry + 2);
          ctx.stroke();
        }
      }

      ctx.restore();

      // ── HUD ──
      const monoFont = "11px var(--font-geist-mono), monospace";
      const sansFont = "11px var(--font-geist-sans), system-ui, sans-serif";

      // Wheel PWM readout (bottom-left)
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.roundRect(8, H - 78, 130, 70, 6);
      ctx.fill();
      ctx.strokeStyle = "#e5e5e5";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = monoFont;
      ctx.textAlign = "left";
      const labels = ["FL", "FR", "RL", "RR"];
      labels.forEach((label, i) => {
        const val = wheelPwm[i];
        ctx.fillStyle = "#999";
        ctx.fillText(label, 16, H - 58 + i * 16);
        ctx.fillStyle = val > 0 ? "#16a34a" : val < 0 ? "#dc2626" : "#999";
        ctx.fillText(`${val > 0 ? "+" : ""}${val}`, 40, H - 58 + i * 16);

        // Mini bar
        const barW = Math.abs(val) / PWM_MAX * 50;
        ctx.fillStyle = val > 0 ? "rgba(34, 197, 94, 0.3)" : val < 0 ? "rgba(239, 68, 68, 0.3)" : "transparent";
        ctx.fillRect(75, H - 66 + i * 16, barW * (val >= 0 ? 1 : -1), 10);
      });

      // Controls hint (top-right)
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.roundRect(W - 128, 8, 120, 52, 6);
      ctx.fill();
      ctx.strokeStyle = "#e5e5e5";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = sansFont;
      ctx.fillStyle = "#999";
      ctx.textAlign = "left";
      ctx.fillText("WASD  move", W - 118, 28);
      ctx.fillText("E/F   rotate", W - 118, 44);

      // Update React state for the code display (throttled via RAF)
      setPwm([...wheelPwm]);
      setInputVec({
        vx: Math.round(state.vx * 100) / 100,
        vy: Math.round(state.vy * 100) / 100,
        omega: Math.round(state.omega * 100) / 100,
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [getInputFromKeys]);

  // Syntax-highlighted Arduino code
  const codeLines = [
    { text: "// Mecanum Inverse Kinematics — Arduino Mega", cls: "text-[#6a9955]" },
    { text: "", cls: "" },
    { text: `float vx = ${inputVec.vx.toFixed(2)}, vy = ${inputVec.vy.toFixed(2)}, w = ${inputVec.omega.toFixed(2)};`, cls: "text-[#dcdcaa]" },
    { text: "", cls: "" },
    { text: `int FL = (vx + vy - w) * ${PWM_MAX};`, cls: "text-[#9cdcfe]" },
    { text: `int FR = (vx - vy + w) * ${PWM_MAX};`, cls: "text-[#9cdcfe]" },
    { text: `int RL = (vx - vy - w) * ${PWM_MAX};`, cls: "text-[#9cdcfe]" },
    { text: `int RR = (vx + vy + w) * ${PWM_MAX};`, cls: "text-[#9cdcfe]" },
    { text: "", cls: "" },
    { text: `// → FL=${pwm[0]>0?"+":""}${pwm[0]}  FR=${pwm[1]>0?"+":""}${pwm[1]}  RL=${pwm[2]>0?"+":""}${pwm[2]}  RR=${pwm[3]>0?"+":""}${pwm[3]}`, cls: "text-[#6a9955]" },
  ];

  return (
    <div className="space-y-4">
      {/* Canvas */}
      <div
        className="rounded-lg overflow-hidden border border-[#ebebeb] relative cursor-crosshair"
        style={{ touchAction: "none" }}
      >
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: 340 }}
          tabIndex={0}
        />
      </div>

      {/* Live Arduino code */}
      <div className="rounded-lg overflow-hidden bg-[#1e1e1e] text-[#e8e8e8]">
        <div className="flex items-center px-4 py-2 bg-[#181818]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span
            className="ml-3 text-[11px] text-[#666]"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            mega_motor_control.ino
          </span>
        </div>
        <pre
          className="p-4 overflow-x-auto text-[12px] leading-[1.8]"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {codeLines.map((line, i) => (
            <div key={i} className={line.cls}>{line.text || "\u00A0"}</div>
          ))}
        </pre>
      </div>
    </div>
  );
}
