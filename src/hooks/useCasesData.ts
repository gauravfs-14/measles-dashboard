import { useState, useEffect } from "react";
import { useFilterContext } from "@/context/filter-context";
import vaccineStatusData from "@/data/json/cases_vaccine_status.json";
import agesData from "@/data/json/cases_ages.json";
import timelineData from "@/data/json/cases_over_time.json";

interface VaccinationStatusData {
  notVaccinatedUnknown: number;
  vaccinated1Dose: number;
  vaccinated2Dose: number;
}

interface AgeData {
  age: string;
  cases: number;
}

interface CountyCases {
  county: string;
  cases: { date: string; case: number }[];
}

export const useCasesData = () => {
  const [vaccinationStatus, setVaccinationStatus] =
    useState<VaccinationStatusData | null>(null);
  const [ageDistribution, setAgeDistribution] = useState<AgeData[]>([]);
  const [casesTimeline, setCasesTimeline] = useState<CountyCases[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { filters } = useFilterContext();

  useEffect(() => {
    try {
      // Filter and transform timeline data to match interface
      let filteredTimelineData = timelineData;

      // Apply county filter if selected
      if (filters.selectedCounty) {
        filteredTimelineData = filteredTimelineData.filter((county) =>
          county.county.includes(filters.selectedCounty as string)
        );
      }

      // Transform data to match interface
      filteredTimelineData = filteredTimelineData.map((county) => ({
        county: county.county,
        cases: county.cases.map((c) => ({ date: c.date, case: c.case })),
      }));

      // Filter by date range if specified
      if (filters.dateRange) {
        filteredTimelineData = filteredTimelineData.map((county) => ({
          ...county,
          cases: county.cases.filter((item) => {
            const date = new Date(item.date);
            const start = filters.dateRange?.start
              ? new Date(filters.dateRange.start)
              : null;
            const end = filters.dateRange?.end
              ? new Date(filters.dateRange.end)
              : null;

            if (start && date < start) return false;
            if (end && date > end) return false;
            return true;
          }),
        }));
      }

      // Filter by age group if specified
      let filteredAgeData = agesData.map((item) => ({
        age: item.age,
        cases: item.cases,
      }));
      if (filters.ageGroup) {
        filteredAgeData = filteredAgeData.filter(
          (item) => item.age === filters.ageGroup
        );
      }

      setVaccinationStatus(vaccineStatusData);
      setAgeDistribution(filteredAgeData);
      setCasesTimeline(filteredTimelineData);
      setLoading(false);
    } catch (err) {
      console.error("Error processing data:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setLoading(false);
    }
  }, [filters.selectedCounty, filters.dateRange, filters.ageGroup]);

  return {
    vaccinationStatus,
    ageDistribution,
    casesTimeline,
    loading,
    error,
  };
};
