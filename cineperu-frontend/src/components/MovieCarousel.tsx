import React from 'react';
import MovieCard from './MovieCard';

interface Movie {
  id: string;
  titulo: string;
  portada_url: string;
}

interface MovieCarouselProps {
  movies: Movie[];
  onMovieClick: (id: string) => void;
  title?: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies, onMovieClick, title }) => {
  return (
    <div className="mb-8">
      {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            titulo={movie.titulo}
            portada_url={movie.portada_url}
            onClick={() => onMovieClick(movie.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;
