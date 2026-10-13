"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface LandingHeaderProps {
  hasSession: boolean;
}

export default function LandingHeader({ hasSession }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#caracteristicas", label: "Características" },
    { href: "#modulos", label: "Plataforma" },
    { href: "#para-quien", label: "Para Quién" },
    { href: "#soluciones", label: "Soluciones" },
    { href: "#comparativa", label: "Comparativa" },
    { href: "#precios", label: "Precios" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--surface-border)",
      background: "rgba(11, 15, 25, 0.85)"
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }} aria-label="ObraClick Inicio">
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
            <span style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px", color: "#ffffff" }}>
              Obra<span style={{ color: "var(--accent-primary)" }}>Click</span>
            </span>
            <span style={{ display: "block", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1.2px", color: "var(--text-secondary)", fontWeight: "600" }}>
              Gestión de Obra
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
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid var(--surface-border)",
              color: "#fff",
              fontSize: "18px",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center"
            }}
            aria-label="Menú de navegación"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: "fixed",
            top: "67px",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(11, 15, 25, 0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            zIndex: 100,
            padding: "24px 20px 40px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.04)",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "600",
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span>{link.label}</span>
                <span style={{ color: "var(--text-secondary)" }}>→</span>
              </a>
            ))}
          </nav>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingTop: "20px", borderTop: "1px solid var(--surface-border)" }}>
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
          </div>
        </div>
      )}
    </header>
  );
}
