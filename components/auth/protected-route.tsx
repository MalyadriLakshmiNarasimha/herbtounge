"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized");
    }
  }, [user, router, allowedRoles]);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div>Access Denied</div>;
  }

  return <>{children}</>;
}
