import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { User } from "../context/AuthContext";
import API from "../api/axios";

const LoginModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const { login } = useAuth();

  React.useEffect(() => {
    if (!open) {
      setCorreo("");
      setContrasena("");
      setError("");
      setRemember(false);
    }
  }, [open]);
  if (!open) return null;

  type LoginResponse = { token: string; usuario: User };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post<LoginResponse>("/auth/login", { correo, contrasena });
  login(res.data.token, res.data.usuario);
  onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(15,15,16,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <form
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          background: "rgba(30,32,40,0.95)",
          borderRadius: 24,
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
          padding: 36,
          minWidth: 340,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          color: "#fff",
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 24,
            background: "none",
            border: "none",
            color: "#aaa",
            fontSize: 22,
            cursor: "pointer",
          }}
          aria-label="Cerrar"
        >
          ×
        </button>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, alignSelf: "center" }}>Iniciar sesión</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ position: "relative", width: "100%" }}>
              <span style={{
                position: "absolute",
                left: 18,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#aaa",
                fontSize: 18,
                pointerEvents: "none"
              }}>✉️</span>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 48px",
                  borderRadius: 16,
                  border: "1px solid #333",
                  background: "rgba(255,255,255,0.10)",
                  color: "#fff",
                  fontSize: 16,
                  marginBottom: 0,
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ position: "relative", width: "100%" }}>
              <span style={{
                position: "absolute",
                left: 18,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#aaa",
                fontSize: 18,
                pointerEvents: "none"
              }}>🔒</span>
              <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 48px",
                  borderRadius: 16,
                  border: "1px solid #333",
                  background: "rgba(255,255,255,0.10)",
                  color: "#fff",
                  fontSize: 16,
                  marginBottom: 0,
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>
        </div>
        {error && <div style={{ color: "#e50914", fontSize: 14, textAlign: "center" }}>{error}</div>}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 20,
            border: "none",
            background: "#e5b100",
            color: "#222",
            fontWeight: 700,
            fontSize: 18,
            marginTop: 8,
            marginBottom: 8,
            cursor: "pointer",
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
            transition: "background 0.2s",
          }}
        >
          Iniciar sesión
        </button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14, color: "#aaa" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={{ accentColor: "#e5b100" }}
            />
            Recuérdame
          </label>
          <button
            type="button"
            style={{ background: "none", border: "none", color: "#aaa", textDecoration: "underline", cursor: "pointer" }}
            onClick={() => alert("Funcionalidad próximamente")}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginModal;
