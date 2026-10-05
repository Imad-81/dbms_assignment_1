"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, X } from "lucide-react";

export function DeleteButton({
  onDelete,
  title,
  description,
  buttonLabel,
  iconOnly = false,
  redirectTo,
}: {
  onDelete: () => Promise<{ success: boolean; error?: string }>;
  title: string;
  description: string;
  buttonLabel?: string;
  iconOnly?: boolean;
  redirectTo?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      const res = await onDelete();
      if (res.success) {
        setIsOpen(false);
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
        }
      } else {
        setError(res.error || "Failed to delete record");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete record");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title={title}
        className={
          iconOnly
            ? "rounded-md p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition"
            : "inline-flex items-center gap-1 rounded-md border border-warm-border bg-white px-2 py-1 text-[11px] font-semibold text-stone-600 shadow-sm hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 transition"
        }
      >
        <Trash2 className="h-3.5 w-3.5" />
        {!iconOnly && <span>{buttonLabel || "Delete"}</span>}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-warm-border bg-white p-6 shadow-warm-modal animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-charcoal-900">{title}</h3>
                <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                  {description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-stone-400 hover:bg-warm-subtle hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-rose-50 p-2.5 text-xs font-medium text-rose-700 border border-rose-200">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-warm-border pt-4">
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-warm-border bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-warm-subtle disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleConfirm}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 transition"
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
