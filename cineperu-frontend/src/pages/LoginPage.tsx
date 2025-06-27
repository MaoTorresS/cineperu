import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar'; // ✅ Importamos el NavBar

type LoginResponse = {
  token: string;
};

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post<LoginResponse>('/auth/login', { correo, contraseña });
      login(res.data.token);
      navigate('/');
    } catch (err: any) {
      console.error("Error al hacer login:", err);
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <>
      <NavBar /> {/* Mostramos el navbar arriba */}
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
            Ingresar
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>

        {/* Texto de ayuda debajo */}
        <p className="mt-4 text-sm text-center">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </>
  );
}
