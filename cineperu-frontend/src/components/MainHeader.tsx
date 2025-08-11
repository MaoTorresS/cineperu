
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DefaultUserImg from "./DefaultUserImg";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useConfirm } from "../context/ConfirmContext";

// Menú desplegable para usuario logeado
const menuItemStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 8,
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: 15,
  cursor: 'pointer',
  transition: 'background 0.15s',
  background: 'none',
  border: 'none',
  margin: 0,
  outline: 'none',
};

import type { User } from "../context/AuthContextDef";

const UserDropdown: React.FC<{ user: User }> = ({ user }) => {
  const [open, setOpen] = React.useState(false);
  const { logout } = useAuth();
  const confirm = useConfirm();

  // Cierra el menú al hacer click fuera
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const el = document.getElementById('user-dropdown-root');
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div id="user-dropdown-root" style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <div onClick={() => setOpen((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user.imagen_perfil ? (
          <img
            src={user.imagen_perfil}
            alt="Perfil"
            style={{ width: 35, height: 35, borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <DefaultUserImg size={35} />
        )}
        <span style={{ fontWeight: 600, color: '#fff', fontSize: 15 }}>{user.nombre}</span>
        <span style={{ color: '#aaa', fontSize: 18, marginLeft: 2 }}>▼</span>
      </div>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 0,
            background: 'rgba(30,32,40,0.98)',
            borderRadius: 12,
            boxShadow: '0 4px 16px 0 rgba(0,0,0,0.18)',
            minWidth: 170,
            zIndex: 100,
            padding: 8,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <a href="/perfil" style={menuItemStyle}>Mi perfil</a>
          <a href="/mis-peliculas" style={menuItemStyle}>Mis películas</a>
          <button
            onClick={() => {
              confirm({
                message: "¿Seguro que deseas cerrar sesión?",
                onConfirm: () => { logout(); setOpen(false); },
              });
            }}
            style={{ ...menuItemStyle, background: 'none', border: 'none', textAlign: 'left', color: '#e50914', cursor: 'pointer' }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

// Color palette based on the provided HTML and your requirements
const COLORS = {
  bg: "#0f0f10",
  text: "#fff",
  muted: "#aaa",
  accent: "#e50914",
  glass: "rgba(255,255,255,0.08)",
};

const navLinks = [
  { name: "Inicio", to: "/" },
  { name: "Series", to: "/series" },
  { name: "Películas", to: "/peliculas" },
  { name: "Niños y Familia", to: "/familia" },
];

const MainHeader: React.FC = () => {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (searchValue.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(searchValue)}`;
      setShowSearch(false);
      setSearchValue("");
    }
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        background: "linear-gradient(180deg, rgba(0,0,0,0.8), transparent)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div style={{ fontWeight: "bold", fontSize: 20 }}>
        Cine<span style={{ color: COLORS.muted }}>Perú</span>
      </div>
      {/* Navigation */}
      <nav style={{ display: "flex", gap: 20 }}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color:
                location.pathname === link.to ? COLORS.accent : COLORS.text,
              textDecoration: "none",
              fontWeight: 600,
              transition: "color 0.2s",
            }}
          >
            {link.name}
          </Link>
        ))}
      </nav>
      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        {/* Buscador (icono o campo) */}
        {showSearch ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: COLORS.glass, borderRadius: 8, padding: "2px 8px" }}>
            <input
              autoFocus
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleSearch();
                if (e.key === "Escape") { setShowSearch(false); setSearchValue(""); }
              }}
              placeholder="Buscar..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: COLORS.text,
                fontSize: 16,
                width: 160,
                padding: "6px 0",
              }}
            />
            <button
              onClick={handleSearch}
              style={{ background: "none", border: "none", color: COLORS.text, fontSize: 18, cursor: "pointer" }}
              aria-label="Buscar"
            >
              🔍
            </button>
            <button
              onClick={() => { setShowSearch(false); setSearchValue(""); }}
              style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 18, cursor: "pointer" }}
              aria-label="Cerrar búsqueda"
            >
              ×
            </button>
          </div>
        ) : (
          <span
            style={{ fontSize: 20, cursor: "pointer" }}
            onClick={() => setShowSearch(true)}
            title="Buscar"
          >
            🔍
          </span>
        )}
        {/* Si no está logeado: mostrar botones */}
        {(() => {
          const { user } = useAuth();
          if (!user) {
            return (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  style={{
                    color: COLORS.text,
                    background: COLORS.glass,
                    borderRadius: 6,
                    padding: "6px 16px",
                    fontWeight: 600,
                    textDecoration: "none",
                    marginRight: 4,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Conectarse
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  style={{
                    color: COLORS.text,
                    background: COLORS.glass,
                    borderRadius: 6,
                    padding: "6px 16px",
                    fontWeight: 600,
                    textDecoration: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Registrarse
                </button>
                <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
                <RegisterModal open={showRegister} onClose={() => setShowRegister(false)} />
              </>
            );
          }
          // Si está logeado: mostrar nombre y menú desplegable
          return <UserDropdown user={user} />;
        })()}
      </div>
    </header>
  );
};

export default MainHeader;
