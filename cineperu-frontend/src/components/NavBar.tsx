import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Header con logo grande clickeable */}
      <header className="bg-gray-900 text-yellow-400 py-8 text-center mb-4">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-cinelogo tracking-wide">
          <Link to="/" className="hover:text-yellow-300 transition">
            🎬 CinePerú
          </Link>
        </h1>
      </header>



      <nav className="bg-gray-800 text-white px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">

        {/* Botones de navegación */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm sm:text-base w-full md:w-auto">
          <button className="px-4 py-2 rounded-full bg-yellow-400 text-gray-900 font-semibold shadow hover:bg-yellow-300 transition">
            Películas recientes
          </button>
          <button className="px-4 py-2 rounded-full bg-yellow-400 text-gray-900 font-semibold shadow hover:bg-yellow-300 transition">
            Estrenos
          </button>
          <button className="px-4 py-2 rounded-full bg-yellow-400 text-gray-900 font-semibold shadow hover:bg-yellow-300 transition">
            Más vistas
          </button>
        </div>

        {/* Botones de login/register/salir */}
        <div className="flex flex-wrap justify-center md:justify-end gap-4 w-full md:w-auto">
          {token ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
            >
              Salir
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-full border-2 border-yellow-400 text-yellow-400 font-semibold hover:bg-yellow-400 hover:text-gray-900 shadow transition"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-full bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 shadow transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

      </nav>

    </>
  )
}
