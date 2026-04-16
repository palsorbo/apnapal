"use client";

import { ProtectedGate } from "../../components/ProtectedGate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedGate>{children}</ProtectedGate>;
}
