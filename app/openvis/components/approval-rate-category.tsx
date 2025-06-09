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

interface ApprovalRateData {
  [categoryName: string]: number;
}

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

export default function ApprovalRateCategory() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvalData, setApprovalData] = useState<ApprovalRateData>({});

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/graph/approval-rate-category`);
        const result = await response.json();

        if (result && result.data) {
          setApprovalData(result.data);
          console.log("Approval rate category data fetched successfully:", {
            categories: Object.keys(result.data),
            sampleRates: Object.values(result.data).slice(0, 3)
          });
        } else {
          console.error("Invalid approval rate category data format:", result);
        }
      } catch (err) {
        console.error("Error fetching approval rate category data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for the chart
  useEffect(() => {
    if (!approvalData || Object.keys(approvalData).length === 0) return;

    // Transform data for bar chart
    const chartData: ChartDataPoint[] = Object.entries(approvalData)
      .map(([category, rate]) => ({
        category,
        approvalRate: rate,
        approvalPercentage: `${(rate * 100).toFixed(1)}%`
      }))
      .sort((a, b) => b.approvalRate - a.approvalRate); // Sort by approval rate descending

    console.log("Chart data processed:", chartData);
    setChartData(chartData);
  }, [approvalData]);

  // Custom label formatter for Y-axis (show as percentage)
  const formatYAxisLabel = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-col gap-2 mb-4">
        <h1>Approval Rate by Category</h1>
        <p>Insights: Compare approval rates across different proposal categories to identify which types of proposals have higher success rates.</p>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : chartData.length === 0 ? (
        <p>No data available</p>
      ) : (
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
              <YAxis 
                tickFormatter={formatYAxisLabel}
                domain={[0, 1]}
              />
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
