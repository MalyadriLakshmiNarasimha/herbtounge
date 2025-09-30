"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const suppliers = [
  { name: "Himalaya Herbs", authenticity: 96, samples: 1247, rating: "excellent" },
  { name: "Organic India", authenticity: 94, samples: 982, rating: "excellent" },
  { name: "Dabur", authenticity: 92, samples: 1534, rating: "good" },
  { name: "Patanjali", authenticity: 88, samples: 876, rating: "good" },
  { name: "Baidyanath", authenticity: 90, samples: 654, rating: "good" },
]

export function SupplierReliability() {
  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case "excellent":
        return <Badge variant="default">Excellent</Badge>
      case "good":
        return <Badge variant="secondary">Good</Badge>
      default:
        return <Badge variant="secondary">{rating}</Badge>
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Supplier Reliability Scores</CardTitle>
        <p className="text-sm text-muted-foreground">Based on authenticity rate across all tests</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {suppliers.map((supplier) => (
          <div key={supplier.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">{supplier.name}</p>
                <p className="text-xs text-muted-foreground">{supplier.samples} samples tested</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{supplier.authenticity}%</span>
                {getRatingBadge(supplier.rating)}
              </div>
            </div>
            <Progress value={supplier.authenticity} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
