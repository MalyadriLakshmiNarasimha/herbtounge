import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertTriangle, Shield } from "lucide-react"

interface AIResult {
  herbName: string
  purityPercent: number
  adulterationFlag: boolean
  confidenceScore: number
  tasteProfile: string[]
  recommendation: string
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

  const isAuthentic = !result.adulterationFlag
  const confidencePercent = Math.round(result.confidenceScore * 100)

  return (
    <Card className={`border-2 ${isAuthentic ? "border-green-500" : "border-red-500"}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI Analysis Result</CardTitle>
          <Badge variant={isAuthentic ? "default" : "destructive"} className="text-sm">
            {isAuthentic ? (
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
            <p className="mt-1 text-2xl font-bold">{result.herbName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Purity Level</p>
            <p className="mt-1 text-2xl font-bold">{result.purityPercent}%</p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Confidence Score</p>
            <p className="text-sm font-medium">{confidencePercent}%</p>
          </div>
          <Progress value={confidencePercent} className="h-2" />
        </div>

        <div className="rounded-lg bg-secondary p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Taste Profile</p>
              <p className="mt-1 text-sm text-muted-foreground">{result.tasteProfile.join(", ")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-secondary p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Recommendation</p>
              <p className="mt-1 text-sm text-muted-foreground">{result.recommendation}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Analyzed: {new Date().toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
