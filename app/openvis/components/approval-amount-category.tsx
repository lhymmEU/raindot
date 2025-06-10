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
import type { ApprovalAmountData } from "@/types/open-gov";

interface ChartDataPoint {
  category: string;
  approvalAmount: number;
  formattedAmount: string;
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
    const approvalAmount = payload[0]?.value || 0;
    const formattedAmount = formatAmount(approvalAmount);

    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{`Category: ${label}`}</p>
        <p style={{ color: payload[0]?.color }}>
          {`Approval Amount: ${formattedAmount}`}
        </p>
      </div>
    );
  }
  return null;
};

// Helper function to format amounts
const formatAmount = (amount: number): string => {
  if (amount >= 1e9) {
    return `$${(amount / 1e9).toFixed(1)}B`;
  } else if (amount >= 1e6) {
    return `$${(amount / 1e6).toFixed(1)}M`;
  } else if (amount >= 1e3) {
    return `$${(amount / 1e3).toFixed(1)}K`;
  } else {
    return `$${amount.toFixed(2)}`;
  }
};

export default function ApprovalAmountCategory({
  data,
}: {
  data: ApprovalAmountData[];
}) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Process data for the chart
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    // Transform data for bar chart
    const chartData: ChartDataPoint[] = Object.entries(data)
      .map(([category, amount]) => ({
        category,
        approvalAmount: Number(amount),
        formattedAmount: formatAmount(Number(amount)),
      }))
      .sort((a, b) => b.approvalAmount - a.approvalAmount); // Sort by approval amount descending

    console.log("Chart data processed:", chartData);
    setChartData(chartData);
  }, [data]);

  // Custom label formatter for Y-axis (show formatted amounts)
  const formatYAxisLabel = (value: number) => {
    return formatAmount(value);
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
              <YAxis tickFormatter={formatYAxisLabel} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="approvalAmount"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
