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
  TooltipProps,
} from "recharts";
import type { ErroneousRateData, ErrorData } from "@/types/open-gov";

interface ChartDataPoint {
  month: string;
  errorRate: number;
  errorCount: number;
  totalCount: number;
  errorIds: string[];
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartDataPoint;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{`Month: ${label}`}</p>
        <p className="text-blue-600">{`Error Rate: ${data.errorRate.toFixed(
          2
        )}%`}</p>
        <p className="text-gray-600">{`Errors: ${data.errorCount} / ${data.totalCount}`}</p>
        {data.errorIds.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold text-sm">Error Ref IDs:</p>
            <div className="max-h-20 overflow-y-auto">
              {data.errorIds.map((id, index) => (
                <p key={index} className="text-xs text-gray-700">
                  {id}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function ErroneousRate({ data }: { data: ErroneousRateData }) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  // Process data for the chart - calculate error rate per month
  useEffect(() => {
    if (
      !Array.isArray(data.data) ||
      !Array.isArray(data.countData) ||
      data.countData.length === 0
    )
      return;

    // Group data by month
    const monthlyData: {
      [key: string]: { errors: ErrorData[]; total: number };
    } = {};

    // Process all proposals by month
    data.countData.forEach((item) => {
      if (item.timestamp) {
        const date = new Date(item.timestamp);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { errors: [], total: 0 };
        }
        monthlyData[monthKey].total++;
      }
    });

    // Process errors by month
    data.data.forEach((error) => {
      if (error.error_timestamp) {
        const date = new Date(error.error_timestamp);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (monthlyData[monthKey]) {
          monthlyData[monthKey].errors.push(error);
        }
      }
    });

    // Convert to chart data format
    const chartData = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        errorRate: data.total > 0 ? (data.errors.length / data.total) * 100 : 0,
        errorCount: data.errors.length,
        totalCount: data.total,
        errorIds: data.errors.map((e) => e.id),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    setChartData(chartData);
  }, [data]);

  return (
    <div className="flex flex-col space-y-4 w-full">
      {chartData.length > 0 && (
        <div className="w-full h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="category"
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                type="number"
                label={{
                  value: "Error Rate (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="errorRate"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
                name="Error Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
