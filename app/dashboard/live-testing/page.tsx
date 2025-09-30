"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FileUploadZone } from "@/components/live-testing/file-upload-zone"
import { SampleMetadataForm } from "@/components/live-testing/sample-metadata-form"
import { VisualizationPanel } from "@/components/live-testing/visualization-panel"
import { AIResultCard } from "@/components/live-testing/ai-result-card"
import { ShapExplainability } from "@/components/live-testing/shap-explainability"
import { AyurvedicRasaPanel } from "@/components/live-testing/ayurvedic-rasa-panel"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface SampleMetadata {
  herbName: string
  batchId: string
  supplier: string
  operator: string
}

interface AIResult {
  herbDetected: string
  purity: number
  isAuthentic: boolean
  confidence: number
  ritualHash: string
  modelVersion: string
}

export default function LiveTestingPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<SampleMetadata>({
    herbName: "",
    batchId: "",
    supplier: "",
    operator: "",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AIResult | null>(null)

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setResult(null)
  }

  const handleAnalyze = async () => {
    if (!uploadedFile || !metadata.herbName) {
      return
    }

    setIsAnalyzing(true)
    setResult(null)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock result
    const mockResult: AIResult = {
      herbDetected: metadata.herbName,
      purity: Math.random() > 0.3 ? Math.floor(85 + Math.random() * 15) : Math.floor(60 + Math.random() * 20),
      isAuthentic: Math.random() > 0.3,
      confidence: Math.floor(85 + Math.random() * 15),
      ritualHash: "0x" + Math.random().toString(16).substring(2, 18),
      modelVersion: "HerbalAuth-v2.1.0",
    }

    setResult(mockResult)
    setIsAnalyzing(false)
  }

  const canAnalyze = uploadedFile && metadata.herbName && metadata.batchId && !isAnalyzing

  return (
    <ProtectedRoute allowedRoles={["admin", "analyst"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-balance">Live Testing Analytics</h1>
              <p className="mt-2 text-muted-foreground">Upload sensor data for real-time AI analysis</p>
            </div>
            <Button onClick={handleAnalyze} disabled={!canAnalyze} size="lg">
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze Sample
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <FileUploadZone onFileUpload={handleFileUpload} />
              <VisualizationPanel />
              <AIResultCard result={result} isAnalyzing={isAnalyzing} />
            </div>

            <div className="space-y-6">
              <SampleMetadataForm metadata={metadata} onChange={setMetadata} />
              {result && (
                <>
                  <ShapExplainability />
                  <AyurvedicRasaPanel />
                </>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
