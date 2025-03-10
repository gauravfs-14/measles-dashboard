/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

// Import static data directly
import mmrData from "../data/json/mmr_map_kinder_long.json";
import casesData from "../data/json/cases_map.json";

export interface MMRData {
  county: string;
  percentage: number | null;
}

export interface CasesData {
  county: string;
  cases: number;
}

export interface MapFilters {
  minVaccRate?: string;
  minCases?: number;
  selectedCounty?: string;
  showOnlyCases?: boolean;
}

interface MapDataContextType {
  geoData: any;
  mmrData: MMRData[];
  casesData: CasesData[];
  visibleCounties: string[];
  loading: boolean;
  error: string | null;
  filters: MapFilters;
  updateFilter: (key: keyof MapFilters, value: any) => void;
  resetFilters: () => void;
}

const MapDataContext = createContext<MapDataContextType | undefined>(undefined);

export const MapDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [filteredMmrData, setFilteredMmrData] = useState<MMRData[]>([]);
  const [filteredCasesData, setFilteredCasesData] = useState<CasesData[]>([]);
  const [visibleCounties, setVisibleCounties] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MapFilters>({});

  // Load GeoJSON data
  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json"
        );

        // Filter to only Texas counties
        const texasGeoJSON = {
          ...response.data,
          features: response.data.features.filter(
            (feature: any) => feature.properties.STATE === "48" // FIPS code for Texas
          ),
        };

        setGeoData(texasGeoJSON);
        setError(null);
      } catch (err) {
        setError("Failed to fetch geographic data");
        console.error("Error loading GeoJSON:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  // Process MMR data
  useEffect(() => {
    // Skip if there's no MMR data
    if (mmrData.length === 0) return;

    // Remove the first item which is a header row
    const processedMmrData = mmrData.slice(1) as MMRData[];

    // Apply filters to MMR data
    let filtered = [...processedMmrData];

    if (filters.minVaccRate && filters.minVaccRate !== "0") {
      filtered = filtered.filter(
        (item) =>
          item.percentage !== null &&
          item.percentage >= parseFloat(filters.minVaccRate!)
      );
    }

    if (filters.selectedCounty) {
      filtered = filtered.filter(
        (item) => item.county === filters.selectedCounty
      );
    }

    setFilteredMmrData(filtered);
  }, [filters]);

  // Process cases data
  useEffect(() => {
    // Skip if there's no cases data
    if (casesData.length === 0) return;

    // Parse the county names to match with MMR data
    const processedCasesData = casesData.map((item) => ({
      ...item,
      county: item.county.split(",")[0],
    })) as CasesData[];

    // Apply filters to cases data
    let filtered = [...processedCasesData];

    if (filters.minCases && filters.minCases > 0) {
      filtered = filtered.filter((item) => item.cases >= filters.minCases!);
    }

    if (filters.selectedCounty) {
      filtered = filtered.filter(
        (item) => item.county === filters.selectedCounty
      );
    }

    setFilteredCasesData(filtered);

    // Update the list of visible counties based on cases
    const countySet = new Set(filtered.map((item) => item.county));
    setVisibleCounties(Array.from(countySet));
  }, [filters]);

  // Update filter values
  const updateFilter = (key: keyof MapFilters, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      console.log("Filters updated:", newFilters); // Debug log
      return newFilters;
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({});
  };

  return (
    <MapDataContext.Provider
      value={{
        geoData,
        mmrData: filteredMmrData,
        casesData: filteredCasesData,
        visibleCounties,
        loading,
        error,
        filters,
        updateFilter,
        resetFilters,
      }}
    >
      {children}
    </MapDataContext.Provider>
  );
};

export const useMapData = () => {
  const context = useContext(MapDataContext);
  if (!context) {
    throw new Error("useMapData must be used within a MapDataProvider");
  }
  return context;
};
