"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type FilterState = {
  year: number | null;
  country: string | null;
  region: string | null;
  ageGroup: string | null;
  startDate: Date | null;
  endDate: Date | null;
};

type FilterContextType = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>({
    year: null,
    country: null,
    region: null,
    ageGroup: null,
    startDate: null,
    endDate: null,
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};
