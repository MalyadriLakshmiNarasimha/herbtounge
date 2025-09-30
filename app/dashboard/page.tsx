import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { MetricCard } from "@/components/dashboard/metric-card"
import { AuthenticityChart } from "@/components/dashboard/authenticity-chart"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { SupplierChart } from "@/components/dashboard/supplier-chart"
import { FlaskConical, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-balance">Overview Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Monitor herbal authenticity testing in real-time</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Samples Tested Today"
              value="247"
              change="+12% from yesterday"
              changeType="positive"
              icon={FlaskConical}
            />
            <MetricCard
              title="Authenticity Rate"
              value="92.4%"
              change="+2.1% from last week"
              changeType="positive"
              icon={CheckCircle2}
              iconColor="text-success"
            />
            <MetricCard
              title="Flagged Samples"
              value="19"
              change="3 require immediate attention"
              changeType="negative"
              icon={AlertTriangle}
              iconColor="text-destructive"
            />
            <MetricCard
              title="Average Purity"
              value="89.7%"
              change="+1.3% this month"
              changeType="positive"
              icon={TrendingUp}
              iconColor="text-accent"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <AuthenticityChart />
            <SupplierChart />
          </div>

          {/* Alerts Panel */}
          <AlertsPanel />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
