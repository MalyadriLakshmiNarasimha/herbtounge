"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scatter, ScatterChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ZAxis } from "recharts"

// Mock PCA data for herbal clusters
const authenticData = Array.from({ length: 30 }, () => ({
  x: Math.random() * 40 + 30,
  y: Math.random() * 40 + 30,
  z: Math.random() * 100 + 50,
  type: "Authentic",
}))

const adulteratedData = Array.from({ length: 15 }, () => ({
  x: Math.random() * 30 + 10,
  y: Math.random() * 30 + 10,
  z: Math.random() * 80 + 20,
  type: "Adulterated",
}))

export function HerbalCluster3D() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>3D Herbal Cluster Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">PCA visualization of authentic vs adulterated samples</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              dataKey="x"
              name="PC1"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: "Principal Component 1", position: "insideBottom", offset: -10 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="PC2"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: "Principal Component 2", angle: -90, position: "insideLeft" }}
            />
            <ZAxis type="number" dataKey="z" range={[50, 400]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Scatter name="Authentic" data={authenticData} fill="hsl(var(--success))" />
            <Scatter name="Adulterated" data={adulteratedData} fill="hsl(var(--destructive))" />
          </ScatterChart>
        </ResponsiveContainer>

        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Authentic Samples</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-sm text-muted-foreground">Adulterated Samples</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
