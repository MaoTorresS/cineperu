import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/movie.css';

interface Pelicula {
  id: string;
  titulo: string;
  portada_url: string;
  genero?: { nombre: string } | string;
  precio_compra?: string;
}

const AdminPeliculas: React.FC<{ onEdit: (pelicula: any) => void }> = ({ onEdit }) => {
  const { token } = useAuth();
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('/peliculas', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => setPeliculas(res.data.peliculas || []))
      .catch(() => setPeliculas([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div style={{ width: '100%', margin: '0 auto', padding: 24 }}>
      <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Todas las películas</h2>
      {loading ? (
        <div style={{ color: '#aaa', textAlign: 'center' }}>Cargando...</div>
      ) : (
        <div className="movie-search-grid">
          {peliculas.length === 0 && <div style={{ gridColumn: '1/-1', color: '#aaa', textAlign: 'center' }}>No hay películas registradas.</div>}
          {peliculas.map((p) => (
            <div key={p.id} className="movie-card" tabIndex={0} role="button" aria-label={p.titulo}>
              <div className="movie-image">
                <img src={p.portada_url} alt={p.titulo} />
              </div>
              <div className="movie-title" title={p.titulo}>{p.titulo}</div>
              {p.genero && <div className="movie-meta">{typeof p.genero === 'string' ? p.genero : p.genero.nombre}</div>}
              {p.precio_compra && <div className="movie-price movie-price-center">S/ {parseFloat(p.precio_compra).toFixed(2)}</div>}
              <div style={{ flex: 1 }} />
              <button className="movie-btn" style={{ background: '#e5b100', color: '#18181b', fontWeight: 700 }} onClick={() => onEdit(p)}>Editar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPeliculas;
