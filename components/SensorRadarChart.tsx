"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Papa from "papaparse";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface SensorRadarChartProps {
  file: File | null;
  runAnalysisTrigger: number;
  onVoltammetryData?: (data: VoltammetryData[]) => void; // callback to pass voltammetry data
}

interface VoltammetryData {
  Voltage: number[];
  Current: number[];
  name: string;
}

const SensorRadarChart: React.FC<SensorRadarChartProps> = ({ file, runAnalysisTrigger, onVoltammetryData }) => {
  const [samples, setSamples] = useState<any[]>([]);

  const labels = ["pH", "Conductivity", "ORP", "Turbidity", "Temperature", "CSRR Feature"];

  useEffect(() => {
    if (!file) {
      setSamples([]);
      if (onVoltammetryData) onVoltammetryData([]);
      return;
    }

    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        complete: (results: any) => {
          const parsed = results.data.map((row: any) => {
            // Find sample name key ignoring case
            const sampleNameKey = Object.keys(row).find(
              (key) => key.toLowerCase() === "sampleid"
            );
            // Parse voltammetry data if present as JSON string in a column named "Voltammetry"
            let voltammetry: VoltammetryData | null = null;
            if (row.Voltammetry) {
              try {
                const voltData = JSON.parse(row.Voltammetry);
                voltammetry = {
                  Voltage: voltData.Voltage,
                  Current: voltData.Current,
                  name: sampleNameKey ? row[sampleNameKey] : "Unknown Sample",
                };
              } catch {
                voltammetry = null;
              }
            }
            return {
              name: sampleNameKey ? row[sampleNameKey] : "Unknown Sample",
              values: [
                parseFloat(row.pH),
                parseFloat(row.Conductivity),
                parseFloat(row.ORP),
                parseFloat(row.Turbidity),
                parseFloat(row.Temperature),
                parseFloat(row.CSRR_Feature),
              ],
              voltammetry,
            };
          });
          setSamples(parsed);
          if (onVoltammetryData) {
              const voltDataArray = parsed
                .map((s: { voltammetry: VoltammetryData | null }) => s.voltammetry)
                .filter((v: VoltammetryData | null): v is VoltammetryData => v !== null);
              onVoltammetryData(voltDataArray);
          }
        },
      });
    } else if (file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target?.result) return;
        const jsonData = JSON.parse(event.target.result as string);
        const parsed = jsonData.map((row: any) => {
          // Find sample name key ignoring case
          const sampleNameKey = Object.keys(row).find(
            (key) => key.toLowerCase() === "sampleid"
          );
          return {
            name: sampleNameKey ? row[sampleNameKey] : "Unknown Sample",
            values: [
              row.pH,
              row.Conductivity,
              row.ORP,
              row.Turbidity,
              row.Temperature,
              row.CSRR_Feature,
            ],
            voltammetry: row.Voltammetry
              ? {
                  Voltage: row.Voltammetry.Voltage,
                  Current: row.Voltammetry.Current,
                  name: sampleNameKey ? row[sampleNameKey] : "Unknown Sample",
                }
              : null,
          };
        });
        setSamples(parsed);
        if (onVoltammetryData) {
          const voltDataArray = parsed
            .map((s: { voltammetry: VoltammetryData | null }) => s.voltammetry)
            .filter((v: VoltammetryData | null): v is VoltammetryData => v !== null);
          onVoltammetryData(voltDataArray);
        }
      };
      reader.readAsText(file);
    }
  }, [file, runAnalysisTrigger, onVoltammetryData]);

  return (
    <div className="w-full">
      {samples.length > 0 ? (
        <Plot
          data={samples.map((s) => ({
            type: "scatterpolar",
            r: [...s.values, s.values[0]],
            theta: [...labels, labels[0]],
            fill: "toself",
            name: s.name,
          }))}
          layout={{
            polar: {
              radialaxis: { visible: true, range: [0, 400] },
            },
            showlegend: true,
            title: "Herbal Sensor Array Fingerprint",
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
          }}
          style={{ width: "100%", height: "500px" }}
        />
      ) : (
        <p className="text-gray-500">Upload a CSV or JSON file and click "Run Live Test" to view sensor data.</p>
      )}
    </div>
  );
};

export default SensorRadarChart;
