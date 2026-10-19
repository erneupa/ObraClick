"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface LandingHeaderProps {
  hasSession: boolean;
}

export default function LandingHeader({ hasSession }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "#modulos", label: "Plataforma" },
    { href: "#caracteristicas", label: "Características" },
    { href: "#calculadora", label: "Simulador Ahorro" },
    { href: "#comparativa", label: "Comparativa" },
    { href: "#precios", label: "Precios" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Top Navbar Bar with blur background */}
      <div
        style={{
          position: "relative",
          zIndex: 101,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--surface-border)",
          background: "var(--glass-bg, rgba(11, 15, 25, 0.85))",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Brand Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }} aria-label="CertiObra Inicio">
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)"
            }}>
              🏗️
            </div>
            <div>
              <span style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px", color: "var(--text-primary, #ffffff)" }}>
                Certi<span style={{ color: "var(--accent-primary)" }}>Obra</span>
              </span>
              <span style={{ display: "block", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1.2px", color: "var(--text-secondary)", fontWeight: "600" }}>
                Control & Certificación
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: "24px" }} aria-label="Navegación principal">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: "500", transition: "color 0.2s" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop and Mobile Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            
            {hasSession ? (
              <Link href="/dashboard" className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }} id="btn-header-dashboard">
                <span>Panel</span>
                <span>→</span>
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="nav-desktop-links"
                  style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: "600", padding: "6px 12px" }} 
                  id="btn-header-login"
                >
                  Acceso
                </Link>
                <Link href="/login" className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }} id="btn-header-trial">
                  <span>Probar</span>
                  <span>🚀</span>
                </Link>
              </>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className="nav-mobile-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                padding: "8px",
                borderRadius: "8px",
                background: "var(--surface-color, rgba(255, 255, 255, 0.08))",
                border: "1px solid var(--surface-border)",
                color: "var(--text-primary, #fff)",
                fontSize: "18px",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px"
              }}
              aria-label="Menú de navegación"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: "fixed",
            top: "66px",
            left: 0,
            right: 0,
            bottom: 0,
            height: "calc(100dvh - 66px)",
            background: "var(--bg-color, #0b0f19)",
            zIndex: 100,
            padding: "20px 20px 36px",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            borderTop: "1px solid var(--surface-border)"
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "var(--surface-color, rgba(255, 255, 255, 0.04))",
                  border: "1px solid var(--surface-border)",
                  color: "var(--text-primary, #ffffff)",
                  fontSize: "16px",
                  fontWeight: "600",
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background 0.2s"
                }}
              >
                <span>{link.label}</span>
                <span style={{ color: "var(--text-secondary)" }}>→</span>
              </a>
            ))}
          </nav>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingTop: "20px", borderTop: "1px solid var(--surface-border)" }}>
            {hasSession ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "16px" }}
              >
                <span>Ir al Panel de Control</span>
                <span>→</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "16px" }}
                >
                  <span>Empezar Prueba Gratuita (14 Días)</span>
                  <span>🚀</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary"
                  style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "15px" }}
                >
                  Iniciar Sesión en mi Cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
