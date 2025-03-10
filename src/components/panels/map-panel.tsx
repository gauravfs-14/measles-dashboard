/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMapData } from "../../hooks/useMapData";
import { Feature } from "geojson";
import L from "leaflet";

// Fix for Leaflet default icon issue in webpack
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Card } from "@/components/ui/card";

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPanelProps {
  height?: string;
  width?: string;
  className?: string;
}

const MapPanel: React.FC<MapPanelProps> = ({
  height = "600px",
  width = "100%",
  className = "",
}) => {
  const { geoData, mmrData, casesData, filters, loading, error } = useMapData();

  // Get color based on MMR vaccination percentage
  const getColor = (percentage: number | null): string => {
    if (percentage === null) return "#cccccc"; // No data
    if (percentage >= 0.95) return "#1a9850"; // Very high (green)
    if (percentage >= 0.9) return "#91cf60"; // High
    if (percentage >= 0.85) return "#d9ef8b"; // Moderate high
    if (percentage >= 0.8) return "#fee08b"; // Moderate
    if (percentage >= 0.75) return "#fc8d59"; // Moderate low
    return "#d73027"; // Low (red)
  };

  // Create a map of counties with cases for faster lookups
  const countiesWithCasesMap = useMemo(() => {
    const map = new Map<string, number>();
    casesData.forEach((item) => {
      const countyName = item.county.split(",")[0];
      map.set(countyName, item.cases);
    });
    return map;
  }, [casesData]);

  // Style for counties
  const countyStyle = (feature: any) => {
    const countyName = feature.properties.NAME || "";
    const countyData = mmrData.find((item) => item.county === countyName);
    const percentage = countyData?.percentage || null;
    const hasCases = countiesWithCasesMap.has(countyName);

    // If we're showing only counties with cases and this county has none, make it less visible
    if (filters.showOnlyCases && !hasCases) {
      return {
        fillColor: "#eaeaea",
        weight: 0.5,
        opacity: 0.5,
        color: "#999",
        dashArray: "3",
        fillOpacity: 0.2,
      };
    }

    return {
      fillColor: getColor(percentage),
      weight: 1,
      opacity: 1,
      color: "#666",
      dashArray: "3",
      fillOpacity: hasCases ? 0.8 : 0.7, // Slightly highlight counties with cases
    };
  };

  // When hovering over a feature
  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    if (feature.properties && feature.properties.NAME) {
      const countyName = feature.properties.NAME;

      // Get MMR data for this county
      const countyMmrData = mmrData.find((item) => item.county === countyName);
      const mmrPercentage = countyMmrData?.percentage
        ? (countyMmrData.percentage * 100).toFixed(1) + "%"
        : "No data";

      // Get cases data for this county
      const caseCount = countiesWithCasesMap.get(countyName) || 0;

      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 2,
            color: "#000",
            dashArray: "",
            fillOpacity: 0.9,
          });
          layer.bringToFront();
        },
        mouseout: () => {
          if (geoData) {
            (layer as L.Path).setStyle(countyStyle(feature));
          }
        },
      });

      // Create tooltip content
      layer.bindTooltip(
        `
        <div class="font-sans p-2">
          <h4 class="font-bold text-base mb-1">${countyName} County, TX</h4>
          <p class="text-sm mb-1">MMR Vaccination Rate: ${mmrPercentage}</p>
          <p class="text-sm ${caseCount > 0 ? "font-bold text-red-600" : ""}">
            Measles Cases: ${caseCount}
          </p>
        </div>
      `,
        { sticky: true }
      );
    }
  };

  // Render vaccination rate legend
  const renderLegend = () => (
    <div className="absolute bottom-6 right-2 bg-white p-2 rounded-md shadow-md z-[1000]">
      <h4 className="text-sm font-semibold mb-1">MMR Vaccination Rate</h4>
      <div className="flex flex-col gap-1">
        <div className="flex items-center text-xs">
          <span className="inline-block w-4 h-4 mr-2 border border-gray-400 bg-[#1a9850]"></span>
          <span>95%+</span>
        </div>
        <div className="flex items-center text-xs">
          <span className="inline-block w-4 h-4 mr-2 border border-gray-400 bg-[#91cf60]"></span>
          <span>90-95%</span>
        </div>
        <div className="flex items-center text-xs">
          <span className="inline-block w-4 h-4 mr-2 border border-gray-400 bg-[#d9ef8b]"></span>
          <span>85-90%</span>
        </div>
        <div className="flex items-center text-xs">
          <span className="inline-block w-4 h-4 mr-2 border border-gray-400 bg-[#fee08b]"></span>
          <span>80-85%</span>
        </div>
        <div className="flex items-center text-xs">
          <span className="inline-block w-4 h-4 mr-2 border border-gray-400 bg-[#fc8d59]"></span>
          <span>75-80%</span>
        </div>
        <div className="flex items-center text-xs">
          <span className="inline-block w-4 h-4 mr-2 border border-gray-400 bg-[#d73027]"></span>
          <span>&lt;75%</span>
        </div>
        <div className="flex items-center text-xs">
          <span className="inline-block w-4 h-4 mr-2 border border-gray-400 bg-[#cccccc]"></span>
          <span>No data</span>
        </div>
        {filters.showOnlyCases && (
          <div className="flex items-center text-xs mt-2 pt-2 border-t border-gray-200">
            <span className="inline-block w-4 h-4 mr-2 border border-gray-400 bg-[#eaeaea]"></span>
            <span>No cases</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading)
    return <div className="p-6 text-center">Loading map data...</div>;
  if (error)
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  if (!geoData)
    return <div className="p-6 text-center">No geographic data available</div>;

  return (
    <Card className={`overflow-hidden relative ${className}`}>
      <div style={{ height, width }} className="relative">
        <MapContainer
          center={[31.8, -99.9]} // Center of Texas
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <GeoJSON
            data={geoData}
            style={countyStyle}
            onEachFeature={onEachFeature}
            key={JSON.stringify(filters)} // Force re-render on filter change
          />
        </MapContainer>
        {renderLegend()}
      </div>
    </Card>
  );
};

export default MapPanel;
