"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Download, Upload } from "lucide-react"

const models = [
  {
    id: "1",
    name: "HerbalAuth Advanced",
    version: "2.1.0",
    accuracy: 96.8,
    deployedDate: "2024-01-15",
    status: "active",
    size: "245 MB",
  },
  {
    id: "2",
    name: "HerbalAuth Advanced",
    version: "2.0.5",
    accuracy: 95.2,
    deployedDate: "2023-12-10",
    status: "archived",
    size: "238 MB",
  },
  {
    id: "3",
    name: "HerbalAuth Baseline",
    version: "1.5.2",
    accuracy: 89.4,
    deployedDate: "2023-11-05",
    status: "archived",
    size: "180 MB",
  },
]

export function ModelRegistry() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Model Registry</CardTitle>
            <p className="text-sm text-muted-foreground">Manage AI model versions and deployments</p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Model
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {models.map((model) => (
          <div key={model.id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{model.name}</p>
                  {model.status === "active" && (
                    <Badge variant="default" className="gap-1">
                      <Zap className="h-3 w-3" />
                      Active
                    </Badge>
                  )}
                  {model.status === "archived" && <Badge variant="secondary">Archived</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Version {model.version}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Accuracy</p>
                <p className="font-medium">{model.accuracy}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Deployed</p>
                <p className="font-medium">{model.deployedDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Size</p>
                <p className="font-medium">{model.size}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {model.status === "archived" && (
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Zap className="mr-2 h-4 w-4" />
                  Deploy
                </Button>
              )}
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
