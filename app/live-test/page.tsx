"use client";
import React, { useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";

export default function LiveTestPage() {
  const [samples, setSamples] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");

  const labels = [
    "pH",
    "Conductivity",
    "ORP",
    "Turbidity",
    "Temperature",
    "Moisture",
    "RF Resonator",
  ];

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        complete: (results: any) => {
          const parsed = results.data.map((row: any) => ({
            name: row.SampleID || "Unknown Sample",
            values: [
              parseFloat(row.pH),
              parseFloat(row.Conductivity),
              parseFloat(row.ORP),
              parseFloat(row.Turbidity),
              parseFloat(row.Temperature),
              parseFloat(row.Moisture),
              parseFloat(row.RF_Resonator),
            ],
          }));
          setSamples(parsed);
        },
      });
    } else if (file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target?.result) return;
        const jsonData = JSON.parse(event.target.result as string);
        setSamples(jsonData);
      };
      reader.readAsText(file);
    }
  };

  // Run Test → Send to Backend
  const runTest = async () => {
    if (samples.length === 0) return;
    try {
      const response = await fetch("http://127.0.0.1:8000/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(samples[0]), // send first sample
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">🌿 Live Herb Authenticity Test</h1>

      {/* File Upload */}
      <div className="border p-4 rounded-lg bg-gray-50">
        <input type="file" accept=".csv,.json" onChange={handleFileUpload} />
        {fileName && <p className="mt-2 text-sm text-gray-600">📂 {fileName} uploaded</p>}
        <button
          onClick={runTest}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          🚀 Run Live Test
        </button>
      </div>

      {/* Radar Chart */}
      {samples.length > 0 && samples[0].values && (
        <Plot
          data={samples.map((s: any) => ({
            type: "scatterpolar",
            r: [...s.values, s.values[0]],
            theta: [...labels, labels[0]],
            fill: "toself",
            name: s.name,
          }))}
          layout={{
            polar: { radialaxis: { visible: true, range: [0, 400] } },
            showlegend: true,
            title: "Sensor Fingerprint (Radar)",
          }}
          style={{ width: "100%", height: "500px" }}
        />
      )}

      {/* Voltammetry Plot */}
      {samples.length > 0 && samples[0].voltammetry ? (
        <Plot
          data={[
            {
              x: samples[0].voltammetry.Voltage,
              y: samples[0].voltammetry.Current,
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "blue" },
            },
          ]}
          layout={{
            title: "Voltammetry Curve (V vs I)",
            xaxis: { title: "Voltage (V)" },
            yaxis: { title: "Current (A)" },
          }}
          style={{ width: "100%", height: "400px" }}
        />
      ) : (
        <p className="text-gray-500">
          No voltammetry data available. Upload a JSON file with voltammetry data.
        </p>
      )}

      {/* Results */}
      {result && (
        <div
          className={`p-4 rounded-lg shadow-md ${
            result.adulterationFlag ? "bg-red-100" : "bg-green-100"
          }`}
        >
          <h2 className="text-xl font-bold">✅ Test Result</h2>
          <p>Herb: {result.herbName}</p>
          <p>Purity: {result.purityPercent}%</p>
          <p>Confidence: {result.confidenceScore}</p>
          <p>
            Status:{" "}
            {result.adulterationFlag ? "🚨 Adulterated" : "🌿 Authentic"}
          </p>
        </div>
      )}
    </div>
  );
}
