"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"
import { format } from "date-fns"

interface TestRecord {
  id: string
  batchId: string
  herb: string
  supplier: string
  purity: number
  status: "authentic" | "adulterated" | "pending"
  operator: string
  date: Date
  confidence: number
}

interface TestHistoryTableProps {
  records: TestRecord[]
  onViewDetails: (id: string) => void
}

export function TestHistoryTable({ records, onViewDetails }: TestHistoryTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "authentic":
        return <Badge variant="default">Authentic</Badge>
      case "adulterated":
        return <Badge variant="destructive">Adulterated</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPurityColor = (purity: number) => {
    if (purity >= 90) return "text-success"
    if (purity >= 75) return "text-warning"
    return "text-destructive"
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch ID</TableHead>
            <TableHead>Herb</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Purity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Operator</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-mono text-sm">{record.batchId}</TableCell>
              <TableCell className="font-medium">{record.herb}</TableCell>
              <TableCell>{record.supplier}</TableCell>
              <TableCell className={`font-semibold ${getPurityColor(record.purity)}`}>{record.purity}%</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
              <TableCell>{record.confidence}%</TableCell>
              <TableCell className="text-sm text-muted-foreground">{record.operator}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{format(record.date, "MMM dd, yyyy")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onViewDetails(record.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
