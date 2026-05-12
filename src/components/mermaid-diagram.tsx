"use client";

import { useEffect, useRef, useState } from "react";

export type NodeDetail = {
  title: string;
  body: string;
};

type Props = {
  chart: string;
  className?: string;
  nodeDetails?: Record<string, NodeDetail>;
};

let mermaidInitPromise: Promise<typeof import("mermaid").default> | null = null;

function getMermaid() {
  if (!mermaidInitPromise) {
    mermaidInitPromise = import("mermaid").then((mod) => {
      const mermaid = mod.default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: "base",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        flowchart: {
          nodeSpacing: 55,
          rankSpacing: 90,
          padding: 28,
          useMaxWidth: false,
          htmlLabels: true,
          curve: "basis",
        },
        themeVariables: {
          background: "#ffffff",
          primaryColor: "#f5f5f5",
          primaryBorderColor: "#d4d4d4",
          primaryTextColor: "#1a1a1a",
          secondaryColor: "#fafafa",
          tertiaryColor: "#ffffff",
          lineColor: "#999999",
          textColor: "#444444",
          clusterBkg: "#fafafa",
          clusterBorder: "#e5e5e5",
          edgeLabelBackground: "#ffffff",
          fontSize: "17px",
        },
      });
      return mermaid;
    });
  }
  return mermaidInitPromise;
}

// Try multiple strategies to find a matching key for a mermaid-rendered node.
function findKeyForNode(
  node: SVGGElement,
  keys: string[],
): string | null {
  // Strategy 1: exact id or embedded id.
  const id = node.id || "";
  const dataId = node.getAttribute("data-id") || "";
  const candidates = [id, dataId];

  for (const candidate of candidates) {
    if (!candidate) continue;
    if (keys.includes(candidate)) return candidate;
    // Mermaid wraps: "flowchart-KEY-n", "KEY-n", "flowchart-KEY", etc.
    const stripped = candidate.replace(/^flowchart-/, "");
    if (keys.includes(stripped)) return stripped;
    for (const k of keys) {
      // Match KEY as its own token (bounded by non-alphanum or string edge).
      const re = new RegExp(`(?:^|[^A-Za-z0-9])${k}(?:$|[^A-Za-z0-9])`);
      if (re.test(candidate)) return k;
    }
  }
  return null;
}

