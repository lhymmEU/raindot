export interface FortuneTeller {
  walletAddress: string;
  name: string;
  totalVotes: {
    low: number;
    high: number;
  };
  // Correct votes: voted aye <> ref passed; voted nay <> ref failed
  correctVotes: {
    low: number;
    high: number;
  };
}

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HistogramBin {
  range: string;
  count: number;
  rangeStart: number;
  rangeEnd: number;
}

export function FortuneTeller() {
  const [histogramData, setHistogramData] = useState<HistogramBin[]>([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FortuneTeller[]>([]);
  const [averageAccuracy, setAverageAccuracy] = useState<number>(0);
  const [medianAccuracy, setMedianAccuracy] = useState<number>(0);
  const [totalVoters, setTotalVoters] = useState<number>(0);
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Remove the delay as it's no longer needed
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/graph/fortune-teller`);
        const result = await response.json();

        if (result && result.data) {
          setData(result.data);
          console.log("Fortune Teller data fetched successfully:", result.data.length);
        } else {
          console.error("Invalid fortune teller data format:", result);
        }
      } catch (err) {
        console.error("Error fetching fortune teller data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;
    
    // Calculate ratio for each fortune teller and filter out those with no votes
    const withRatio = data
      .filter(teller => teller.totalVotes.low > 0) // Only include voters who have voted
      .map(teller => ({
        ...teller,
        ratio: teller.totalVotes.low > 0 ? teller.correctVotes.low / teller.totalVotes.low : 0,
      }));
    
    setTotalVoters(withRatio.length);
    
    // Calculate average accuracy
    const sum = withRatio.reduce((acc, teller) => acc + teller.ratio, 0);
    const avg = (sum / withRatio.length) * 100;
    setAverageAccuracy(parseFloat(avg.toFixed(1)));
    
    // Calculate median accuracy
    const sortedRatios = [...withRatio].sort((a, b) => a.ratio - b.ratio).map(t => t.ratio);
    const mid = Math.floor(sortedRatios.length / 2);
    const median = sortedRatios.length % 2 === 0
      ? ((sortedRatios[mid - 1] + sortedRatios[mid]) / 2) * 100
      : sortedRatios[mid] * 100;
    setMedianAccuracy(parseFloat(median.toFixed(1)));
    
    // Create histogram bins (0-10%, 10-20%, etc.)
    const bins: HistogramBin[] = Array.from({ length: 11 }, (_, i) => ({
      range: i < 10 ? `${i * 10}-${(i + 1) * 10}%` : '100%',
      count: 0,
      rangeStart: i * 10,
      rangeEnd: i < 10 ? (i + 1) * 10 : 100
    }));
    
    // Populate histogram bins
    withRatio.forEach(teller => {
      const percentage = teller.ratio * 100;
      // Special case for 100%
      if (percentage === 100) {
        bins[10].count++;
      } else {
        const binIndex = Math.floor(percentage / 10);
        if (binIndex >= 0 && binIndex < 10) {
          bins[binIndex].count++;
        }
      }
    });
    
    setHistogramData(bins);
  }, [data]);

  // Custom color based on accuracy range
  const getBarColor = (binStart: number) => {
    if (binStart >= 70) return "#4ade80"; // Green for high accuracy
    if (binStart >= 40) return "#facc15"; // Yellow for medium accuracy
    return "#f87171"; // Red for low accuracy
  };

  return (
    <div className="w-full" style={{ height: '600px', minHeight: '400px' }}>
      <h1 className="mb-2">Fortune Teller</h1>
      <div className="text-sm text-gray-600 mb-6">
        <p>Distribution of accuracy across {totalVoters} voters who have participated in referendums</p>
        <p>Average accuracy: {averageAccuracy}% | Median accuracy: {medianAccuracy}%</p>
      </div>
      
      {loading ? (
        <p>Loading data...</p>
      ) : histogramData.length > 0 ? (
        <ResponsiveContainer width="100%" height="80%">
          <BarChart
            data={histogramData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="range" 
              label={{ 
                value: 'Accuracy Range', 
                position: 'insideBottom', 
                offset: -10 
              }}
            />
            <YAxis 
              label={{ 
                value: 'Number of Voters', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'count') return [value, 'Voters'];
                return [value, name];
              }}
              labelFormatter={(label) => `Accuracy Range: ${label}`}
            />
            <Bar 
              dataKey="count" 
              name="Voters" 
              radius={[4, 4, 0, 0]}
            >
              {histogramData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.rangeStart)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}