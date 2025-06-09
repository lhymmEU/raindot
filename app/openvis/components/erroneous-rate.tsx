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

interface ErrorData {
  id: string;
  error_timestamp: string;
}

interface CountData {
  timestamp: string;
}

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
        <p className="text-blue-600">{`Error Rate: ${data.errorRate.toFixed(2)}%`}</p>
        <p className="text-gray-600">{`Errors: ${data.errorCount} / ${data.totalCount}`}</p>
        {data.errorIds.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold text-sm">Error Ref IDs:</p>
            <div className="max-h-20 overflow-y-auto">
              {data.errorIds.map((id, index) => (
                <p key={index} className="text-xs text-gray-700">{id}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function ErroneousRate() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState<ErrorData[]>([]);
  const [countData, setCountData] = useState<CountData[]>([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/graph/erroneous-rate`);
        const result = await response.json();

        if (result && result.data && result.countData) {
          setErrorData(result.data);
          setCountData(result.countData);
          console.log("Erroneous Rate data fetched successfully:", {
            errors: result.data.length,
            total: result.countData.length
          });
        } else {
          console.error("Invalid erroneous rate data format:", result);
        }
      } catch (err) {
        console.error("Error fetching erroneous rate data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for the chart - calculate error rate per month
  useEffect(() => {
    if (!Array.isArray(errorData) || !Array.isArray(countData) || countData.length === 0) return;

    // Group data by month
    const monthlyData: { [key: string]: { errors: ErrorData[], total: number } } = {};

    // Process all proposals by month
    countData.forEach((item) => {
      if (item.timestamp) {
        const date = new Date(item.timestamp);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { errors: [], total: 0 };
        }
        monthlyData[monthKey].total++;
      }
    });

    // Process errors by month
    errorData.forEach((error) => {
      if (error.error_timestamp) {
        const date = new Date(error.error_timestamp);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
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
        errorIds: data.errors.map(e => e.id),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    setChartData(chartData);
  }, [errorData, countData]);

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-col gap-2 mb-4">
        <h1>Erroneous Rate Over Time</h1>
        <p>Insights: Track the percentage of erroneous proposals per month to identify users familiarity with the OpenGov system.</p>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : chartData.length === 0 ? (
        <p>No data available</p>
      ) : (
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
                label={{ value: 'Error Rate (%)', angle: -90, position: 'insideLeft' }}
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
