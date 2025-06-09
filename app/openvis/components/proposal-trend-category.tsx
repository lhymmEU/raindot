"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from "recharts";

interface ProposalTrendData {
  [categoryName: string]: {
    [monthName: string]: number;
  };
}

interface ChartDataPoint {
  month: string;
  [key: string]: string | number; // Dynamic keys for each category
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

// Color palette for different categories
const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
  '#ec4899', // pink
  '#6b7280', // gray
  '#14b8a6', // teal
];

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{`Month: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value} proposals`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProposalTrendCategory() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposalData, setProposalData] = useState<ProposalTrendData>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/graph/proposal-trend-category`);
        const result = await response.json();

        if (result && result.data) {
          setProposalData(result.data);
          console.log("Proposal trend category data fetched successfully:", {
            categories: Object.keys(result.data),
            sampleCategory: Object.keys(result.data)[0],
            sampleMonths: result.data[Object.keys(result.data)[0]] ? Object.keys(result.data[Object.keys(result.data)[0]]) : []
          });
        } else {
          console.error("Invalid proposal trend category data format:", result);
        }
      } catch (err) {
        console.error("Error fetching proposal trend category data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for the chart - transform to time series format
  useEffect(() => {
    if (!proposalData || Object.keys(proposalData).length === 0) return;

    // Get unique categories and months
    const uniqueCategories = Object.keys(proposalData);
    
    // Get all unique months from all categories
    const allMonths = new Set<string>();
    uniqueCategories.forEach(category => {
      Object.keys(proposalData[category] || {}).forEach(month => {
        allMonths.add(month);
      });
    });
    
    // Sort months in chronological order
    const uniqueMonths = Array.from(allMonths).sort((a, b) => {
      // Handle both "YYYY-MMM" format (e.g., "2023-Jun") and "MMM" format (e.g., "Jun")
      const parseMonth = (monthStr: string) => {
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        if (monthStr.includes('-')) {
          // Format: "YYYY-MMM"
          const [yearStr, monthName] = monthStr.split('-');
          const year = parseInt(yearStr);
          const monthIndex = monthOrder.indexOf(monthName);
          return { year, month: monthIndex };
        } else {
          // Format: "MMM" - assume current year or default year
          const monthIndex = monthOrder.indexOf(monthStr);
          return { year: 2023, month: monthIndex }; // Default year if no year specified
        }
      };
      
      const monthA = parseMonth(a);
      const monthB = parseMonth(b);
      
      // Sort by year first, then by month
      if (monthA.year !== monthB.year) {
        return monthA.year - monthB.year;
      }
      return monthA.month - monthB.month;
    });

    setCategories(uniqueCategories);

    // Create chart data structure
    const chartData: ChartDataPoint[] = uniqueMonths.map(month => {
      const dataPoint: ChartDataPoint = { month };
      
      uniqueCategories.forEach(category => {
        const monthData = proposalData[category]?.[month];
        // Use the count value, or 0 if not available
        dataPoint[category] = monthData ? monthData : 0;
      });
      
      return dataPoint;
    });

    console.log("Chart data processed:", chartData);
    console.log("Categories:", uniqueCategories);
    setChartData(chartData);
  }, [proposalData]);

  // Handle legend click to highlight/dim lines
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLegendClick = (data: any) => {
    const dataKey = data.dataKey || data.value;
    if (typeof dataKey === 'string') {
      if (selectedCategory === dataKey) {
        // If clicking the same category, deselect it
        setSelectedCategory(null);
      } else {
        // Select the clicked category
        setSelectedCategory(dataKey);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-col gap-2 mb-4">
        <h1>Proposal Trends by Category Over Time</h1>
        <p>Insights: Track how proposal activity varies across different categories over time to identify seasonal patterns and category-specific trends.</p>
        <p className="text-sm text-gray-600">Click on legend items to highlight specific categories.</p>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : chartData.length === 0 ? (
        <p>No data available</p>
      ) : (
        <div className="w-full h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={800}
              height={600}
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend onClick={handleLegendClick} />
              {categories.map((category, index) => {
                const isSelected = selectedCategory === category;
                const isAnySelected = selectedCategory !== null;
                const isDimmed = isAnySelected && !isSelected;
                
                return (
                  <Line
                    key={category}
                    type="monotone"
                    dataKey={category}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={isSelected ? 3 : isDimmed ? 1 : 2}
                    strokeOpacity={isDimmed ? 0.3 : 1}
                    dot={{ 
                      r: isSelected ? 5 : isDimmed ? 2 : 4,
                      opacity: isDimmed ? 0.3 : 1
                    }}
                    activeDot={{ 
                      r: isSelected ? 8 : 6,
                      opacity: isDimmed ? 0.5 : 1
                    }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}