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
  LabelList
} from "recharts";

interface Voter {
  wallet_address: string;
  name: string;
  vote_count: {
    low: number;
    high: number;
  }
}

export function ActiveVoters({ baseUrl }: { baseUrl: string }) {
  const [data, setData] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/graph`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `MATCH (v:Voter)-[:VOTED]->()
                    RETURN 
                      v.wallet_address AS wallet_address,
                      v.display_name AS name,
                      COUNT(*) AS vote_count
                    ORDER BY vote_count DESC
                    LIMIT 15`,
          }),
        });
        const result = await res.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching voter data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [baseUrl]);

  // Process data for the chart - use top 15 voters for better visibility
  const chartData = data.map(voter => ({
    name: voter.name || voter.wallet_address.substring(0, 8) + '...',
    votes: typeof voter.vote_count === 'object' ? voter.vote_count.low : voter.vote_count
  }));

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col gap-2 mb-4">
        <h1>Top 15 Voters</h1>
        <p>Insights: We can share some insights here.</p>
      </div>
      
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="w-full h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="category" dataKey="name" angle={-45} textAnchor="end" height={80} />
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
