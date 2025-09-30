"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FilterPanel } from "@/components/history/filter-panel"
import { TestHistoryTable } from "@/components/history/test-history-table"
import { ExportPanel } from "@/components/history/export-panel"
import { SupplierReliability } from "@/components/history/supplier-reliability"
import { HerbalCluster3D } from "@/components/insights/herbal-cluster-3d"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface FilterState {
  herb: string
  supplier: string
  status: string
  dateFrom: Date | undefined
  dateTo: Date | undefined
  batchId: string
}

// Mock test records
const mockRecords = Array.from({ length: 50 }, (_, i) => ({
  id: `test-${i + 1}`,
  batchId: `ASH-2024-${String(i + 1).padStart(3, "0")}`,
  herb: ["Ashwagandha", "Turmeric", "Brahmi", "Shatavari"][i % 4],
  supplier: ["Himalaya Herbs", "Organic India", "Patanjali", "Dabur"][i % 4],
  purity: Math.floor(70 + Math.random() * 30),
  status: ["authentic", "authentic", "authentic", "adulterated", "pending"][i % 5] as
    | "authentic"
    | "adulterated"
    | "pending",
  operator: ["Dr. Priya Sharma", "Rajesh Kumar", "Anita Desai"][i % 3],
  date: new Date(2024, 0, 1 + i),
  confidence: Math.floor(85 + Math.random() * 15),
}))

export default function HistoryPage() {
  const [filters, setFilters] = useState<FilterState>({
    herb: "all",
    supplier: "all",
    status: "all",
    dateFrom: undefined,
    dateTo: undefined,
    batchId: "",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10

  const resetFilters = () => {
    setFilters({
      herb: "all",
      supplier: "all",
      status: "all",
      dateFrom: undefined,
      dateTo: undefined,
      batchId: "",
    })
  }

  const handleViewDetails = (id: string) => {
    alert(`Viewing details for test ${id}`)
  }

  // Filter records
  const filteredRecords = mockRecords.filter((record) => {
    if (filters.herb !== "all" && record.herb.toLowerCase() !== filters.herb) return false
    if (filters.supplier !== "all" && !record.supplier.toLowerCase().includes(filters.supplier)) return false
    if (filters.status !== "all" && record.status !== filters.status) return false
    if (filters.batchId && !record.batchId.toLowerCase().includes(filters.batchId.toLowerCase())) return false
    return true
  })

  // Paginate records
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage)
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-balance">Test History Explorer</h1>
            <p className="mt-2 text-muted-foreground">
              Browse and analyze past authenticity tests with advanced filtering
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="space-y-6">
              <FilterPanel filters={filters} onFilterChange={setFilters} onReset={resetFilters} />
              <ExportPanel />
            </div>

            <div className="space-y-6 lg:col-span-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {paginatedRecords.length} of {filteredRecords.length} records
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TestHistoryTable records={paginatedRecords} onViewDetails={handleViewDetails} />

              <SupplierReliability />

              <HerbalCluster3D />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
