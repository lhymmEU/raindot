"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { ApprovalRateData } from "@/types/open-gov";

interface ChartDataPoint {
  category: string;
  approvalRate: number;
  approvalPercentage: string;
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

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const approvalRate = payload[0]?.value || 0;
    const percentage = (approvalRate * 100).toFixed(1);

    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{`Category: ${label}`}</p>
        <p style={{ color: payload[0]?.color }}>
          {`Approval Rate: ${percentage}%`}
        </p>
      </div>
    );
  }
  return null;
};

export default function ApprovalRateCategory({
  data,
}: {
  data: ApprovalRateData[];
}) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Process data for the chart
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    // Transform data for bar chart
    const chartData: ChartDataPoint[] = Object.entries(data)
      .map(([category, rate]) => ({
        category,
        approvalRate: Number(rate),
        approvalPercentage: `${(Number(rate) * 100).toFixed(1)}%`,
      }))
      .sort((a, b) => b.approvalRate - a.approvalRate); // Sort by approval rate descending

    console.log("Chart data processed:", chartData);
    setChartData(chartData);
  }, [data]);

  // Custom label formatter for Y-axis (show as percentage)
  const formatYAxisLabel = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      {chartData.length > 0 && (
        <div className="w-full h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis tickFormatter={formatYAxisLabel} domain={[0, 1]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="approvalRate"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
