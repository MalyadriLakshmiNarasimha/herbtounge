"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

interface VisualizationPanelProps {
  sensorData?: any
  result?: any
}

export function VisualizationPanel({ sensorData, result }: VisualizationPanelProps) {
  if (!sensorData || !result) {
    return null
  }

  const multiSensorData = [
    { name: "pH Sensor", value: sensorData.pH || 0 },
    { name: "Conductivity Sensor", value: sensorData.conductivity || 0 },
    { name: "ORP Sensor", value: sensorData.orp || 0 },
    { name: "Turbidity Sensor", value: sensorData.turbidity || 0 },
    { name: "Temperature Sensor", value: sensorData.temperature || 0 },
  ]

  const rfData = Array.from({ length: 50 }, (_, i) => ({
    frequency: 2400 + i * 10,
    amplitude: (sensorData.rf_resonator || 50) + Math.sin(i * 0.3) * 20 + Math.random() * 10,
  }))
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Sensor Data Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="mb-2 font-semibold">Multi-Sensor Electronic Tongue (E-Tongue)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={multiSensorData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">RF-based CSRR Sensor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rfData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="frequency"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: "Frequency (MHz)", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: "Amplitude (dB)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="amplitude" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
