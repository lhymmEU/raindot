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
interface ProposeRel {
  rel: {
    timestamp: string;
  };
}

interface MonthlyCount {
  month: string;
  count: number;
}

export function MonthlyRefs({ baseUrl }: { baseUrl: string }) {
  const [data, setData] = useState<ProposeRel[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all the refs from the database
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/api/graph`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query:
              "MATCH ()-[rel:PROPOSED]->() RETURN { timestamp: rel.timestamp } AS rel",
          }),
        });
        const result = await res.json();
        if (result && result.data) {
          setData(result.data);
        } else {
          setError("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching refs data:", err);
        setError("Failed to fetch referendum data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [baseUrl]);

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
    <div>
      <div className="flex flex-col gap-2 mb-4">
        <h1>Monthly Proposed Referendums</h1>
        <p>Insights: We can share some insights here.</p>
      </div>
      <div style={{ width: "100%", height: 400 }}>
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p>Error: {error}</p>
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
