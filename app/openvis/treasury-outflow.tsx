"use client";

import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { 
  sankey, 
  sankeyLinkHorizontal, 
  sankeyJustify
} from "d3-sankey";

interface InitiativeType {
  category: "New" | "Existing" | "Compensation" | "Protocol";
  amount: number;
  refs: number[];
}

interface FunctionalType {
  category: "Marketing" | "Product" | "Event" | "EducationAndResearch" | "BD" | "Security";
  amount: number;
  refs: number[];
}

interface SankeyNodeData {
  name: string;
  category?: string;
  amount?: number;
  refs?: number[];
}

interface SankeyLinkData {
  source: number;
  target: number;
  value: number;
}

// Extended types for D3-sankey with computed properties
interface ExtendedSankeyNode {
  name: string;
  category?: string;
  amount?: number;
  refs?: number[];
  // D3-sankey computed properties
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  value?: number;
}

interface ExtendedSankeyLink {
  source: ExtendedSankeyNode;
  target: ExtendedSankeyNode;
  value: number;
  // D3-sankey computed properties
  width?: number;
  y0?: number;
  y1?: number;
}

interface TooltipData {
  category: string;
  amount: number;
  refs: number[];
  x: number;
  y: number;
}

// Color palette for different categories - low saturation colors
const INITIATIVE_COLORS = {
  "New": "#10b981",        
  "Existing": "#f59e0b",  
  "Compensation": "#8b5cf6",
  "Protocol": "#6b7280",
  "Treasury": "#1e293b"
};

const FUNCTIONAL_COLORS = {
  "Marketing": "#ef4444",
  "Product": "#3b82f6",
  "Event": "#f97316",
  "EducationAndResearch": "#06b6d4",
  "BD": "#84cc16",
  "Security": "#a855f7",
  "Treasury": "#1e293b"
};

