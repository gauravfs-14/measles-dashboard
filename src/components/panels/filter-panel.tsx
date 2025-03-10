"use client";
import React from "react";
import { useMapData } from "@/hooks/useMapData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface FilterPanelProps {
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ className = "" }) => {
  const { filters, updateFilter, resetFilters, mmrData } = useMapData();

  // Get list of counties for dropdown
  const countyOptions = React.useMemo(() => {
    // Only use the data after the header row (first item)
    const data = mmrData.length > 0 ? mmrData : [];
    return data
      .filter((item) => item.county && item.county !== "State")
      .map((item) => item.county)
      .sort();
  }, [mmrData]);

  // Helper function to handle the county selection
  const handleCountyChange = (value: string) => {
    updateFilter("selectedCounty", value === "all" ? undefined : value);
  };

  // Helper function to handle min cases change with proper type conversion
  const handleMinCasesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value === "" ? 0 : parseInt(value);
    updateFilter("minCases", numValue);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Filter Map Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="county">County</Label>
          <Select
            value={filters.selectedCounty || "all"}
            onValueChange={handleCountyChange}
          >
            <SelectTrigger id="county">
              <SelectValue placeholder="All Counties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counties</SelectItem>
              {countyOptions.map((county) => (
                <SelectItem key={county} value={county}>
                  {county}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="vaccRate">Minimum Vaccination Rate</Label>
          <Select
            value={filters.minVaccRate || "0"}
            onValueChange={(value) => updateFilter("minVaccRate", value)}
          >
            <SelectTrigger id="vaccRate">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All</SelectItem>
              <SelectItem value="0.7">70%+</SelectItem>
              <SelectItem value="0.8">80%+</SelectItem>
              <SelectItem value="0.9">90%+</SelectItem>
              <SelectItem value="0.95">95%+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="minCases">Minimum Cases</Label>
          <Input
            id="minCases"
            type="number"
            min="0"
            value={filters.minCases || 0}
            onChange={handleMinCasesChange}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="show-only-cases"
            checked={filters.showOnlyCases || false}
            onCheckedChange={(checked) =>
              updateFilter("showOnlyCases", checked)
            }
          />
          <Label htmlFor="show-only-cases" className="cursor-pointer">
            Show only counties with cases
          </Label>
        </div>

        <Button variant="outline" onClick={resetFilters} className="w-full">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
