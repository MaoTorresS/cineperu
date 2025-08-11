import { useEffect, useState } from 'react'
import API from '../api/axios'
import MainHeader from '../components/MainHeader'

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

export const Home = () => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([])

  useEffect(() => {
    API.get<Pelicula[]>('/peliculas')
      .then((res) => setPeliculas(res.data))
      .catch(() => console.log('Error al cargar películas'))
  }, [])

  return (
    <>
      <MainHeader />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          🎬 Películas Disponibles
        </h1>
        <div className="grid grid-cols-4 gap-x-6 gap-y-10">
          {peliculas.map((p) => (
            <div key={p.id} className="flex flex-col items-center bg-white rounded-lg shadow hover:shadow-xl transition duration-300 overflow-hidden dark:bg-gray-800 dark:text-gray-200">
              {/* Portada */}
              <img
                src={p.portada_url}
                alt={p.titulo}
                className="w-[200px] h-[300px] object-cover mx-auto mt-2 rounded-t-lg"
              />
              {/* Nombre */}
              <div className="w-full px-3 pt-2 pb-4 flex flex-col items-center">
                <h2 className="text-md font-bold text-gray-900">{p.titulo}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {p.genero.join(', ')}
                </p>
              </div>
              {/* Precios */}
              <div className="w-full px-3 pb-4 flex justify-around mt-2">
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
