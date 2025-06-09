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
import type { CategoryData } from "@/types/open-gov";

interface ChartDataPoint {
  category: string;
  votes: number;
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

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{`Category: ${data.category}`}</p>
        <p className="text-blue-600">{`Votes: ${data.votes.toLocaleString()}`}</p>
        <p className="text-gray-600">{`Percentage: ${data.percentage.toFixed(1)}%`}</p>
      </div>
    );
  }
  return null;
};

export function VoterTurnoutCategory({ data }: { data: CategoryData[] }) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Process data for the chart - calculate percentages
  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const totalVotes = data.reduce((sum, item) => {
      const votes = typeof item.total_votes === 'object' ? item.total_votes.low : item.total_votes;
      return sum + votes;
    }, 0);

    const chartData = data.map((item) => {
      const votes = typeof item.total_votes === 'object' ? item.total_votes.low : item.total_votes;
      return {
        category: item.category,
        votes: votes,
        percentage: totalVotes > 0 ? (votes / totalVotes) * 100 : 0,
      };
    });

    console.log("Chart data processed:", chartData);
    console.log("Total votes:", totalVotes);
    setChartData(chartData);
  }, [data]);

  return (
    <div className="flex flex-col space-y-4 w-full">
      {chartData.length > 0 && (
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={800} height={600}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => 
                  percentage > 5 ? `${category}: ${percentage.toFixed(1)}%` : ''
                }
                outerRadius={150}
                innerRadius={0}
                fill="#8884d8"
                dataKey="votes"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
