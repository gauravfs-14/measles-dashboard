"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExemptionsData } from "@/hooks/useExemptionsData";
import { useFilterContext } from "@/context/filter-context";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ExemptionRatesPanel: React.FC = () => {
  const { data, loading, error, years } = useExemptionsData();
  const { filters, updateFilter } = useFilterContext();

  // Selected year from filters
  const selectedYear =
    filters.year || (years?.length ? years[years.length - 1] : "2023-2024");

  // Prepare data for the chart - take top 20 counties by exemption rate for the selected year
  const chartData = React.useMemo(() => {
    if (!data.length || !selectedYear) return [];

    // Map county to exemption rate for the selected year
    const mappedData = data.map((county) => ({
      county: county.county,
      rate: (county[selectedYear] as number) * 100, // Convert to percentage
    }));

    // Sort by rate (highest first)
    const sortedData = [...mappedData].sort(
      (a, b) => (b.rate || 0) - (a.rate || 0)
    );

    // Take top 20 counties
    return sortedData.slice(0, 20);
  }, [data, selectedYear]);

  const handleYearChange = (value: string) => {
    updateFilter("year", value);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exemption Rates</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          Loading exemption data...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle>Exemption Rates</CardTitle>
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
        <CardTitle>Conscientious Exemption Rates</CardTitle>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1 grid gap-1">
            <Label htmlFor="year">School Year</Label>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger id="year">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years?.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-200">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" unit="%" />
            <YAxis
              dataKey="county"
              type="category"
              width={60}
              // label={"Counties"}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [
                `${Number(value).toFixed(2)}%`,
                "Exemption Rate",
              ]}
            />
            <Legend />
            <Bar dataKey="rate" name="Exemption Rate (%)" fill="#2fa05f" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExemptionRatesPanel;
