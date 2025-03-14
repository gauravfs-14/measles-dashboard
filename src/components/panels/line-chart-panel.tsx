"use client";
import React from "react";
import { useMeaslesData } from "@/hooks/use-measles-data";
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

interface LineChartPanelProps {
  title: string;
  dataType: "cases" | "trends" | "demographics" | "vaccinations";
  xKey: string;
  lineKeys: Array<{ key: string; color: string }>;
}

const LineChartPanel: React.FC<LineChartPanelProps> = ({
  title,
  dataType,
  xKey,
  lineKeys,
}) => {
  const { data, loading, error } = useMeaslesData(dataType);

  if (loading)
    return (
      <div className="p-4 border rounded-lg bg-white shadow-md">
        Loading data...
      </div>
    );
  if (error)
    return (
      <div className="p-4 border rounded-lg bg-red-50 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {lineKeys.map((lineKey, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={lineKey.key}
                stroke={lineKey.color}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartPanel;
