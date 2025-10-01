"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const generateData = () => {
  const suppliers = ["Himalaya Herbs", "Organic India", "Patanjali", "Dabur", "Baidyanath", "Sri Sri Tattva", "Charak Pharma", "Zandu"]
  const result = suppliers.map((supplier) => ({
    supplier,
    authenticity: Math.floor(85 + Math.random() * 15),
  }))
  return result
}

const data = generateData()

export function SupplierChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Supplier Reliability</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="supplier"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="authenticity" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
