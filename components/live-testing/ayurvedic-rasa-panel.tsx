import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const rasaData = [
  { name: "Sweet (Madhura)", value: 35, color: "bg-chart-1" },
  { name: "Bitter (Tikta)", value: 25, color: "bg-chart-2" },
  { name: "Pungent (Katu)", value: 20, color: "bg-chart-3" },
  { name: "Astringent (Kashaya)", value: 15, color: "bg-chart-4" },
  { name: "Sour (Amla)", value: 5, color: "bg-chart-5" },
]

export function AyurvedicRasaPanel() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Ayurvedic Rasa Profile</CardTitle>
        <p className="text-sm text-muted-foreground">Traditional taste classification</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {rasaData.map((rasa) => (
          <div key={rasa.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{rasa.name}</span>
              <Badge variant="secondary">{rasa.value}%</Badge>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className={`h-full ${rasa.color}`} style={{ width: `${rasa.value}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
