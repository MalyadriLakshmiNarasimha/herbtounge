 "use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Papa from "papaparse";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface SensorRadarChartProps {
  file: File | null;
  runAnalysisTrigger: number;
  onVoltammetryData?: (data: VoltammetryData[]) => void; // callback to pass voltammetry data
  onSensorData?: (data: any) => void; // callback to pass sensor data
}

interface VoltammetryData {
  Voltage: number[];
  Current: number[];
  name: string;
}

const SensorRadarChart: React.FC<SensorRadarChartProps> = ({ file, runAnalysisTrigger, onVoltammetryData, onSensorData }) => {
  const [samples, setSamples] = useState<any[]>([]);

  const labels = ["pH", "Conductivity", "ORP", "Turbidity", "Temperature", "Moisture", "RF Resonator"];

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
                parseFloat(row.Moisture),
                parseFloat(row.RF_Resonator),
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
          if (onSensorData && parsed.length > 0) {
            const s = parsed[0];
            const sensors = {
              voltammetry: s.voltammetry ? s.voltammetry.Current : [0.1,0.2,0.3],
              pH: s.values[0],
              conductivity: s.values[1],
              tds_ec: s.values[1],
              orp: s.values[2],
              turbidity: s.values[3],
              temperature: s.values[4],
              moisture: s.values[5],
              ion_selective: { Na: 10, K: 5, Ca: 3 },
              rf_resonator: s.values[6]
            };
            onSensorData(sensors);
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
              row.conductivity,
              row.orp,
              row.turbidity,
              row.temperature,
              row.moisture,
              row.rf_resonator,
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
        if (onSensorData && parsed.length > 0) {
          const s = parsed[0];
          const sensors = {
            voltammetry: s.voltammetry ? s.voltammetry.Current : [0.1,0.2,0.3],
            pH: s.values[0],
            conductivity: s.values[1],
            tds_ec: s.values[1],
            orp: s.values[2],
            turbidity: s.values[3],
            temperature: s.values[4],
            moisture: s.values[5],
            ion_selective: { Na: 10, K: 5, Ca: 3 },
            rf_resonator: s.values[6]
          };
          onSensorData(sensors);
        }
      };
      reader.readAsText(file);
    }
  }, [file, runAnalysisTrigger, onVoltammetryData, onSensorData]);

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

export { SensorRadarChart };
