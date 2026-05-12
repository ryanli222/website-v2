"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export type ArchNode = {
  id: string;
  label: string;
};

export type ArchGroup = {
  id: string;
  label: string;
  nodes: ArchNode[];
  cols?: number;
};

export type ArchEdge = {
  from: string;
  to: string;
  dashed?: boolean;
  label?: string;
};

export type ArchDetail = { title: string; body: string };

type Props = {
  groups: ArchGroup[];
  edges: ArchEdge[];
  nodeDetails?: Record<string, ArchDetail>;
};

type Rect = { x: number; y: number; w: number; h: number };

export default function ArchitectureDiagram({
  groups,
  edges,
  nodeDetails,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Map<string, HTMLElement>>(new Map());
  const [rects, setRects] = useState<Map<string, Rect>>(new Map());
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    if (el) refs.current.set(id, el);
    else refs.current.delete(id);
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const cbox = container.getBoundingClientRect();
      const next = new Map<string, Rect>();
      refs.current.forEach((el, id) => {
        const b = el.getBoundingClientRect();
        next.set(id, {
          x: b.left - cbox.left,
          y: b.top - cbox.top,
          w: b.width,
          h: b.height,
        });
      });
      setRects(next);
      setSize({ w: cbox.width, h: cbox.height });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    refs.current.forEach((el) => ro.observe(el));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [groups]);

  // ESC to close the detail popup.
  useEffect(() => {
    if (!activeKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveKey(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeKey]);

  const paths = useMemo(
    () => edges.map((edge) => computePath(edge, rects)),
    [edges, rects],
  );

  const activeDetail = activeKey && nodeDetails ? nodeDetails[activeKey] : null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.12em]">
          architecture
        </p>
        <p className="text-[11px] text-[#999] lowercase">
          {activeKey ? "esc or click backdrop to close" : "click any node →"}
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative rounded-lg border border-[#eee] bg-white p-6 md:p-8 overflow-hidden"
      >
        <div
          className={`transition-all duration-200 ${activeKey ? "blur-[3px] opacity-50 pointer-events-none" : ""}`}
        >
          <svg
            className="absolute left-0 top-0 pointer-events-none"
            width={size.w}
            height={size.h}
          >
            <defs>
              <marker
                id="arch-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
              </marker>
            </defs>
            {paths.map((p, i) => {
              if (!p) return null;
              const edge = edges[i];
              return (
                <g key={i}>
                  <path
                    d={p.d}
                    fill="none"
                    stroke="#888"
                    strokeWidth={2}
                    strokeDasharray={edge.dashed ? "5 4" : undefined}
                    markerEnd="url(#arch-arrow)"
                  />
                  {edge.label && (
                    <text
                      x={p.labelPos.x}
                      y={p.labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={11}
                      fill="#888"
                      style={{
                        paintOrder: "stroke",
                        stroke: "white",
                        strokeWidth: 4,
                        strokeLinejoin: "round",
                        fontFamily:
                          "var(--font-geist-sans), system-ui, sans-serif",
                      }}
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="relative flex flex-col gap-14">
            {groups.map((group) => (
              <div
                key={group.id}
                ref={setRef(group.id)}
                className="relative rounded-lg border-2 border-[#e5e5e5] bg-[#fafafa] px-5 pt-8 pb-5"
              >
                <span className="absolute -top-[9px] left-4 bg-white px-2 text-[11px] font-bold text-[#666] uppercase tracking-[0.1em]">
                  {group.label}
                </span>
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: `repeat(${group.cols ?? group.nodes.length}, minmax(0, 1fr))`,
                  }}
                >
                  {group.nodes.map((node) => {
                    const clickable = !!nodeDetails?.[node.id];
                    const isActive = activeKey === node.id;
                    return (
                      <button
                        key={node.id}
                        ref={setRef(node.id)}
                        type="button"
                        onClick={
                          clickable
                            ? () =>
                                setActiveKey((p) =>
                                  p === node.id ? null : node.id,
                                )
                            : undefined
                        }
                        disabled={!clickable}
                        className={`rounded-md border-2 px-3 py-3 text-center transition-colors duration-150 ${
                          isActive
                            ? "bg-[#1a1a1a] border-[#1a1a1a] text-white"
                            : clickable
                              ? "bg-white border-[#d4d4d4] text-[#1a1a1a] hover:border-[#1a1a1a] hover:bg-[#f5f5f5] cursor-pointer"
                              : "bg-white border-[#d4d4d4] text-[#1a1a1a]"
                        }`}
                      >
                        <span className="block text-[13px] md:text-[14px] leading-[1.35] lowercase whitespace-pre-line font-medium">
                          {node.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {activeDetail && (
          <div
            className="absolute inset-0 flex items-center justify-center p-4 md:p-8 z-10 animate-fade-in"
            onClick={() => setActiveKey(null)}
          >
            <div
              className="relative bg-white rounded-lg border-2 border-[#1a1a1a] shadow-2xl p-6 md:p-7 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveKey(null)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] rounded-full transition-colors text-[18px] leading-none"
                aria-label="close"
              >
                ×
              </button>
              <p className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.12em] mb-1.5">
                {activeKey}
              </p>
              <p className="text-[16px] font-semibold text-[#1a1a1a] lowercase mb-3 pr-6">
                {activeDetail.title}
              </p>
              <p className="text-[14px] leading-[1.7] text-[#555]">
                {activeDetail.body}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function computePath(
  edge: ArchEdge,
  rects: Map<string, Rect>,
): { d: string; labelPos: { x: number; y: number } } | null {
  const a = rects.get(edge.from);
  const b = rects.get(edge.to);
  if (!a || !b) return null;

  const acx = a.x + a.w / 2;
  const acy = a.y + a.h / 2;
  const bcx = b.x + b.w / 2;
  const bcy = b.y + b.h / 2;

  // Connection axis is determined by overlap of the boxes along each axis.
  // If their y-ranges don't overlap, the edge is vertical (bottom/top); if
  // their x-ranges don't overlap, it's horizontal. Same-row nodes → horizontal.
  const yOverlap = !(a.y + a.h < b.y || b.y + b.h < a.y);

  let x1: number, y1: number, x2: number, y2: number, vertical: boolean;
  const padX = 12;
  const padY = 8;

  if (!yOverlap) {
    vertical = true;
    if (bcy > acy) {
      x1 = clamp(bcx, a.x + padX, a.x + a.w - padX);
      y1 = a.y + a.h;
      x2 = clamp(acx, b.x + padX, b.x + b.w - padX);
      y2 = b.y;
    } else {
      x1 = clamp(bcx, a.x + padX, a.x + a.w - padX);
      y1 = a.y;
      x2 = clamp(acx, b.x + padX, b.x + b.w - padX);
      y2 = b.y + b.h;
    }
  } else {
    vertical = false;
    if (bcx > acx) {
      x1 = a.x + a.w;
      y1 = clamp(bcy, a.y + padY, a.y + a.h - padY);
      x2 = b.x;
      y2 = clamp(acy, b.y + padY, b.y + b.h - padY);
    } else {
      x1 = a.x;
      y1 = clamp(bcy, a.y + padY, a.y + a.h - padY);
      x2 = b.x + b.w;
      y2 = clamp(acy, b.y + padY, b.y + b.h - padY);
    }
  }

  const span = vertical ? Math.abs(y2 - y1) : Math.abs(x2 - x1);
  const off = Math.max(24, span * 0.45);
  const c1x = vertical ? x1 : x1 + (x2 > x1 ? off : -off);
  const c1y = vertical ? y1 + (y2 > y1 ? off : -off) : y1;
  const c2x = vertical ? x2 : x2 + (x2 > x1 ? -off : off);
  const c2y = vertical ? y2 + (y2 > y1 ? -off : off) : y2;

  const d = `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
  const labelPos = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  return { d, labelPos };
}
