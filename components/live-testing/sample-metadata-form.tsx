"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SampleMetadata {
  herbName: string
  batchId: string
  supplier: string
  operator: string
}

interface SampleMetadataFormProps {
  metadata: SampleMetadata
  onChange: (metadata: SampleMetadata) => void
}

const herbs = [
  "Ashwagandha",
  "Turmeric",
  "Brahmi",
  "Shatavari",
  "Triphala",
  "Guduchi",
  "Neem",
  "Tulsi",
  "Amla",
  "Haritaki",
]

export function SampleMetadataForm({ metadata, onChange }: SampleMetadataFormProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Sample Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="herbName">Herb Name</Label>
          <Select value={metadata.herbName} onValueChange={(value) => onChange({ ...metadata, herbName: value })}>
            <SelectTrigger id="herbName">
              <SelectValue placeholder="Select herb" />
            </SelectTrigger>
            <SelectContent>
              {herbs.map((herb) => (
                <SelectItem key={herb} value={herb}>
                  {herb}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="batchId">Batch ID</Label>
          <Input
            id="batchId"
            placeholder="e.g., ASH-2024-001"
            value={metadata.batchId}
            onChange={(e) => onChange({ ...metadata, batchId: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier</Label>
          <Input
            id="supplier"
            placeholder="e.g., Himalaya Herbs"
            value={metadata.supplier}
            onChange={(e) => onChange({ ...metadata, supplier: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="operator">Operator Name</Label>
          <Input
            id="operator"
            placeholder="e.g., Dr. Priya Sharma"
            value={metadata.operator}
            onChange={(e) => onChange({ ...metadata, operator: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
