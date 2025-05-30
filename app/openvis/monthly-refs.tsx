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
} from "recharts";

// Define the type for our data items
export interface ProposeRel {
  rel: {
    timestamp: string;
  };
}

interface MonthlyCount {
  month: string;
  count: number;
}

export function MonthlyRefs() {
  const [monthlyData, setMonthlyData] = useState<MonthlyCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProposeRel[]>([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Remove the delay as it's no longer needed
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/graph/monthly-refs`);
        const result = await response.json();

        if (result && result.data) {
          setData(result.data);
          console.log("Monthly Refs data fetched successfully:", result.data.length);
        } else {
          console.error("Invalid response format:", result);
        }
      } catch (err) {
        console.error("Error fetching monthly refs data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process the data to get the monthly refs trends
  useEffect(() => {
    // More robust check for valid data
    if (!Array.isArray(data) || data.length === 0) return;

    // Group timestamps by month and count occurrences
    const monthCounts: Record<string, number> = {};

    data.forEach((item) => {
      if (!item.rel || !item.rel.timestamp) return;
      
      try {
        // Parse the timestamp and format as YYYY-MM
        const date = new Date(item.rel.timestamp);
        const monthKey = `${date.getFullYear().toString().slice(-2)}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        // Increment count for this month
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
      } catch (err) {
        console.error("Error parsing timestamp:", item.rel.timestamp, err);
      }
    });

    // Convert to array format needed for recharts
    const formattedData = Object.keys(monthCounts)
      .sort() // Sort chronologically
      .map((month) => ({
        month,
        count: monthCounts[month],
      }));

    setMonthlyData(formattedData);
  }, [data]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 mb-4">
        <h1>Monthly Proposed Referendums</h1>
        <p>Insights: We can share some insights here.</p>
      </div>
      <div style={{ width: "100%", height: 400 }}>
        {loading ? (
          <p>Loading data...</p>
        ) : monthlyData.length > 0 ? (
          <ResponsiveContainer>
            <LineChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={0} textAnchor="middle" />
              <YAxis
                label={{
                  value: "Number of Refs",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                name="Monthly Proposed Referendums"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
}