export default function MermaidDiagram({
  chart,
  className,
  nodeDetails,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [svg, setSvg] = useState<string>("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const instanceIdRef = useRef(
    `mmd-${Math.random().toString(36).slice(2, 10)}`,
  );

  // Render SVG once per chart change. We register a global callback and
  // append native mermaid `click` directives so mermaid itself wires up the
  // click handlers — this is more reliable than post-render DOM tagging,
  // since mermaid knows exactly which element represents each node.
  useEffect(() => {
    let cancelled = false;
    const keys = Object.keys(nodeDetails ?? {});
    const callbackName = `__mmdClick_${instanceIdRef.current.replace(/-/g, "_")}`;
    (window as unknown as Record<string, unknown>)[callbackName] = (key: string) => {
      setActiveKey((prev) => (prev === key ? null : key));
    };
    const clickDirectives = keys
      .map((k) => `click ${k} call ${callbackName}("${k}")`)
      .join("\n");
    const enhancedChart = clickDirectives ? `${chart}\n${clickDirectives}` : chart;

    getMermaid()
      .then(async (mermaid) => {
        const { svg } = await mermaid.render(instanceIdRef.current, enhancedChart);
        if (!cancelled) setSvg(svg);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[mermaid] render failed", err);
          setSvg("");
        }
      });
    return () => {
      cancelled = true;
      delete (window as unknown as Record<string, unknown>)[callbackName];
    };
  }, [chart, nodeDetails]);

  // After render: tag each node with its key so hover/active CSS can target
  // it. Mermaid already attached its own click handlers via the `click`
  // directives injected above.
  useEffect(() => {
    const host = containerRef.current;
    if (!host || !svg) return;
    const keys = Object.keys(nodeDetails ?? {});
    if (!keys.length) return;

    const nodes = Array.from(host.querySelectorAll<SVGGElement>("g.node"));
    const missed: string[] = [];

    for (const node of nodes) {
      const key = findKeyForNode(node, keys);
      if (!key) {
        missed.push(node.id || "(no id)");
        continue;
      }
      node.setAttribute("data-mmd-key", key);
    }

    if (nodes.length && missed.length === nodes.length) {
      console.warn(
        "[mermaid] no nodes matched a key — rendered ids:",
        nodes.map((n) => n.id),
        "keys:",
        keys,
      );
    }
  }, [svg, nodeDetails]);

  // Toggle .mmd-node-active class whenever activeKey changes.
  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;
    host
      .querySelectorAll<SVGGElement>("g.node[data-mmd-key]")
      .forEach((n) => {
        if (n.getAttribute("data-mmd-key") === activeKey) {
          n.classList.add("mmd-node-active");
        } else {
          n.classList.remove("mmd-node-active");
        }
      });
  }, [activeKey, svg]);

  const activeDetail = activeKey && nodeDetails ? nodeDetails[activeKey] : null;

  return (
    <div className={`w-full ${className ?? ""}`}>
      <style>{`
        .mermaid-diagram svg {
          max-width: none !important;
          width: 100% !important;
          height: auto !important;
          min-height: 720px;
        }
        .mermaid-diagram .nodeLabel,
        .mermaid-diagram .nodeLabel * {
          font-size: 17px !important;
          font-weight: 500 !important;
          pointer-events: none !important;
        }
        .mermaid-diagram .cluster-label,
        .mermaid-diagram .cluster-label * {
          font-size: 14px !important;
          font-weight: 700 !important;
        }
        /* Thicker base strokes on all nodes and edges */
        .mermaid-diagram g.node rect,
        .mermaid-diagram g.node polygon,
        .mermaid-diagram g.node circle,
        .mermaid-diagram g.node ellipse {
          stroke-width: 2.5px !important;
        }
        .mermaid-diagram g.cluster rect {
          stroke-width: 2px !important;
        }
        .mermaid-diagram .edgePath path,
        .mermaid-diagram .flowchart-link {
          stroke-width: 2px !important;
        }
        .mermaid-diagram .arrowheadPath,
        .mermaid-diagram marker path {
          stroke-width: 1.5px !important;
        }
        .mermaid-diagram g.node[data-mmd-key] {
          cursor: pointer;
          pointer-events: all !important;
        }
        .mermaid-diagram g.node[data-mmd-key] rect,
        .mermaid-diagram g.node[data-mmd-key] polygon,
        .mermaid-diagram g.node[data-mmd-key] circle,
        .mermaid-diagram g.node[data-mmd-key] path {
          transition: fill 160ms ease, stroke 160ms ease, stroke-width 160ms ease;
        }
        .mermaid-diagram g.node[data-mmd-key]:hover rect,
        .mermaid-diagram g.node[data-mmd-key]:hover polygon,
        .mermaid-diagram g.node[data-mmd-key]:hover circle {
          fill: #ececec !important;
          stroke: #1a1a1a !important;
          stroke-width: 3px !important;
        }
        .mermaid-diagram g.node.mmd-node-active rect,
        .mermaid-diagram g.node.mmd-node-active polygon,
        .mermaid-diagram g.node.mmd-node-active circle {
          fill: #1a1a1a !important;
          stroke: #1a1a1a !important;
          stroke-width: 3px !important;
        }
        .mermaid-diagram g.node.mmd-node-active .nodeLabel,
        .mermaid-diagram g.node.mmd-node-active .nodeLabel *,
        .mermaid-diagram g.node.mmd-node-active foreignObject * {
          color: #ffffff !important;
          fill: #ffffff !important;
        }
      `}</style>

      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.12em]">
          architecture
        </p>
        <p className="text-[11px] text-[#999] lowercase">
          {activeKey ? "click again to close" : "click any node →"}
        </p>
      </div>

      <div
        ref={containerRef}
        className="mermaid-diagram w-full overflow-x-auto rounded-lg border border-[#eee] bg-white p-4"
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      {nodeDetails && Object.keys(nodeDetails).length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.12em] mb-2">
            components
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(nodeDetails).map(([key, detail]) => {
              const isActive = key === activeKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setActiveKey((prev) => (prev === key ? null : key))
                  }
                  className={`text-[12px] lowercase px-3 py-1.5 rounded-full border transition-colors duration-150 ${
                    isActive
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : "bg-white text-[#444] border-[#d4d4d4] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                  }`}
                >
                  {detail.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div
        className={`mt-3 rounded-lg border p-4 transition-colors duration-200 ${
          activeDetail
            ? "border-[#1a1a1a] bg-white"
            : "border-dashed border-[#d4d4d4] bg-[#fafafa]"
        }`}
      >
        {activeDetail ? (
          <div>
            <p className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.12em] mb-1.5">
              {activeKey}
            </p>
            <p className="text-[15px] font-semibold text-[#1a1a1a] lowercase mb-2">
              {activeDetail.title}
            </p>
            <p className="text-[14px] leading-[1.7] text-[#555]">
              {activeDetail.body}
            </p>
          </div>
        ) : (
          <p className="text-[13px] text-[#999] text-center lowercase">
            click any component above to see what it does.
          </p>
        )}
      </div>
    </div>
  );
}
