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

interface VoteData {
  month: string;
  aye_voter_count: number;
  nay_voter_count: number;
  split_voter_count: number;
  split_abstain_voter_count: number;
}

interface VoterChartProps {
  data: VoteData[];
}

export default function VoterChart({ data }: VoterChartProps) {
  // Sort data by month
  const sortedData = [...data].sort((a, b) => 
    new Date(a.month).getTime() - new Date(b.month).getTime()
  );

  // Process data to get total voter count for each month
  const chartData = sortedData.map((item) => {
    const totalVoters = 
      (item.aye_voter_count || 0) + 
      (item.nay_voter_count || 0) + 
      (item.split_voter_count || 0) + 
      (item.split_abstain_voter_count || 0);
    
    // Format month label
    const date = new Date(item.month);
    const formattedMonth = date.toLocaleString('default', { 
      month: 'short', 
      year: '2-digit' 
    });

    return {
      month: formattedMonth,
      totalVoters,
      ayeVoters: item.aye_voter_count || 0,
      nayVoters: item.nay_voter_count || 0,
      splitVoters: (item.split_voter_count || 0) + (item.split_abstain_voter_count || 0)
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
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="totalVoters" 
            name="Total Voters"
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="ayeVoters" 
            name="Aye Voters"
            stroke="#82ca9d" 
          />
          <Line 
            type="monotone" 
            dataKey="nayVoters" 
            name="Nay Voters"
            stroke="#ff8042" 
          />
          <Line 
            type="monotone" 
            dataKey="splitVoters" 
            name="Split Voters"
            stroke="#0088fe" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 