import { useState, useEffect } from "react";
import { useFilterContext } from "@/context/filter-context";
import exemptionsData from "@/data/json/conscientious_exemptions.json";

export interface ExemptionData {
  county: string;
  [year: string]: string | number;
}

export const useExemptionsData = () => {
  const [data, setData] = useState<ExemptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { filters } = useFilterContext();

  useEffect(() => {
    try {
      // Filter data based on current filters
      let filteredData = exemptionsData as ExemptionData[];

      if (filters.selectedCounty) {
        filteredData = filteredData.filter(
          (item) => item.county === filters.selectedCounty
        );
      }

      setData(filteredData);
      setLoading(false);
    } catch (err) {
      console.error("Error processing exemption data:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setLoading(false);
    }
  }, [filters.selectedCounty]);

  // Get available years for filtering
  const years = Object.keys(data[0] || {}).filter(
    (key) => key !== "county" && !isNaN(Number(key.slice(0, 4)))
  );

  return {
    data,
    loading,
    error,
    years,
  };
};
