import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type PredictionData = {
  name: string;
  Level1: number;
  Level2: number;
  Level3: number;
};

type Props = {
  val1: number;
  val2: number;
  val3: number;
};

const ThreeLevelChart = (props: Props) => {
  const data: PredictionData[] = [
    {
      name: "Level1",
      Level1: props.val1,
      Level2: 0,
      Level3: 0,
    },
    {
      name: "Level2",
      Level1: 0,
      Level2: props.val2,
      Level3: 0,
    },
    {
      name: "Level3",
      Level1: 0,
      Level2: 0,
      Level3: props.val3,
    },
  ];
  return (
    <div className="w-full h-96 p-4 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold text-center mb-4">
        Three-Level Prediction Chart
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Level1"
            stroke="#8884d8"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="Level2"
            stroke="#82ca9d"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="Level3"
            stroke="#ff7300"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThreeLevelChart;
