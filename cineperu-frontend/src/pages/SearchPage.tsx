
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import MovieCard from "../components/MovieCard";
import "../styles/movie.css";

interface Pelicula {
  id: string;
  titulo: string;
  portada_url: string;
  genero?: { nombre: string } | string;
  precio_compra?: string;
}


const SearchPage: React.FC = () => {
  // const [query, setQuery] = useState("");
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPeliculas = async () => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || "";
      if (q) {
        setLoading(true);
        try {
          const res = await API.get<{ peliculas: Pelicula[] }>(`/peliculas?search=${encodeURIComponent(q)}`);
          setPeliculas(res.data.peliculas || []);
        } catch {
          setPeliculas([]);
        } finally {
          setLoading(false);
        }
      } else {
        setPeliculas([]);
      }
    };
    fetchPeliculas();
  }, [window.location.search]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div style={{marginLeft: '1.5rem'}}>
        <h1 className="text-2xl font-bold mb-6">Resultados de búsqueda</h1>
      </div>
      <div style={{marginLeft: '1.5rem'}}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 18, fontWeight: 600 }}>Buscando...</div>
        ) : peliculas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 18, color: '#888' }}>No se encontraron películas.</div>
        ) : (
          <div className="movie-search-grid">
            {peliculas.map((p) => (
              <MovieCard
                key={p.id}
                titulo={p.titulo}
                portada_url={p.portada_url}
                genero={typeof p.genero === 'object' && p.genero !== null ? p.genero.nombre : (p.genero || '')}
                precio_compra={p.precio_compra}
                onClick={() => window.location.href = `/pelicula/${p.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
