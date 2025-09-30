"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Shield } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "analyst" | "viewer"
  status: "active" | "inactive"
  lastActive: string
}

interface UserManagementTableProps {
  users: User[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onChangeRole: (id: string) => void
}

export function UserManagementTable({ users, onEdit, onDelete, onChangeRole }: UserManagementTableProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="default" className="gap-1">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        )
      case "analyst":
        return <Badge variant="secondary">Analyst</Badge>
      case "viewer":
        return <Badge variant="outline">Viewer</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">Inactive</Badge>
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-muted-foreground">{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onChangeRole(user.id)}>
                      <Shield className="mr-2 h-4 w-4" />
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
