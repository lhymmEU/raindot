import { useState, useEffect } from "react";
import {
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Bar,
} from "recharts";
import type { RefVotingPowerTurnout } from "@/types/open-gov";

interface ParetoDataItem {
  id: string;
  title: string;
  votingPower: number;
  percentage: number;
  cumulativePercentage: number;
}

export function RefVotingPowerTurnout({
  data,
}: {
  data: RefVotingPowerTurnout[];
}) {
  const [paretoData, setParetoData] = useState<ParetoDataItem[]>([]);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    // Sort data in descending order by totalVotingPowerTurnout
    const sortedData = [...data].sort(
      (a, b) => b.totalVotingPowerTurnout - a.totalVotingPowerTurnout
    );

    // Calculate total voting power across all referendums
    const totalVotingPower = sortedData.reduce(
      (sum, item) => sum + item.totalVotingPowerTurnout,
      0
    );

    // Calculate cumulative percentages
    let cumulativePercentage = 0;
    const processedData = sortedData.map((item) => {
      const percentage =
        (item.totalVotingPowerTurnout / totalVotingPower) * 100;
      cumulativePercentage += percentage;

      return {
        id: item.id,
        title: item.title,
        votingPower: item.totalVotingPowerTurnout,
        percentage,
        cumulativePercentage,
      };
    });

    setParetoData(processedData);
  }, [data]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="h-[500px]">
          {paretoData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={paretoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  label={{
                    angle: -90,
                    position: "insideLeft",
                  }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  label={{
                    value: "Cumulative Percentage (%)",
                    angle: 90,
                    position: "insideRight",
                  }}
                />
                <Tooltip
                  formatter={(value: number | string, name: string) => {
                    if (name === "Cumulative %") {
                      return [
                        `${
                          typeof value === "number" ? value.toFixed(2) : value
                        }%`,
                        name,
                      ];
                    }
                    if (name === "Voting Power") {
                      return [
                        `${
                          typeof value === "number"
                            ? (value / 1000000).toFixed(2)
                            : value
                        }M`,
                        name,
                      ];
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
          )}
        </div>
      </div>
    </div>
  );
}
