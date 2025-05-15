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
  LabelList,
} from "recharts";

export interface Voter {
  wallet_address: string;
  name: string;
  vote_count: {
    low: number;
    high: number;
  };
}

export function ActiveVoters({ data }: { data: Voter[] }) {
  const [chartData, setChartData] = useState<{ name: string; votes: number }[]>(
    []
  );

  // Process data for the chart - use top 15 voters for better visibility
  useEffect(() => {
    // More robust check for valid data
    if (!Array.isArray(data) || data.length === 0) return;

    const chartData = data.map((voter) => ({
      name: voter.name || voter.wallet_address.substring(0, 8) + "...",
      votes:
        typeof voter.vote_count === "object"
          ? voter.vote_count.low
          : voter.vote_count,
    }));
    setChartData(chartData);
  }, [data]);
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col gap-2 mb-4">
        <h1>Top 15 Voters</h1>
        <p>Insights: We can share some insights here.</p>
      </div>

      {chartData.length === 0 ? (
        <p>No data available</p>
      ) : (
        <div className="w-full h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="category"
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis type="number" />
              <Tooltip />
              <Bar dataKey="votes" fill="#DDD5F3" name="Vote Count">
                <LabelList dataKey="votes" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
