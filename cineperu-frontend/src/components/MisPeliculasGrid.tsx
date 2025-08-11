
import React from 'react';
import MovieCard from '../components/MovieCard';

interface PeliculaGridItem {
  pelicula: {
    id: string;
    titulo: string;
    portada_url: string;
    // Puedes agregar más campos si los usas en MovieCard
  };
  tipo: string;
}

const MisPeliculasGrid: React.FC<{
  peliculas: PeliculaGridItem[];
  onCardClick?: (pelicula: PeliculaGridItem["pelicula"]) => void;
}> = ({ peliculas, onCardClick }) => (
  <div className="movie-search-grid">
    {peliculas.map((item) => (
      <div key={item.pelicula.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <MovieCard
          titulo={item.pelicula.titulo}
          portada_url={item.pelicula.portada_url}
          onClick={() => onCardClick?.(item.pelicula)}
        />
        <div className="movie-meta" style={{ color: item.tipo === 'COMPRA' ? '#22c55e' : '#3b82f6', textAlign: 'center', marginBottom: 8 }}>{item.tipo}</div>
      </div>
    ))}
  </div>
);

export default MisPeliculasGrid;
