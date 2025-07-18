import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
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
      await API.post('/auth/registro', { nombre, correo, contraseña });
      const loginRes = await API.post<{ token: string }>('/auth/login', { correo, contraseña });
      login(loginRes.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar');
    }
  };

  return (
    <>
      <NavBar />
      <div className="font-sans">
        <div className="relative min-h-screen flex flex-col sm:justify-center items-center bg-gray-100 dark:bg-gray-900 py-6">
          <div className="relative sm:max-w-sm w-full">
            <div className="card bg-blue-400 shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
            <div className="card bg-red-400 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
            <div className="relative w-full rounded-3xl px-6 py-4 bg-gray-100 dark:bg-gray-800 shadow-md">
              <label className="block mt-3 text-sm text-gray-700 dark:text-gray-200 text-center font-semibold">
                Regístrate
              </label>

              <form onSubmit={handleSubmit} className="mt-10 space-y-7">
                <div>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="mt-1 block w-full border-none bg-gray-100 dark:bg-gray-700 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 dark:hover:bg-blue-600 dark:focus:bg-blue-600 focus:ring-0 px-4 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="mt-1 block w-full border-none bg-gray-100 dark:bg-gray-700 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 dark:hover:bg-blue-600 dark:focus:bg-blue-600 focus:ring-0 px-4 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    className="mt-1 block w-full border-none bg-gray-100 dark:bg-gray-700 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 dark:hover:bg-blue-600 dark:focus:bg-blue-600 focus:ring-0 px-4 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {error && (
                  <p className="text-center text-red-500 text-sm">{error}</p>
                )}

                <div>
                  <button
                    type="submit"
                    className="bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
                  >
                    Registrar
                  </button>
                </div>
              </form>

              <div className="mt-7">
                <div className="flex justify-center items-center">
                  <span className="mr-2 text-gray-600 dark:text-gray-300">¿Ya tienes una cuenta?</span>
                  <Link
                    to="/login"
                    className="text-blue-500 transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
