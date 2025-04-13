"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCasesData } from "@/hooks/useCasesData";
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

const COLORS = [
  "#899DA4",
  "#74A089",
  "#F8AFA8",
  "#C93312",
  "#F5CDB4",
  "#D8B70A",
  "#9A8822",
  "#DC863B",
  "#972D15",
  "#02401B",
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="font-semibold mb-2 text-sm">{label}</p>
      <div className="grid grid-cols-4 gap-4">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            />
            <span className="mr-2 text-xs">{item.name}:</span>
            <span className="font-semibold text-xs">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CasesTimelinePanel: React.FC = () => {
  const { casesTimeline, loading, error } = useCasesData();
  interface DataPoint {
    date: string;
    [countyName: string]: string | number;
  }

  const [chartData, setChartData] = useState<DataPoint[]>([]);

  // Combine all county data into a single timeline
  useEffect(() => {
    if (!casesTimeline.length) return;

    // Get all unique dates
    const allDates = new Set<string>();
    casesTimeline.forEach((county) => {
      county.cases.forEach((c) => allDates.add(c.date));
    });

    // Sort dates chronologically
    const sortedDates = Array.from(allDates).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // Create a data point for each date with all counties
    const combinedData = sortedDates.map((date) => {
      const dataPoint: DataPoint = { date };

      casesTimeline.forEach((county) => {
        const caseForDate = county.cases.find((c) => c.date === date);
        const countyName = county.county.split(",")[0]; // Remove state suffix
        dataPoint[countyName] = caseForDate ? caseForDate.case : 0;
      });

      return dataPoint;
    });

    setChartData(combinedData);
  }, [casesTimeline]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cases Timeline</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          Loading timeline data...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle>Cases Timeline</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center text-red-500">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cases Timeline</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          No timeline data available
        </CardContent>
      </Card>
    );
  }

  // Get all counties for the legend
  const counties = casesTimeline.map((county) => county.county.split(",")[0]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cases Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {counties.map((county, index) => (
              <Line
                key={county}
                type="monotone"
                dataKey={county}
                stroke={COLORS[index % COLORS.length]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CasesTimelinePanel;
