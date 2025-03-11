"use client";
import React, { useState, useEffect, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { useDebouncedCallback } from "use-debounce";

interface FilterPanelProps {
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ className = "" }) => {
  const { filters, updateFilter, resetFilters, mmrData } = useMapData();
  const [minCasesInput, setMinCasesInput] = useState<string>(
    filters.minCases?.toString() || ""
  );

  // Create debounced update function with proper typing
  const debouncedUpdateFilter = useDebouncedCallback(
    <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => {
      updateFilter(key, value);
    },
    300
  );

  // Get list of counties for dropdown
  const countyOptions = useMemo(() => {
    const data = mmrData.length > 0 ? mmrData : [];
    return data
      .filter((item) => item.county && item.county !== "State")
      .map((item) => item.county)
      .sort();
  }, [mmrData]);

  // Filtered county options for display
  const displayedCountyOptions = useMemo(() => {
    return filters.selectedCounty ? [filters.selectedCounty] : countyOptions;
  }, [countyOptions, filters.selectedCounty]);

  // Helper function to handle the county selection
  const handleCountyChange = (value: string) => {
    updateFilter("selectedCounty", value === "all" ? undefined : value);
  };

  // Helper function to handle min cases change with debouncing
  const handleMinCasesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinCasesInput(value);
    const numValue = value === "" ? undefined : parseInt(value);
    debouncedUpdateFilter("minCases" as keyof typeof filters, numValue);
  };

  // Check if filters are active
  const activeFilters = useMemo(() => {
    return {
      county: !!filters.selectedCounty,
      vaccRate: !!filters.minVaccRate && filters.minVaccRate !== "0",
      minCases: filters.minCases !== undefined && filters.minCases > 0,
      showOnlyCases: !!filters.showOnlyCases,
    };
  }, [filters]);

  // Update minCasesInput when filters are reset
  useEffect(() => {
    setMinCasesInput(filters.minCases?.toString() || "");
  }, [filters.minCases]);

  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Filter Map Data
          </CardTitle>
          {hasActiveFilters && (
            <Badge variant="secondary">Filters Active</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="flex justify-between">
            <Label htmlFor="county">County</Label>
            {activeFilters.county && <Badge variant="outline">Active</Badge>}
          </div>
          <Select
            value={filters.selectedCounty || "all"}
            onValueChange={handleCountyChange}
          >
            <SelectTrigger id="county">
              <SelectValue placeholder="All Counties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counties</SelectItem>
              {displayedCountyOptions.map((county) => (
                <SelectItem key={county} value={county}>
                  {county}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <div className="flex justify-between">
            <Label htmlFor="vaccRate">Minimum Vaccination Rate</Label>
            {activeFilters.vaccRate && <Badge variant="outline">Active</Badge>}
          </div>
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
          <div className="flex justify-between">
            <Label htmlFor="minCases">Minimum Cases</Label>
            {activeFilters.minCases && <Badge variant="outline">Active</Badge>}
          </div>
          <Input
            id="minCases"
            type="number"
            min="0"
            value={minCasesInput}
            onChange={handleMinCasesChange}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
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
          {activeFilters.showOnlyCases && (
            <Badge variant="outline">Active</Badge>
          )}
        </div>

        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full"
          disabled={!hasActiveFilters}
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
