import React from 'react';

interface MovieCardProps {
  titulo: string;
  portada_url: string;
  genero?: string | string[];
  precio_compra?: string;
  onClick?: () => void;
}
//
const MovieCard: React.FC<MovieCardProps> = ({ titulo, portada_url, genero, precio_compra, onClick }) => {
  // Normalizar género
  let generoText = '';
  if (Array.isArray(genero)) {
    generoText = genero.join(', ');
  } else if (typeof genero === 'string') {
    generoText = genero;
  }
  // Normalizar URL de portada
  let portadaSrc = portada_url;
  if (portada_url && portada_url.startsWith('/assets/portadas/')) {
    portadaSrc = `http://localhost:3000${portada_url}`;
  }
  return (
    <div className="movie-card" onClick={onClick} tabIndex={0} role="button" aria-label={titulo}>
      <div className="movie-image">
        <img src={portadaSrc} alt={titulo} />
      </div>
      <div className="movie-title" title={titulo}>{titulo}</div>
      {generoText && <div className="movie-meta">{generoText}</div>}
      {precio_compra && <div className="movie-price movie-price-center">S/ {parseFloat(precio_compra).toFixed(2)}</div>}
      <div style={{ flex: 1 }} />
      <button className="movie-btn" tabIndex={-1}>Añadir al carrito</button>
    </div>
  );
};

export default MovieCard;
