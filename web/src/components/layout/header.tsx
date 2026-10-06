"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Plus,
  Clock,
  Building,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export function Header() {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-warm-border bg-warm-bg/90 px-8 backdrop-blur-md">
      {/* Left: Campus & Shift Context */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <Building className="h-4 w-4 text-stone-400" />
          <span className="font-semibold text-charcoal-800">
            Memorial Medical Center
          </span>
          <span className="text-stone-300">•</span>
          <span>Main Facility (Blocks A–C)</span>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-warm-border bg-white px-3 py-1 text-xs text-stone-600 shadow-sm md:flex">
          <Clock className="h-3.5 w-3.5 text-terracotta-500" />
          <span>Active Shift:</span>
          <span className="font-semibold text-charcoal-900">08:00 – 16:00</span>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Action Button */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-2 rounded-lg bg-terracotta-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-terracotta-600"
          >
            <Plus className="h-4 w-4" />
            <span>Quick Action</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-80" />
          </button>

          {showQuickMenu && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl border border-warm-border bg-white p-2 shadow-warm-modal z-50"
              onMouseLeave={() => setShowQuickMenu(false)}
            >
              <Link
                href="/patients#register"
                onClick={() => setShowQuickMenu(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-stone-700 hover:bg-warm-subtle hover:text-charcoal-900"
              >
                <span>➕ Register New Patient</span>
              </Link>
              <Link
                href="/appointments#book"
                onClick={() => setShowQuickMenu(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-stone-700 hover:bg-warm-subtle hover:text-charcoal-900"
              >
                <span>🗓️ Book Appointment Slot</span>
              </Link>
              <Link
                href="/inpatient#admit"
                onClick={() => setShowQuickMenu(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-stone-700 hover:bg-warm-subtle hover:text-charcoal-900"
              >
                <span>🛏️ Admit Patient to Bed</span>
              </Link>
              <Link
                href="/lab#order"
                onClick={() => setShowQuickMenu(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-stone-700 hover:bg-warm-subtle hover:text-charcoal-900"
              >
                <span>🔬 Order Diagnostic Lab</span>
              </Link>
              <Link
                href="/billing#pay"
                onClick={() => setShowQuickMenu(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-stone-700 hover:bg-warm-subtle hover:text-charcoal-900"
              >
                <span>💳 Record Bill Payment</span>
              </Link>
            </div>
          )}
        </div>

        {/* Clinician On-Duty */}
        <div className="flex items-center gap-2.5 border-l border-warm-border pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-700 border border-sage-200">
            SJ
          </div>
          <div className="hidden text-left text-xs sm:block">
            <div className="font-semibold text-charcoal-900">Dr. Sarah Jenkins</div>
            <div className="text-[11px] text-stone-500">Chief Cardiologist</div>
          </div>
        </div>
      </div>
    </header>
  );
}
