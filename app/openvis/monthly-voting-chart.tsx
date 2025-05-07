'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DotVotingData {
  month: string;
  aye_dot: number;
  nay_dot: number;
  abstain_dot: number;
  aye_voting_power: number;
  nay_voting_power: number;
  abstain_voting_power: number;
  aye_per_nay_ratio: number | null;
}

interface DotVotingChartProps {
  data: DotVotingData[];
}

export default function MonthlyVotingChart({ data }: DotVotingChartProps) {
  // Sort data by month
  const sortedData = [...data].sort((a, b) => 
    new Date(a.month).getTime() - new Date(b.month).getTime()
  );

  // Process data for the chart
  const chartData = sortedData.map((item) => {
    // Format month label
    const date = new Date(item.month);
    const formattedMonth = date.toLocaleString('default', { 
      month: 'short', 
      year: '2-digit' 
    });

    return {
      month: formattedMonth,
      ayeVotingPower: item.aye_voting_power,
      nayVotingPower: item.nay_voting_power
    };
  });

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis 
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            formatter={(value, name) => {
              const displayName = name === "Aye Voting Power" ? "Aye Voting Power" : "Nay Voting Power";
              return [`${(Number(value) / 1000000).toFixed(2)}M`, displayName];
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="ayeVotingPower" 
            name="Aye Voting Power"
            stroke="#0088fe" 
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="nayVotingPower" 
            name="Nay Voting Power"
            stroke="#ff4d4f" 
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 