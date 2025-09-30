"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

// Mock sensor data
const rfData = Array.from({ length: 50 }, (_, i) => ({
  frequency: 2400 + i * 10,
  amplitude: Math.sin(i * 0.3) * 20 + 50 + Math.random() * 10,
}))

const nirData = Array.from({ length: 50 }, (_, i) => ({
  wavelength: 700 + i * 20,
  absorbance: Math.cos(i * 0.2) * 0.5 + 1 + Math.random() * 0.2,
}))

const voltData = Array.from({ length: 50 }, (_, i) => ({
  voltage: -1 + i * 0.04,
  current: Math.sin(i * 0.4) * 30 + Math.random() * 5,
}))

export function VisualizationPanel() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Sensor Data Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rf" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rf">RF Spectrum</TabsTrigger>
            <TabsTrigger value="nir">NIR/FTIR</TabsTrigger>
            <TabsTrigger value="volt">Voltammogram</TabsTrigger>
          </TabsList>

          <TabsContent value="rf" className="mt-4">
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
                <Line type="monotone" dataKey="amplitude" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="nir" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={nirData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="wavelength"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: "Wavelength (nm)", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: "Absorbance", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="absorbance" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="volt" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={voltData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="voltage"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: "Voltage (V)", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: "Current (μA)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="current" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
