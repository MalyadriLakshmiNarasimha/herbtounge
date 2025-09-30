import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ModelPerformanceCard } from "@/components/insights/model-performance-card"
import { HerbalCluster3D } from "@/components/insights/herbal-cluster-3d"
import { AdvancedShapChart } from "@/components/insights/advanced-shap-chart"
import { ModelComparison } from "@/components/insights/model-comparison"
import { RasaDetailedPanel } from "@/components/insights/rasa-detailed-panel"

const models = [
  {
    name: "HerbalAuth Advanced",
    version: "2.1.0",
    metrics: { accuracy: 96.8, precision: 95.2, recall: 97.1, f1Score: 96.1 },
    isActive: true,
  },
  {
    name: "HerbalAuth Baseline",
    version: "1.5.2",
    metrics: { accuracy: 89.4, precision: 87.8, recall: 90.2, f1Score: 89.0 },
    isActive: false,
  },
]

export default function InsightsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-balance">AI Insights Explorer</h1>
            <p className="mt-2 text-muted-foreground">Deep dive into model performance and explainability</p>
          </div>

          {/* Model Performance Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {models.map((model) => (
              <ModelPerformanceCard
                key={model.version}
                modelName={model.name}
                version={model.version}
                metrics={model.metrics}
                isActive={model.isActive}
              />
            ))}
          </div>

          {/* Model Comparison */}
          <ModelComparison />

          {/* SHAP Analysis */}
          <AdvancedShapChart />

          {/* 3D Cluster Visualization */}
          <HerbalCluster3D />

          {/* Ayurvedic Rasa Analysis */}
          <RasaDetailedPanel />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
