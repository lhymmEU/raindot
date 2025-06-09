"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";

interface CategoryData {
  category: string;
  total_allocation: number;
}

interface ChartDataPoint {
  category: string;
  allocation: number;
  percentage: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartDataPoint;
  }>;
}

// Color palette for different categories
const COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // yellow
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#ec4899", // pink
  "#6b7280", // gray
  "#14b8a6", // teal
];

// Define the category groups
const INITIATIVE_TYPES = ["New", "Existing", "Compensation", "Protocol"];
const FUNCTIONAL_FOCUS = ["Marketing", "Product", "Event", "EducationAndResearch", "Security", "BD"];

// Category descriptions mapping
const CATEGORY_DESCRIPTIONS = {
  // Initiative Types
  "New": "New initiatives and projects not previously funded",
  "Existing": "Continuation or expansion of previously funded projects", 
  "Compensation": "Salary, bounties, and compensation-related funding",
  "Protocol": "Core protocol development and infrastructure improvements",
  
  // Functional Focus
  "Marketing": "Marketing campaigns, brand awareness, and promotional activities",
  "Product": "Product development, user experience improvements, and feature development",
  "Event": "Conferences, meetups, hackathons, and community events",
  "EducationAndResearch": "Educational content, research initiatives, and knowledge sharing",
  "Security": "Security audits, bug bounties, and security-related improvements",
  "BD": "Business development, partnerships, and ecosystem growth initiatives"
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{`Category: ${data.category}`}</p>
        <p className="text-blue-600">{`Allocation: ${(data.allocation / 1000000).toFixed(2)}M DOT`}</p>
        <p className="text-gray-600">{`Percentage: ${data.percentage.toFixed(1)}%`}</p>
      </div>
    );
  }
  return null;
};

// Helper component for rendering a pie chart section
const PieChartSection = ({ 
  title, 
  chartData, 
  colorOffset = 0 
}: { 
  title: string; 
  chartData: ChartDataPoint[]; 
  colorOffset?: number;
}) => {
  if (chartData.length === 0) {
    return (
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
        <p className="text-center text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      
      {/* Legend at the top in a row */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-300 font-semibold text-sm text-gray-700">
            <span>Categories</span>
            <span>Total: {(chartData.reduce((sum, item) => sum + item.allocation, 0) / 1000000).toFixed(1)}M DOT</span>
          </div>
          
          {/* Legend Items in a row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {chartData
              .sort((a, b) => b.allocation - a.allocation)
              .map((item) => {
                const originalIndex = chartData.findIndex(original => original.category === item.category);
                const color = COLORS[(originalIndex + colorOffset) % COLORS.length];
                const description = CATEGORY_DESCRIPTIONS[item.category as keyof typeof CATEGORY_DESCRIPTIONS] || 'No description available';
                
                return (
                  <div 
                    key={item.category} 
                    className="bg-white rounded p-3 hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-semibold text-sm">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-right font-mono text-sm text-gray-700 ml-2">
                        <div className="font-semibold">{(item.allocation / 1000000).toFixed(1)}M DOT</div>
                        <div className="text-gray-500 text-xs">
                          {item.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {description}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Pie Chart below the legend */}
      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category, percentage }) => 
                percentage > 5 ? `${category}: ${percentage.toFixed(1)}%` : ''
              }
              outerRadius={120}
              innerRadius={0}
              fill="#8884d8"
              dataKey="allocation"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[(index + colorOffset) % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export function CapitalAllocationCategory() {
  const [initiativeData, setInitiativeData] = useState<ChartDataPoint[]>([]);
  const [functionalData, setFunctionalData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : "http://localhost:3000";
        const response = await fetch(
          `${baseUrl}/api/graph/capital-allocation-category`
        );
        const result = await response.json();

        if (result && result.data) {
          setCategoryData(result.data);
          console.log(
            "Capital allocation category data fetched successfully:",
            {
              categories: result.data.length,
              totalAllocation: result.data.reduce(
                (sum: number, item: CategoryData) =>
                  sum + item.total_allocation,
                0
              ),
            }
          );
        } else {
          console.error(
            "Invalid capital allocation category data format:",
            result
          );
        }
      } catch (err) {
        console.error("Error fetching capital allocation category data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for both charts
  useEffect(() => {
    if (!Array.isArray(categoryData) || categoryData.length === 0) return;

    // Filter data for initiative types
    const initiativeCategories = categoryData.filter(item => 
      INITIATIVE_TYPES.includes(item.category)
    );

    // Filter data for functional focus
    const functionalCategories = categoryData.filter(item => 
      FUNCTIONAL_FOCUS.includes(item.category)
    );

    // Calculate percentages for initiative types
    const initiativeTotalAllocation = initiativeCategories.reduce((sum, item) => {
      return sum + item.total_allocation;
    }, 0);

    const initiativeChartData = initiativeCategories.map((item) => {
      return {
        category: item.category,
        allocation: item.total_allocation,
        percentage: initiativeTotalAllocation > 0 ? (item.total_allocation / initiativeTotalAllocation) * 100 : 0,
      };
    });

    // Calculate percentages for functional focus
    const functionalTotalAllocation = functionalCategories.reduce((sum, item) => {
      return sum + item.total_allocation;
    }, 0);

    const functionalChartData = functionalCategories.map((item) => {
      return {
        category: item.category,
        allocation: item.total_allocation,
        percentage: functionalTotalAllocation > 0 ? (item.total_allocation / functionalTotalAllocation) * 100 : 0,
      };
    });

    console.log("Initiative chart data processed:", initiativeChartData);
    console.log("Functional chart data processed:", functionalChartData);
    
    setInitiativeData(initiativeChartData);
    setFunctionalData(functionalChartData);
  }, [categoryData]);

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex flex-col gap-2 mb-4">
        <h1>Capital Allocation by Category</h1>
        <p className="text-gray-600">
          Insights: See the percentage breakdown of capital allocation across different
          proposal categories to understand funding distribution patterns.
        </p>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="space-y-8">
          {/* Initiative Types Chart */}
          <PieChartSection 
            title="Initiative Types" 
            chartData={initiativeData}
            colorOffset={0}
          />
          
          {/* Functional Focus Chart */}
          <PieChartSection 
            title="Functional Focus" 
            chartData={functionalData}
            colorOffset={4}
          />
        </div>
      )}
    </div>
  );
}
