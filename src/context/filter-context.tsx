"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface FilterState {
  selectedCounty?: string;
  minVaccRate?: string;
  minCases?: number;
  showOnlyCases?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  ageGroup?: string;
  year?: string;
  vaccinationStatus?: string;
}

interface FilterContextType {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const initialFilters: FilterState = {
  selectedCounty: undefined,
  minVaccRate: "0",
  minCases: 0,
  showOnlyCases: false,
  dateRange: undefined,
  ageGroup: undefined,
  year: "2023-2024",
  vaccinationStatus: undefined,
};

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilter, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};
