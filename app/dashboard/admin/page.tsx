"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SystemStats } from "@/components/admin/system-stats"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { DeviceCalibrationPanel } from "@/components/admin/device-calibration-panel"
import { ModelRegistry } from "@/components/admin/model-registry"
import { AuditLogs } from "@/components/admin/audit-logs"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockUsers = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    email: "admin@herbalauth.com",
    role: "admin" as const,
    status: "active" as const,
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    email: "analyst@herbalauth.com",
    role: "analyst" as const,
    status: "active" as const,
    lastActive: "5 hours ago",
  },
  {
    id: "3",
    name: "Anita Desai",
    email: "viewer@herbalauth.com",
    role: "viewer" as const,
    status: "active" as const,
    lastActive: "1 day ago",
  },
  {
    id: "4",
    name: "Vikram Singh",
    email: "vikram@herbalauth.com",
    role: "analyst" as const,
    status: "inactive" as const,
    lastActive: "1 week ago",
  },
]

export default function AdminPage() {
  const [users] = useState(mockUsers)

  const handleEditUser = (id: string) => {
    alert(`Editing user ${id}`)
  }

  const handleDeleteUser = (id: string) => {
    alert(`Deleting user ${id}`)
  }

  const handleChangeRole = (id: string) => {
    alert(`Changing role for user ${id}`)
  }

  const handleAddUser = () => {
    alert("Adding new user")
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-balance">Admin Control Panel</h1>
              <p className="mt-2 text-muted-foreground">Manage users, devices, models, and system settings</p>
            </div>
            <Button onClick={handleAddUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          <SystemStats />

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="devices">Device Calibration</TabsTrigger>
              <TabsTrigger value="models">Model Registry</TabsTrigger>
              <TabsTrigger value="logs">Audit Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <UserManagementTable
                users={users}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onChangeRole={handleChangeRole}
              />
            </TabsContent>

            <TabsContent value="devices" className="mt-6">
              <DeviceCalibrationPanel />
            </TabsContent>

            <TabsContent value="models" className="mt-6">
              <ModelRegistry />
            </TabsContent>

            <TabsContent value="logs" className="mt-6">
              <AuditLogs />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
