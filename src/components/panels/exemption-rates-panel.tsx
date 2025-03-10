"use client";
import React, { useState } from "react";
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
  const [sortBy, setSortBy] = useState<"alphabetical" | "rate">("rate");

  // Selected year from filters
  const selectedYear =
    filters.year || (years?.length ? years[years.length - 1] : "2023-2024");

  // Prepare data for the chart - take top 10 counties by exemption rate for the selected year
  const chartData = React.useMemo(() => {
    if (!data.length || !selectedYear) return [];

    // Map county to exemption rate for the selected year
    const mappedData = data.map((county) => ({
      county: county.county,
      rate: (county[selectedYear] as number) * 100, // Convert to percentage
    }));

    // Sort by rate or alphabetically
    let sortedData = [...mappedData];
    if (sortBy === "rate") {
      sortedData.sort((a, b) => (b.rate || 0) - (a.rate || 0));
    } else {
      sortedData.sort((a, b) => a.county.localeCompare(b.county));
    }

    // Take top 15 counties if sorting by rate, otherwise all counties
    return sortBy === "rate" ? sortedData.slice(0, 15) : sortedData;
  }, [data, selectedYear, sortBy]);

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
          <div className="flex-1 grid gap-1">
            <Label htmlFor="sort">Sort By</Label>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as any)}
            >
              <SelectTrigger id="sort">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rate">Highest Rate</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" unit="%" />
            <YAxis dataKey="county" type="category" width={60} />
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
