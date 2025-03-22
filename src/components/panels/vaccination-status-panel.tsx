"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCasesData } from "@/hooks/useCasesData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#FF8042", "#FFBB28", "#00C49F"];

const VaccinationStatusPanel: React.FC = () => {
  const { vaccinationStatus, loading, error } = useCasesData();

  // Transform data for the bar chart
  const chartData = vaccinationStatus
    ? [
        {
          name: "Unvaccinated/Unknown",
          Cases: vaccinationStatus.notVaccinatedUnknown,
        },
        {
          name: "Vaccinated 1+ Dose",
          Cases: vaccinationStatus.vaccinated1Dose,
        },
        {
          name: "Vaccinated 2+ Dose",
          Cases: vaccinationStatus.vaccinated2Dose,
        },
      ]
    : [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vaccination Status</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          Loading vaccination status data...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle>Vaccination Status</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center text-red-500">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cases by Vaccination Status</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} cases`, ""]} />
            <Legend />
            <Bar dataKey="Cases" fill="#F8AFA8">
              {chartData.map((entry, index) => (
                <Bar
                  key={`bar-${index}`}
                  dataKey="Cases"
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VaccinationStatusPanel;
