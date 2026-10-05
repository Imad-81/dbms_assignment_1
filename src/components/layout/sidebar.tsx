"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Bed,
  FlaskConical,
  ReceiptText,
  Activity,
  Database,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Executive Census", href: "/", icon: LayoutDashboard },
  { name: "Patient Longitudinal EMR", href: "/patients", icon: Users },
  { name: "Appointments & Roster", href: "/appointments", icon: CalendarDays },
  { name: "Inpatient & Bed Matrix", href: "/inpatient", icon: Bed },
  { name: "Diagnostic Laboratory", href: "/lab", icon: FlaskConical },
  { name: "Billing & Ledger", href: "/billing", icon: ReceiptText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-warm-border bg-warm-subtle/50 backdrop-blur-sm">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-warm-border px-6 bg-white/70">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-terracotta-500 text-white shadow-sm">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <span className="text-base font-semibold tracking-tight text-charcoal-900">
            Aura Health
          </span>
          <span className="block text-[11px] font-medium tracking-wide uppercase text-stone-500">
            Clinical Care OS
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3 py-4">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
          Clinical Operations
        </div>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-white text-terracotta-600 shadow-sm border border-warm-border/80 font-semibold"
                  : "text-stone-600 hover:bg-white/60 hover:text-charcoal-900"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive
                    ? "text-terracotta-600"
                    : "text-stone-400 group-hover:text-stone-600"
                )}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* System Status Footprint */}
      <div className="border-t border-warm-border p-4 bg-white/40">
        <div className="rounded-xl border border-warm-border bg-white p-3 shadow-warm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
              Database Core
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-50 px-2 py-0.5 text-[11px] font-medium text-sage-700 border border-sage-200">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-charcoal-800">
            <Database className="h-3.5 w-3.5 text-terracotta-500" />
            <span>Neon Serverless PG 16</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
            <span>16 Tables in 3NF</span>
            <span className="font-mono text-[10px] text-stone-400">us-east-2</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
