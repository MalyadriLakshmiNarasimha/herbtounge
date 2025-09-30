"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "Day 1", authentic: 92, adulterated: 8 },
  { date: "Day 5", authentic: 88, adulterated: 12 },
  { date: "Day 10", authentic: 94, adulterated: 6 },
  { date: "Day 15", authentic: 90, adulterated: 10 },
  { date: "Day 20", authentic: 95, adulterated: 5 },
  { date: "Day 25", authentic: 91, adulterated: 9 },
  { date: "Day 30", authentic: 93, adulterated: 7 },
]

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
