import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const rasaProfiles = {
  ashwagandha: [
    { name: "Sweet (Madhura)", value: 40, description: "Nourishing and grounding" },
    { name: "Bitter (Tikta)", value: 35, description: "Detoxifying properties" },
    { name: "Astringent (Kashaya)", value: 25, description: "Toning and firming" },
  ],
  turmeric: [
    { name: "Bitter (Tikta)", value: 45, description: "Anti-inflammatory" },
    { name: "Pungent (Katu)", value: 35, description: "Warming and stimulating" },
    { name: "Astringent (Kashaya)", value: 20, description: "Purifying effect" },
  ],
  brahmi: [
    { name: "Bitter (Tikta)", value: 50, description: "Cooling and calming" },
    { name: "Sweet (Madhura)", value: 30, description: "Nourishing to mind" },
    { name: "Astringent (Kashaya)", value: 20, description: "Clarifying properties" },
  ],
}

export function RasaDetailedPanel() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Ayurvedic Rasa Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Traditional taste classification and properties</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ashwagandha" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ashwagandha">Ashwagandha</TabsTrigger>
            <TabsTrigger value="turmeric">Turmeric</TabsTrigger>
            <TabsTrigger value="brahmi">Brahmi</TabsTrigger>
          </TabsList>

          {Object.entries(rasaProfiles).map(([herb, profile]) => (
            <TabsContent key={herb} value={herb} className="mt-4 space-y-4">
              {profile.map((rasa, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{rasa.name}</span>
                    <Badge variant="secondary">{rasa.value}%</Badge>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full bg-chart-${(index % 5) + 1}`} style={{ width: `${rasa.value}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{rasa.description}</p>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
