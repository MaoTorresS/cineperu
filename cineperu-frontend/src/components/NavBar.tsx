import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">🎬 CinePerú</Link>
      <div className="flex gap-6">
        <button className="hover:text-yellow-400">Películas recientes</button>
        <button className="hover:text-yellow-400">Estrenos</button>
        <button className="hover:text-yellow-400">Más vistas</button>
      </div>
      <div>
        {token ? (
          <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Salir</button>
        ) : (
          <>
            <Link to="/login" className="px-3 py-1 hover:underline">Iniciar sesión</Link>
            <Link to="/register" className="ml-2 px-3 py-1 hover:underline">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}
