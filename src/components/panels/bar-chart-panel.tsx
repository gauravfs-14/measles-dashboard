"use client";
import React from "react";
import { useMeaslesData } from "@/hooks/use-measles-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartPanelProps {
  title: string;
  dataType: "cases" | "trends" | "demographics" | "vaccinations";
  xKey: string;
  barKey: string;
  color?: string;
}

const BarChartPanel: React.FC<BarChartPanelProps> = ({
  title,
  dataType,
  xKey,
  barKey,
  color = "#8884d8",
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
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={barKey} fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartPanel;
