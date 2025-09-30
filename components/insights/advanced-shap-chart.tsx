"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const globalShapData = [
  { feature: "RF Peak Intensity", impact: 0.45, color: "hsl(var(--chart-1))" },
  { feature: "NIR Absorption 1450nm", impact: 0.38, color: "hsl(var(--chart-2))" },
  { feature: "Voltammetry Peak", impact: 0.32, color: "hsl(var(--chart-3))" },
  { feature: "FTIR Band 1650cm⁻¹", impact: 0.28, color: "hsl(var(--chart-4))" },
  { feature: "Color Chromaticity", impact: 0.22, color: "hsl(var(--chart-5))" },
  { feature: "Moisture Content", impact: 0.18, color: "hsl(var(--chart-1))" },
  { feature: "Particle Size", impact: 0.15, color: "hsl(var(--chart-2))" },
  { feature: "pH Level", impact: 0.12, color: "hsl(var(--chart-3))" },
]

const localShapData = [
  { feature: "RF Peak Intensity", impact: 0.52, direction: "positive" },
  { feature: "NIR Absorption 1450nm", impact: -0.31, direction: "negative" },
  { feature: "Voltammetry Peak", impact: 0.28, direction: "positive" },
  { feature: "FTIR Band 1650cm⁻¹", impact: 0.19, direction: "positive" },
  { feature: "Color Chromaticity", impact: -0.15, direction: "negative" },
]

export function AdvancedShapChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>SHAP Explainability Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Understanding AI decision-making process</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="global">Global Importance</TabsTrigger>
            <TabsTrigger value="local">Local Explanation</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={globalShapData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  dataKey="feature"
                  type="category"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  width={150}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="impact" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="local" className="mt-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={localShapData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[-0.6, 0.6]} />
                <YAxis
                  dataKey="feature"
                  type="category"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  width={150}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="impact"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                  shape={(props: any) => {
                    const { x, y, width, height, payload } = props
                    const fill = payload.direction === "positive" ? "hsl(var(--success))" : "hsl(var(--destructive))"
                    return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-success" />
                <span className="text-sm text-muted-foreground">Increases Authenticity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-destructive" />
                <span className="text-sm text-muted-foreground">Decreases Authenticity</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