// Helper function to format amounts
const formatAmount = (amount: number): string => {
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(1)}B DOT`;
  } else if (amount >= 1e6) {
    return `${(amount / 1e6).toFixed(1)}M DOT`;
  } else if (amount >= 1e3) {
    return `${(amount / 1e3).toFixed(1)}K DOT`;
  } else {
    return `${amount.toFixed(2)} DOT`;
  }
};

export default function TreasuryOutflow() {
  const [initiativeData, setInitiativeData] = useState<InitiativeType[]>([]);
  const [functionalData, setFunctionalData] = useState<FunctionalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const initiativeSvgRef = useRef<SVGSVGElement>(null);
  const functionalSvgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/graph/treasury-outflow`);
        const result = await response.json();

        if (result && result.initiativeData && result.functionalData) {
          setInitiativeData(result.initiativeData);
          setFunctionalData(result.functionalData);
          console.log("Treasury outflow data fetched successfully:", {
            initiative: result.initiativeData,
            functional: result.functionalData
          });
        } else {
          console.error("Invalid treasury outflow data format:", result);
        }
      } catch (err) {
        console.error("Error fetching treasury outflow data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to create Sankey chart
  const createSankeyChart = (
    svgRef: React.RefObject<SVGSVGElement | null>,
    data: (InitiativeType | FunctionalType)[],
    colors: typeof INITIATIVE_COLORS | typeof FUNCTIONAL_COLORS
  ) => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const container = containerRef.current;
    if (!container) return;

    const margin = { top: 20, right: 60, bottom: 20, left: 5 };
    const width = Math.max(300, (container.clientWidth / 2) - 80) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Prepare data for Sankey
    const nodes: SankeyNodeData[] = [
      { name: "Treasury", category: "Treasury" }
    ];

    // Add category nodes
    data.forEach(item => {
      nodes.push({
        name: item.category,
        category: item.category,
        amount: item.amount,
        refs: item.refs
      });
    });

    const links: SankeyLinkData[] = data.map((item, index) => ({
      source: 0, // Treasury is always source (index 0)
      target: index + 1, // Category nodes start from index 1
      value: item.amount
    }));

    // Create Sankey generator
    const sankeyGenerator = sankey<SankeyNodeData, SankeyLinkData>()
      .nodeWidth(15)
      .nodePadding(15)
      .extent([[0, 0], [width, height]])
      .nodeAlign(sankeyJustify);

    // Generate layout
    const graph = sankeyGenerator({
      nodes: nodes.map(d => ({ ...d })),
      links: links.map(d => ({ ...d }))
    });

    const sankeyNodes = graph.nodes as ExtendedSankeyNode[];
    const sankeyLinks = graph.links as ExtendedSankeyLink[];

    // Create main group
    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw links
    g.append("g")
      .selectAll("path")
      .data(sankeyLinks)
      .enter()
      .append("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d: ExtendedSankeyLink) => colors[d.target.category as keyof typeof colors] || "#94a3b8")
      .attr("stroke-width", (d: ExtendedSankeyLink) => Math.max(1, d.width || 0))
      .attr("fill", "none")
      .attr("opacity", 0.6)
      .style("cursor", "pointer")
      .on("mouseover", function(event: MouseEvent, d: ExtendedSankeyLink) {
        d3.select(this).attr("opacity", 0.9);
        const targetNode = d.target;
        if (targetNode.category && targetNode.category !== "Treasury") {
          setTooltip({
            category: targetNode.category,
            amount: targetNode.amount || 0,
            refs: targetNode.refs || [],
            x: event.pageX,
            y: event.pageY
          });
        }
      })
      .on("mousemove", function(event: MouseEvent) {
        if (tooltip) {
          setTooltip(prev => prev ? { ...prev, x: event.pageX, y: event.pageY } : null);
        }
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 0.6);
        setTooltip(null);
      });

    // Draw nodes
    const node = g.append("g")
      .selectAll("g")
      .data(sankeyNodes)
      .enter()
      .append("g");

    // Node rectangles
    node.append("rect")
      .attr("x", (d: ExtendedSankeyNode) => d.x0 || 0)
      .attr("y", (d: ExtendedSankeyNode) => d.y0 || 0)
      .attr("height", (d: ExtendedSankeyNode) => (d.y1 || 0) - (d.y0 || 0))
      .attr("width", (d: ExtendedSankeyNode) => (d.x1 || 0) - (d.x0 || 0))
      .attr("fill", (d: ExtendedSankeyNode) => colors[d.category as keyof typeof colors] || "#6b7280")
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .on("mouseover", function(event: MouseEvent, d: ExtendedSankeyNode) {
        if (d.category && d.category !== "Treasury") {
          setTooltip({
            category: d.category,
            amount: d.amount || 0,
            refs: d.refs || [],
            x: event.pageX,
            y: event.pageY
          });
        }
      })
      .on("mousemove", function(event: MouseEvent) {
        if (tooltip) {
          setTooltip(prev => prev ? { ...prev, x: event.pageX, y: event.pageY } : null);
        }
      })
      .on("mouseout", function() {
        setTooltip(null);
      });

    // Node labels
    node.append("text")
      .attr("x", (d: ExtendedSankeyNode) => (d.x0 || 0) < width / 2 ? (d.x1 || 0) + 6 : (d.x0 || 0) - 6)
      .attr("y", (d: ExtendedSankeyNode) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d: ExtendedSankeyNode) => (d.x0 || 0) < width / 2 ? "start" : "end")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .text((d: ExtendedSankeyNode) => d.name);

    // Add amounts as secondary labels for category nodes
    node.filter((d: ExtendedSankeyNode) => Boolean(d.category && d.category !== "Treasury"))
      .append("text")
      .attr("x", (d: ExtendedSankeyNode) => (d.x0 || 0) < width / 2 ? (d.x1 || 0) + 6 : (d.x0 || 0) - 6)
      .attr("y", (d: ExtendedSankeyNode) => ((d.y1 || 0) + (d.y0 || 0)) / 2 + 14)
      .attr("text-anchor", (d: ExtendedSankeyNode) => (d.x0 || 0) < width / 2 ? "start" : "end")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .text((d: ExtendedSankeyNode) => formatAmount(d.amount || 0));

    // Add global mouseleave handler to hide tooltip when mouse leaves chart area
    svg.on("mouseleave", () => {
      setTooltip(null);
    });
  };

  // Create and render Sankey charts
  useEffect(() => {
    createSankeyChart(initiativeSvgRef, initiativeData, INITIATIVE_COLORS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initiativeData, tooltip]);

  useEffect(() => {
    createSankeyChart(functionalSvgRef, functionalData, FUNCTIONAL_COLORS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [functionalData, tooltip]);

  return (
    <div className="flex flex-col space-y-6 w-full" ref={containerRef}>
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl font-bold">Treasury Outflow Analysis</h1>
        <p className="text-gray-600">Visualize the flow of treasury funds to different initiative and functional categories, showing the distribution and magnitude of treasury allocations.</p>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (initiativeData.length === 0 && functionalData.length === 0) ? (
        <p>No data available</p>
      ) : (
        <div className="w-full">
          {/* Two Sankey charts displayed horizontally */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Initiative Data Chart */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-40 mr-4">
                  <p className="text-xl font-semibold text-center whitespace-nowrap transform -rotate-90 origin-center">Initiative Categories</p>
                </div>
                <div className="flex-1">
                  <div className="flex justify-center">
                    <svg ref={initiativeSvgRef}></svg>
                  </div>
                </div>
              </div>
              {/* Initiative Legend */}
              <div className="mt-4 flex flex-wrap gap-3 justify-center">
                {Object.entries(INITIATIVE_COLORS).filter(([key]) => key !== "Treasury").map(([category, color]) => (
                  <div key={category} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-medium">{category}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Functional Data Chart */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-40 mr-4">
                  <p className="text-xl font-semibold text-center whitespace-nowrap transform -rotate-90 origin-center">Functional Categories</p>
                </div>
                <div className="flex-1">
                  <div className="flex justify-center">
                    <svg ref={functionalSvgRef}></svg>
                  </div>
                </div>
              </div>
              {/* Functional Legend */}
              <div className="mt-4 flex flex-wrap gap-3 justify-center">
                {Object.entries(FUNCTIONAL_COLORS).filter(([key]) => key !== "Treasury").map(([category, color]) => (
                  <div key={category} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-medium">{category === "EducationAndResearch" ? "Education & Research" : category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Shared Tooltip */}
          {tooltip && (
            <div
              className="fixed bg-white p-3 border border-gray-300 rounded shadow-lg z-50 pointer-events-none max-w-xs"
              style={{
                left: tooltip.x + 10,
                top: tooltip.y - 10,
                transform: 'translateY(-100%)'
              }}
            >
              <p className="font-semibold text-sm mb-1">{`Category: ${tooltip.category}`}</p>
              <p className="text-blue-600 text-sm mb-1">{`Amount: ${formatAmount(tooltip.amount)}`}</p>
              <p className="text-gray-600 text-xs mb-1">{`References: ${tooltip.refs.length} proposal(s)`}</p>
              {tooltip.refs.length > 0 && (
                <div className="text-xs text-gray-500">
                  <p className="font-medium">Ref IDs:</p>
                  <p className="break-words">{tooltip.refs.slice(0, 10).join(', ')}{tooltip.refs.length > 10 ? '...' : ''}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
