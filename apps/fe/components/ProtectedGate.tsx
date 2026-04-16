"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { Skeleton } from "./Skeleton";

export function ProtectedGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Skeleton width="120px" height="32px" />
          <div style={{ display: "flex", gap: "12px" }}>
            <Skeleton width="40px" height="40px" borderRadius="50%" />
            <Skeleton width="40px" height="40px" borderRadius="50%" />
            <Skeleton width="80px" height="32px" borderRadius="100px" />
          </div>
        </div>
        <Skeleton width="200px" height="40px" />
        <Skeleton width="150px" height="20px" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "24px" }}>
          <Skeleton height="200px" borderRadius="20px" />
          <Skeleton height="200px" borderRadius="20px" />
          <Skeleton height="200px" borderRadius="20px" />
          <Skeleton height="200px" borderRadius="20px" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
