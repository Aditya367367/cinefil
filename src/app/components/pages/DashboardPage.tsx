import React from 'react';
import { Dashboard } from '../modules/dashboard';
import type { Page } from "./Navbar";

type DashboardRole = "member";
type DashboardSection = "home" | "films" | "cast" | "documents" | "right-holders" | "shares" | "royalty-details" | "payments";

interface DashboardPageProps {
  role: DashboardRole;
  onNavigate: (page: Page) => void;
  initialSection?: DashboardSection;
}

export function DashboardPage({ role, onNavigate, initialSection }: DashboardPageProps) {
  return <Dashboard role={role} onNavigate={onNavigate} initialSection={initialSection as any} />;
}