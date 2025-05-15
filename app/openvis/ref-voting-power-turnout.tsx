export interface RefVotingPowerTurnout {
    id: string;
    title: string;
    voteCounts: number;
    totalVotingPowerTurnout: number;
}

import { useState, useEffect } from 'react';
import {  
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Line, 
  ComposedChart,
  Bar
} from 'recharts';

interface ParetoDataItem {
  id: string;
  title: string;
  votingPower: number;
  percentage: number;
  cumulativePercentage: number;
}

export function RefVotingPowerTurnout() {
  const [paretoData, setParetoData] = useState<ParetoDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RefVotingPowerTurnout[]>([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Remove the delay as it's no longer needed
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/graph/ref-voting-power`);
        const result = await response.json();

        if (result && result.data) {
          setData(result.data);
          console.log("Ref Voting Power Turnout data fetched successfully:", result.data.length);
        } else {
          console.error("Invalid ref voting power turnout data format:", result);
        }
      } catch (err) {
        console.error("Error fetching referendum voting power turnout data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;
    
    // Sort data in descending order by totalVotingPowerTurnout
    const sortedData = [...data].sort((a, b) => 
      b.totalVotingPowerTurnout - a.totalVotingPowerTurnout
    );

    // Calculate total voting power across all referendums
    const totalVotingPower = sortedData.reduce(
      (sum, item) => sum + item.totalVotingPowerTurnout, 0
    );

    // Calculate cumulative percentages
    let cumulativePercentage = 0;
    const processedData = sortedData.map(item => {
      const percentage = (item.totalVotingPowerTurnout / totalVotingPower) * 100;
      cumulativePercentage += percentage;
      
      return {
        id: item.id,
        title: item.title,
        votingPower: item.totalVotingPowerTurnout,
        percentage,
        cumulativePercentage
      };
    });

    setParetoData(processedData);
  }, [data]);

  return (
    <div className="w-full">
      <h1>Referendum Voting Power Distribution</h1>
      <div className="mb-6">
        <div className="mt-6 mb-4">
          <ul className="list-disc pl-5">
            <li>The chart shows referendums ordered by voting power turnout (descending)</li>
            <li>The orange line shows the cumulative percentage of total voting power</li>
            <li>Steeper initial curve indicates higher inequality in voting power distribution</li>
          </ul>
        </div>
        <div className="h-[500px]">
          {loading ? (
            <p>Loading data...</p>
          ) : paretoData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={paretoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  label={{ 
                    angle: -90, 
                    position: 'insideLeft' 
                  }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  domain={[0, 100]} 
                  label={{ 
                    value: 'Cumulative Percentage (%)', 
                    angle: 90, 
                    position: 'insideRight' 
                  }}
                />
                <Tooltip 
                  formatter={(value: number | string, name: string) => {
                    if (name === 'Cumulative %') {
                      return [`${typeof value === 'number' ? value.toFixed(2) : value}%`, name];
                    }
                    if (name === 'Voting Power') {
                      return [`${typeof value === 'number' ? (value / 1000000).toFixed(2) : value}M`, name];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(value, entry) => {
                    // The first entry in tooltipItem array contains the data point
                    if (entry && entry.length > 0 && entry[0].payload?.title) {
                      return `Ref: ${entry[0].payload.title}`;
                    }
                    return value;
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="votingPower" 
                  fill="#4f46e5" 
                  name="Voting Power" 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="cumulativePercentage" 
                  stroke="#ff7300" 
                  name="Cumulative %" 
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}