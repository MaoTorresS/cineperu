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
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">🎬 Películas Disponibles</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {peliculas.map((p) => (
            <div key={p.id} className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300 p-3 text-center">
              <img
                src={p.portada_url}
                alt={p.titulo}
                className="w-36 h-56 object-cover mx-auto mb-2"
              />
              <h2 className="text-lg font-semibold">{p.titulo}</h2>
              <p className="text-sm text-gray-600">{p.genero.join(', ')}</p>
              <p className="text-green-600 font-bold mt-1">S/ {parseFloat(p.precio_compra).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
