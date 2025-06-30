import { useEffect, useState } from 'react'
import API from '../api/axios'
import NavBar from '../components/NavBar'

type Pelicula = {
  id: string
  titulo: string
  sinopsis: string
  director: string
  genero: string[]
  duracion_minutos: number
  portada_url: string
  trailer_url: string
  fecha_estreno: string
  precio_compra: string
  precio_alquiler: string
}

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const Home = () => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([])

  useEffect(() => {
    API.get<Pelicula[]>('/peliculas')
      .then((res) => setPeliculas(res.data))
      .catch(() => console.log('Error al cargar películas'))
  }, [])

  return (
    <>
      <NavBar />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          🎬 Películas Disponibles
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {peliculas.map((p) => (
            <div
              key={p.id}
              className="flex flex-col items-center bg-white rounded-lg shadow hover:shadow-2xl hover:scale-105 transition-transform duration-300 overflow-hidden dark:bg-gray-800 dark:text-gray-200"
            >
              {/* Portada */}
              <img
                src={p.portada_url}
                alt={p.titulo}
                className="w-[200px] h-[300px] object-cover mx-auto mt-2 rounded-t-lg"
              />

              {/* Info */}
              <div className="w-full px-3 pt-2 pb-4 flex flex-col items-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 text-center">{p.titulo}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-1 text-center">
                  {p.genero.join(', ')} &middot; {p.duracion_minutos} min
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 italic mb-2 text-center">
                  Estreno: {formatearFecha(p.fecha_estreno)}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-3 mb-2 text-center">
                  {p.sinopsis.length > 90 ? p.sinopsis.slice(0, 90) + '...' : p.sinopsis}
                </p>
                <a
                  href={p.trailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 mb-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold transition"
                >
                  Ver trailer
                </a>
              </div>

              {/* Precios */}
              <div className="w-full px-3 pb-4 flex justify-around mt-auto">
                <span className="text-green-600 font-semibold text-sm">
                  Compra: S/ {parseFloat(p.precio_compra).toFixed(2)}
                </span>
                <span className="text-blue-600 font-semibold text-sm">
                  Alquiler: S/ {parseFloat(p.precio_alquiler).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}