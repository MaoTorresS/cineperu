import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre || !correo || !contraseña) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await API.post('/auth/registro', {
        nombre,
        correo,
        contraseña
      });

      console.log('Usuario registrado:', res.data);

      // ✅ OPCIÓN 1: iniciar sesión automáticamente tras registrarse
      const loginRes = await API.post<{ token: string }>('/auth/login', {
        correo,
        contraseña
      });
      login(loginRes.data.token);
      navigate('/');

      // ✅ OPCIÓN 2: redirigir al login manualmente
      // navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar');
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Registro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Registrarse
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </>
  );
}
