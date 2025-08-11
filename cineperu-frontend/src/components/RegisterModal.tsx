import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { User } from "../context/AuthContext";
import API from "../api/axios";

const RegisterModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const { login } = useAuth();

  React.useEffect(() => {
    if (!open) {
      setNombre("");
      setApellido("");
      setCorreo("");
      setContrasena("");
      setRepetirContrasena("");
      setError("");
    }
  }, [open]);
  if (!open) return null;

  type LoginResponse = { token: string; usuario: User };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validaciones frontend
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!apellido.trim()) {
      setError("El apellido es obligatorio");
      return;
    }
    // Validar correo
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
      setError("El correo no es válido");
      return;
    }
    // Validar contraseña
    if (contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (!/[A-Z]/.test(contrasena)) {
      setError("La contraseña debe contener al menos una mayúscula");
      return;
    }
    if (!/[0-9]/.test(contrasena)) {
      setError("La contraseña debe contener al menos un número");
      return;
    }
    if (contrasena !== repetirContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/registro", {
        nombre,
        apellido,
        correo,
        contraseña: contrasena,
        repetirContraseña: repetirContrasena
      });
      const loginRes = await API.post<LoginResponse>("/auth/login", { correo, contrasena });
  login(loginRes.data.token, loginRes.data.usuario);
  setLoading(false);
  onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al registrar");
      setLoading(false);
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
          <label style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, alignSelf: "center" }}>Registrarse</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
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
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={e => setApellido(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
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
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
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
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
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
            <input
              type="password"
              placeholder="Repetir contraseña"
              value={repetirContrasena}
              onChange={e => setRepetirContrasena(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
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
        {error && <div style={{ color: "#e50914", fontSize: 14, textAlign: "center" }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 20,
            border: "none",
            background: loading ? "#e5b10099" : "#e5b100",
            color: "#222",
            fontWeight: 700,
            fontSize: 18,
            marginTop: 8,
            marginBottom: 8,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
            transition: "background 0.2s",
          }}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};

export default RegisterModal;
