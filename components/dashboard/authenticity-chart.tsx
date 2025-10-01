"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { useEffect, useState } from "react"

const generateData = () => {
  const result = []
  for (let i = 1; i <= 30; i++) {
    const authentic = Math.floor(85 + Math.random() * 10)
    const adulterated = 100 - authentic
    result.push({ date: `Day ${i}`, authentic, adulterated })
  }
  return result
}

const data = generateData()

export function AuthenticityChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Authenticity Trend (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="authentic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="adulterated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="authentic"
              stroke="hsl(var(--success))"
              fillOpacity={1}
              fill="url(#authentic)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="adulterated"
              stroke="hsl(var(--destructive))"
              fillOpacity={1}
              fill="url(#adulterated)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
