import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertTriangle, Shield } from "lucide-react"

interface AIResult {
  herbDetected: string
  purity: number
  isAuthentic: boolean
  confidence: number
  ritualHash: string
  modelVersion: string
}

interface AIResultCardProps {
  result: AIResult | null
  isAnalyzing: boolean
}

export function AIResultCard({ result, isAnalyzing }: AIResultCardProps) {
  if (isAnalyzing) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm font-medium">Analyzing sample with AI...</p>
            <p className="mt-1 text-xs text-muted-foreground">This may take a few moments</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center text-muted-foreground">
            <Shield className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-4 text-sm">Upload sensor data to begin analysis</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-2 ${result.isAuthentic ? "border-success" : "border-destructive"}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI Analysis Result</CardTitle>
          <Badge variant={result.isAuthentic ? "default" : "destructive"} className="text-sm">
            {result.isAuthentic ? (
              <>
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Authentic
              </>
            ) : (
              <>
                <AlertTriangle className="mr-1 h-4 w-4" />
                Adulterated
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Herb Detected</p>
            <p className="mt-1 text-2xl font-bold">{result.herbDetected}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Purity Level</p>
            <p className="mt-1 text-2xl font-bold">{result.purity}%</p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Confidence Score</p>
            <p className="text-sm font-medium">{result.confidence}%</p>
          </div>
          <Progress value={result.confidence} className="h-2" />
        </div>

        <div className="rounded-lg bg-secondary p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Ritual AI Verification</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{result.ritualHash}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Model: {result.modelVersion}</span>
          <span>Analyzed: {new Date().toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
