"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let globalShowToast: ((message: string, type?: ToastType, durationMs?: number) => void) | null = null;

/** Función global utilizable desde cualquier componente o helper */
export function toast(message: string, type: ToastType = "info", durationMs = 3500) {
  if (globalShowToast) {
    globalShowToast(message, type, durationMs);
  } else if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("certiobra-toast", {
        detail: { message, type, durationMs },
      })
    );
  }
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: toast,
    };
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", durationMs = 3500) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, durationMs);
    },
    [removeToast]
  );

  useEffect(() => {
    globalShowToast = showToast;
    const handleCustomToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type?: ToastType; durationMs?: number }>;
      if (customEvent.detail?.message) {
        showToast(customEvent.detail.message, customEvent.detail.type || "info", customEvent.detail.durationMs);
      }
    };

    window.addEventListener("certiobra-toast", handleCustomToast);
    window.addEventListener("obraclick-toast", handleCustomToast);
    return () => {
      globalShowToast = null;
      window.removeEventListener("certiobra-toast", handleCustomToast);
      window.removeEventListener("obraclick-toast", handleCustomToast);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pointerEvents: "none",
          maxWidth: "420px",
          width: "calc(100% - 48px)",
        }}
      >
        {toasts.map((t) => {
          const bgMap: Record<ToastType, string> = {
            success: "linear-gradient(135deg, rgba(6, 78, 59, 0.95), rgba(15, 23, 42, 0.98))",
            error: "linear-gradient(135deg, rgba(127, 29, 29, 0.95), rgba(15, 23, 42, 0.98))",
            info: "linear-gradient(135deg, rgba(30, 58, 138, 0.95), rgba(15, 23, 42, 0.98))",
          };
          const borderMap: Record<ToastType, string> = {
            success: "1px solid rgba(52, 211, 153, 0.35)",
            error: "1px solid rgba(248, 113, 113, 0.35)",
            info: "1px solid rgba(96, 165, 250, 0.35)",
          };
          const iconMap: Record<ToastType, string> = {
            success: "✓",
            error: "✕",
            info: "ℹ",
          };
          const colorMap: Record<ToastType, string> = {
            success: "#34d399",
            error: "#f87171",
            info: "#60a5fa",
          };

          return (
            <div
              key={t.id}
              className="slide-up"
              style={{
                pointerEvents: "auto",
                background: bgMap[t.type],
                border: borderMap[t.type],
                borderRadius: "14px",
                padding: "14px 18px",
                color: "#fff",
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${colorMap[t.type]}25`,
                    color: colorMap[t.type],
                    fontWeight: "800",
                    fontSize: "13px",
                    flexShrink: 0,
                  }}
                >
                  {iconMap[t.type]}
                </span>
                <span>{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                aria-label="Cerrar notificación"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  fontSize: "16px",
                  padding: "4px",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
