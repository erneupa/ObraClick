"use client";

import { useRef, useState, useEffect } from "react";
import { toast } from "./ToastProvider";

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  onCancel: () => void;
  title?: string;
}

export default function SignaturePad({
  onSave,
  onCancel,
  title = "Firma Digital a Pie de Obra",
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high DPI scale
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.strokeStyle = "#2563eb"; // Blue ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  function getCoordinates(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }

  function startDrawing(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if ("touches" in e) {
      e.stopPropagation();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    if ("touches" in e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  }

  function stopDrawing() {
    setIsDrawing(false);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  }

  function handleConfirm() {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) {
      toast("Por favor, dibuje su firma antes de confirmar.", "info");
      return;
    }
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "24px",
          background: "#0f172a",
          border: "1px solid var(--surface-border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "17px", color: "#fff", fontWeight: "700" }}>✍️ {title}</h3>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Firme con el dedo o ratón dentro del recuadro
            </span>
          </div>
          <button
            onClick={onCancel}
            style={{ color: "var(--text-secondary)", fontSize: "18px", background: "none", border: "none", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        {/* Canvas Box */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "190px",
            background: "#ffffff",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.15)",
            touchAction: "none",
          }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              cursor: "crosshair",
            }}
          />
          {/* Baseline guideline */}
          <div
            style={{
              position: "absolute",
              bottom: "35px",
              left: "20px",
              right: "20px",
              borderBottom: "1px dashed #cbd5e1",
              pointerEvents: "none",
            }}
          />
          {!hasSignature && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#94a3b8",
                fontSize: "13px",
                pointerEvents: "none",
                fontWeight: "500",
              }}
            >
              Firme aquí ✍️
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px" }}>
          <button
            type="button"
            onClick={clearCanvas}
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Borrar trazo
          </button>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              style={{ padding: "8px 16px", fontSize: "13px" }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn-primary"
              disabled={!hasSignature}
              style={{
                padding: "8px 18px",
                fontSize: "13px",
                opacity: hasSignature ? 1 : 0.5,
                cursor: hasSignature ? "pointer" : "not-allowed",
              }}
            >
              Confirmar Firma ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
