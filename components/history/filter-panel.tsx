"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"

interface FilterState {
  herb: string
  supplier: string
  status: string
  dateFrom: Date | undefined
  dateTo: Date | undefined
  batchId: string
}

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onReset: () => void
}

export function FilterPanel({ filters, onFilterChange, onReset }: FilterPanelProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="herb">Herb Name</Label>
          <Select value={filters.herb} onValueChange={(value) => onFilterChange({ ...filters, herb: value })}>
            <SelectTrigger id="herb">
              <SelectValue placeholder="All herbs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All herbs</SelectItem>
              <SelectItem value="ashwagandha">Ashwagandha</SelectItem>
              <SelectItem value="turmeric">Turmeric</SelectItem>
              <SelectItem value="brahmi">Brahmi</SelectItem>
              <SelectItem value="shatavari">Shatavari</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier</Label>
          <Select value={filters.supplier} onValueChange={(value) => onFilterChange({ ...filters, supplier: value })}>
            <SelectTrigger id="supplier">
              <SelectValue placeholder="All suppliers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All suppliers</SelectItem>
              <SelectItem value="himalaya">Himalaya Herbs</SelectItem>
              <SelectItem value="organic">Organic India</SelectItem>
              <SelectItem value="patanjali">Patanjali</SelectItem>
              <SelectItem value="dabur">Dabur</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={filters.status} onValueChange={(value) => onFilterChange({ ...filters, status: value })}>
            <SelectTrigger id="status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="authentic">Authentic</SelectItem>
              <SelectItem value="adulterated">Adulterated</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="batchId">Batch ID</Label>
          <Input
            id="batchId"
            placeholder="Search batch ID..."
            value={filters.batchId}
            onChange={(e) => onFilterChange({ ...filters, batchId: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? format(filters.dateFrom, "PPP") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) => onFilterChange({ ...filters, dateFrom: date })}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? format(filters.dateTo, "PPP") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(date) => onFilterChange({ ...filters, dateTo: date })}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
