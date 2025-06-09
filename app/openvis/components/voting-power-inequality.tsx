"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { VotingPowerInequality } from "@/types/open-gov";

export function VotingPowerInequality({
  data,
}: {
  data: VotingPowerInequality[];
}) {
  const [lorenzData, setLorenzData] = useState<
    { x: number; lorenz: number; equality: number }[]
  >([]);
  const [giniCoefficient, setGiniCoefficient] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processData = async () => {
      try {
        // Process data for Lorenz curve and calculate Gini coefficient
        calculateLorenzAndGini(data);
      } catch (err) {
        console.error("Error fetching voter data:", err);
        setError("Failed to load voter data");
      }
    };

    processData();
  }, [data]);

  const calculateLorenzAndGini = (data: VotingPowerInequality[]) => {
    if (!data.length) return;

    // Sort data by voting power (ascending)
    const sortedData = [...data].sort(
      (a, b) => a.totalVotingPower - b.totalVotingPower
    );

    // Calculate total voting power
    const totalVotingPower = sortedData.reduce(
      (sum, voter) => sum + voter.totalVotingPower,
      0
    );

    // Generate points for the Lorenz curve
    const lorenzPoints: { x: number; lorenz: number; equality: number }[] = [];

    let cumulativeVotingPower = 0;

    // Add starting point (0,0)
    lorenzPoints.push({ x: 0, lorenz: 0, equality: 0 });

    // Calculate cumulative percentages
    sortedData.forEach((voter, index) => {
      cumulativeVotingPower += voter.totalVotingPower;

      const percentilePopulation = ((index + 1) / sortedData.length) * 100;
      const percentileVotingPower =
        (cumulativeVotingPower / totalVotingPower) * 100;

      lorenzPoints.push({
        x: percentilePopulation,
        lorenz: percentileVotingPower,
        equality: percentilePopulation,
      });
    });

    setLorenzData(lorenzPoints);

    // Calculate Gini coefficient
    // The Gini coefficient is the ratio of the area between the equality line and Lorenz curve
    // to the total area under the equality line
    let areaUnderLorenz = 0;
    for (let i = 1; i < lorenzPoints.length; i++) {
      // Calculate area of each trapezoid
      const width = lorenzPoints[i].x - lorenzPoints[i - 1].x;
      const height = (lorenzPoints[i].lorenz + lorenzPoints[i - 1].lorenz) / 2;
      areaUnderLorenz += width * height;
    }

    // Area under equality line is 5000 (100 * 100 / 2)
    const areaUnderEquality = 5000;
    const areaBetweenCurves = areaUnderEquality - areaUnderLorenz;
    const gini = areaBetweenCurves / areaUnderEquality;

    setGiniCoefficient(gini);
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="p-4 bg-gray-100 rounded-md">
            <p>Gini Coefficient: {giniCoefficient.toFixed(4)}</p>
            <p className="text-gray-600">
              The Gini coefficient measures inequality (0 = perfect equality, 1
              = maximum inequality). Higher values indicate greater
              concentration of voting power.
            </p>
            <div className="mt-4">
              <p className="mb-2">How to Interpret:</p>
              <ul className="list-disc pl-5">
                <li>
                  The <span className="text-[#82ca9d]">green line</span>{" "}
                  represents perfect equality (everyone has equal voting power)
                </li>
                <li>
                  The <span className="text-[#8884d8]">purple line</span> shows
                  the actual distribution of voting power (Lorenz curve)
                </li>
                <li>
                  The greater the distance between the curves, the higher the
                  inequality
                </li>
                <li>
                  Gini coefficient of {giniCoefficient.toFixed(2)} indicates{" "}
                  {interpretGini(giniCoefficient)}
                </li>
              </ul>
            </div>
          </div>

          <div className="h-[500px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lorenzData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  label={{
                    value: "Cumulative % of Voters",
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{
                    value: "Cumulative % of Voting Power",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  labelFormatter={(value) =>
                    `${Number(value).toFixed(2)}% of voters`
                  }
                />
                <Legend verticalAlign="top" align="center" height={36} />
                <Line
                  type="monotone"
                  dataKey="lorenz"
                  name="Lorenz Curve"
                  stroke="#8884d8"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="equality"
                  name="Perfect Equality"
                  stroke="#82ca9d"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

function interpretGini(gini: number): string {
  if (gini < 0.2) return "very low inequality";
  if (gini < 0.3) return "low inequality";
  if (gini < 0.4) return "moderate inequality";
  if (gini < 0.5) return "high inequality";
  return "very high inequality";
}
