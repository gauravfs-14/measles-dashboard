"use client";
import AgeDistributionPanel from "@/components/panels/age-distribution-panel";
import CasesTimelinePanel from "@/components/panels/cases-timeline-panel";
import ExemptionRatesPanel from "@/components/panels/exemption-rates-panel";
import FilterPanel from "@/components/panels/filter-panel";
import VaccinationStatusPanel from "@/components/panels/vaccination-status-panel";
import { FilterProvider } from "@/context/filter-context";
import dynamic from "next/dynamic";

const MapPanel = dynamic(() => import("@/components/panels/map-panel"), {
  loading: () => <p>Loading map...</p>,
  ssr: false,
});

export default function Home() {
  return (
    <FilterProvider>
      <header className="w-full flex justify-center items-center p-4 mb-6 bg-green-800 text-white">
        <h1 className="text-2xl font-bold">Texas Measles Dashboard (2025)</h1>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div className="md:col-span-1 h-full">
            <FilterPanel className="h-full" />
          </div>
          <div className="md:col-span-2">
            <MapPanel />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4">
          <div className="col-span-full">
            <CasesTimelinePanel />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AgeDistributionPanel />
            <VaccinationStatusPanel />
          </div>
          <div className="col-span-full">
            <ExemptionRatesPanel />
          </div>
        </div>
      </main>
    </FilterProvider>
  );
}
