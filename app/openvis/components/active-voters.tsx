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

export function ActiveVoters() {
  const [chartData, setChartData] = useState<{ name: string; votes: number }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Voter[]>([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Remove the delay as it's no longer needed
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/graph/active-voters`);
        const result = await response.json();

        if (result && result.data) {
          setData(result.data);
          console.log("Active Voters data fetched successfully:", result.data.length);
        } else {
          console.error("Invalid voters data format:", result);
        }
      } catch (err) {
        console.error("Error fetching voters data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-col gap-2 mb-4">
        <h1>Top 15 Voters</h1>
        <p>Insights: We can share some insights here.</p>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : chartData.length === 0 ? (
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
