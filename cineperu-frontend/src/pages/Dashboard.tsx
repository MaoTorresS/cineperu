
import '../styles/movie.css';
import { useState, useEffect } from 'react';

interface Movie {
  id: string;
  titulo: string;
  portada_url: string;
  descripcion?: string;
  destacado?: boolean;
}

const Dashboard: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);


  useEffect(() => {
    import('../api/axios').then(({ default: axios }) => {
      axios.get('/peliculas?limit=40')
        .then(res => setMovies((res.data as any).peliculas))
        .catch(() => {})
        .then(() => setLoading(false));
    });
  }, []);

  useEffect(() => {
    if (movies.length <= 1) return;
    const heroCount = Math.min(3, movies.length);
    const interval = setInterval(() => {
      setHeroIndex(i => (i + 1) % heroCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [movies.length]);

  const handleMovieClick = (id: string) => {
    window.location.href = `/pelicula/${id}`;
  };

  // Hero: hasta 3 películas destacadas
  const heroMovies = movies.slice(0, 3);
  // Destacados: primeras 8 películas (incluye las del carrusel)
  const destacados = movies.slice(0, 8);
  // Solo para ti: siguientes 6 películas
  const soloParaTi = movies.slice(8, 14);

  if (loading) return <div style={{textAlign:'center',padding:'40px 0',fontSize:18,fontWeight:600}}>Cargando...</div>;

  return (
    <div className="dashboard-root">
      {/* HERO SECTION - Carrusel */}
      {heroMovies.length > 0 && (
  <section className="dashboard-hero" style={{backgroundImage: `linear-gradient(90deg, rgba(15,15,16,0.92) 25%, rgba(15,15,16,0.35)), url('${heroMovies[heroIndex].portada_url && heroMovies[heroIndex].portada_url.startsWith('/assets/portadas/') ? `http://localhost:3000${heroMovies[heroIndex].portada_url}` : heroMovies[heroIndex].portada_url}')`}}>
          <div className="dashboard-hero-content">
            <div className="dashboard-hero-tag">Estreno Exclusivo</div>
            <h1>{heroMovies[heroIndex].titulo}</h1>
            <p>{heroMovies[heroIndex].descripcion || 'Disfruta de las mejores películas en CinePerú, tu plataforma de streaming favorita.'}</p>
            <button className="dashboard-btn" onClick={() => handleMovieClick(heroMovies[heroIndex].id)}>Ver ahora</button>
          </div>
          {/* Dots del carrusel */}
          {heroMovies.length > 1 && (
            <div className="dashboard-hero-dots">
              {heroMovies.map((_, i) => (
                <span key={i} className={i === heroIndex ? 'active' : ''} onClick={() => setHeroIndex(i)}></span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* DESTACADOS */}
      <section className="dashboard-section">
        <h2>Destacados</h2>
        <div className="dashboard-cards-row">
          {destacados.map((movie) => (
            <div
              key={movie.id}
              className="dashboard-card"
              onClick={() => handleMovieClick(movie.id)}
            >
              <img src={movie.portada_url && movie.portada_url.startsWith('/assets/portadas/') ? `http://localhost:3000${movie.portada_url}` : movie.portada_url} alt={movie.titulo} />
              <span className="dashboard-badge">Nuevo</span>
            </div>
          ))}
        </div>
      </section>

      {/* SOLO PARA TI */}
      <section className="dashboard-section">
        <h2>Solo para ti</h2>
        <div className="dashboard-cards-row">
          {soloParaTi.map((movie) => (
            <div
              key={movie.id}
              className="dashboard-card"
              onClick={() => handleMovieClick(movie.id)}
            >
              <img src={movie.portada_url && movie.portada_url.startsWith('/assets/portadas/') ? `http://localhost:3000${movie.portada_url}` : movie.portada_url} alt={movie.titulo} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
