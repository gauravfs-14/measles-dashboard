import { useEffect, useState } from "react";
import { useFilterContext } from "@/context/filter-context";

// Define types for the data
interface MeaslesData {
  id: number;
  country: string;
  region: string;
  year: number;
  month?: number;
  cases: number;
  deaths?: number;
  ageGroup?: string;
  vaccinationRate?: number;
  date?: string;
}

export function useMeaslesData(
  dataType: "cases" | "trends" | "demographics" | "vaccinations" = "cases"
) {
  const [data, setData] = useState<MeaslesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { filters } = useFilterContext();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch the appropriate data based on dataType
        const response = await fetch(`/json/${dataType}.json`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData: MeaslesData[] = await response.json();

        // Apply filters
        const filteredData = jsonData.filter((item) => {
          let matches = true;

          if (filters.year && item.year !== filters.year) matches = false;
          if (filters.country && item.country !== filters.country)
            matches = false;
          if (filters.region && item.region !== filters.region) matches = false;
          if (filters.ageGroup && item.ageGroup !== filters.ageGroup)
            matches = false;

          if (filters.startDate && item.date) {
            const itemDate = new Date(item.date);
            if (itemDate < filters.startDate) matches = false;
          }

          if (filters.endDate && item.date) {
            const itemDate = new Date(item.date);
            if (itemDate > filters.endDate) matches = false;
          }

          return matches;
        });

        setData(filteredData);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dataType, filters]);

  return { data, loading, error };
}
