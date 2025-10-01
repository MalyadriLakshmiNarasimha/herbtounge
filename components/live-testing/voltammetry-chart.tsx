"use client"

import React from "react"
import dynamic from "next/dynamic"

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

interface VoltammetryData {
  Voltage: number[]
  Current: number[]
  name: string
}

interface VoltammetryChartProps {
  voltammetryData: VoltammetryData[]
}

export function VoltammetryChart({ voltammetryData }: VoltammetryChartProps) {
  return (
    <div className="w-full">
      {voltammetryData.length > 0 ? (
        <Plot
          data={voltammetryData.map((sample) => ({
            type: "scatter",
            mode: "lines+markers",
            x: sample.Voltage,
            y: sample.Current,
            name: sample.name,
            line: { shape: "spline" },
          }))}
          layout={{
            title: "Voltammetry Electrochemical Signature",
            xaxis: {
              title: "Voltage (V)",
              showgrid: true,
              gridcolor: "hsl(var(--border))",
            },
            yaxis: {
              title: "Current (μA)",
              showgrid: true,
              gridcolor: "hsl(var(--border))",
            },
            showlegend: true,
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
            font: {
              color: "hsl(var(--foreground))",
            },
          }}
          style={{ width: "100%", height: "500px" }}
        />
      ) : (
        <p className="text-gray-500">No voltammetry data available. Upload a file with voltammetry data to view the electrochemical signature.</p>
      )}
    </div>
  )
}
