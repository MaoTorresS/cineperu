import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

interface Movie {
  id: string;
  titulo: string;
  sinopsis: string;
  descripcion: string;
  director: string;
  genero?: { nombre: string };
  duracion_minutos: number;
  cantidad?: number;
  portada_url: string;
  trailer_url: string;
  fecha_estreno: string;
  precio_compra: string;
  precio_alquiler: string;
  estado: string;
}

type NotifyType = string | { text: string; showGoToCart: boolean };

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [alquilerMode, setAlquilerMode] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [notify, setNotify] = useState<NotifyType | null>(null);
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);

  useEffect(() => {
    axios.get(`/peliculas/${id}`)
      .then(res => setMovie(res.data as any))
      .catch(() => {})
    setLoading(false);
  }, [id]);

  const handleGoToCart = async () => {
    if (!user) {
      setNotify('Debes iniciar sesión o registrarte para continuar.');
      setPendingAction(() => handleGoToCart);
      localStorage.setItem('cineperu_redirect', location.pathname + location.search);
      return;
    }
    if (!movie) return;
    try {
      await axios.post('/carrito', {
        pelicula_id: movie.id,
        tipo: alquilerMode ? 'ALQUILER' : 'COMPRA',
        cantidad,
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      navigate('/carrito');
    } catch (err: unknown) {
      let msg = 'No se pudo agregar al carrito. Intenta nuevamente.';
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof (err as any).response === 'object' &&
        'data' in (err as any).response &&
        (err as any).response.data &&
        typeof (err as any).response.data === 'object'
      ) {
        msg = (err as any).response.data.mensaje || (err as any).response.data.error || msg;
      }
      if (msg === 'La película ya está en el carrito') {
        setNotify({
          text: msg,
          showGoToCart: true
        });
      } else {
        setNotify({
          text: msg,
          showGoToCart: false
        });
      }
    }
  };

  // Efecto para redirigir tras login/registro y cerrar alerta
  useEffect(() => {
    const redirect = localStorage.getItem('cineperu_redirect');
    if (user) {
      setNotify(null); // Cierra la alerta si el usuario ya está autenticado
      if (redirect) {
        localStorage.removeItem('cineperu_redirect');
        if (location.pathname + location.search !== redirect) {
          navigate(redirect, { replace: true });
        } else if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
      }
    }
    // eslint-disable-next-line
  }, [user]);

  if (loading) return <div className="text-center py-10">Cargando...</div>;
  if (!movie) return <div className="text-center py-10">Película no encontrada</div>;

  return (
    <div className="movie-detail-container">
      {notify && (
        <div className="movie-detail-notify">
          {typeof notify === 'string' ? notify : notify.text}
          {typeof notify === 'object' && notify.showGoToCart ? (
            <button onClick={() => { navigate('/carrito'); setNotify(null); }} className="movie-detail-notify-btn">Ir al carrito</button>
          ) : <>
            <button onClick={() => { setShowLogin(true); setNotify(null); }} className="movie-detail-notify-btn">Iniciar sesión</button>
            <button onClick={() => { setShowRegister(true); setNotify(null); }} className="movie-detail-notify-btn">Registrarse</button>
          </>}
          <button onClick={() => setNotify(null)} className="movie-detail-notify-close">×</button>
        </div>
      )}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <RegisterModal open={showRegister} onClose={() => setShowRegister(false)} />
      <div className="movie-detail-main">
        <div className="movie-detail-img-col">
          <img
            src={movie.portada_url && movie.portada_url.startsWith('/assets/portadas/') ? `http://localhost:3000${movie.portada_url}` : movie.portada_url}
            alt={movie.titulo}
            className="movie-detail-img"
          />
        </div>
        <div className="movie-detail-info-col">
          <h1 className="movie-detail-title">{movie.titulo} <span className="movie-detail-year">({new Date(movie.fecha_estreno).getFullYear()})</span></h1>
          <div className="movie-detail-meta">
            <span>{movie.genero?.nombre}</span>
            <span>• {movie.duracion_minutos} min</span>
            <span>• Dir. {movie.director}</span>
          </div>
          <div className="movie-detail-price-row">
            {alquilerMode ? (
              <>
                <span className="movie-detail-price">S/ {movie.precio_alquiler}</span>
                <span className="movie-detail-price-alt">o Comprar S/ {movie.precio_compra}</span>
              </>
            ) : (
              <>
                <span className="movie-detail-price">S/ {movie.precio_compra}</span>
                <span className="movie-detail-price-alt">o Alquiler S/ {movie.precio_alquiler}</span>
              </>
            )}
          </div>
          {alquilerMode && (
            <div className="movie-detail-alquiler-label">Se va a alquilar solo por 7 días.</div>
          )}
          <div className="movie-detail-actions">
            <input type="number" min="1" value={cantidad} onChange={e => setCantidad(Number(e.target.value))} className="movie-detail-qty" />
            <button
              className={`movie-detail-btn movie-detail-btn-buy${!alquilerMode ? ' movie-detail-btn-active' : ''}`}
              onClick={async () => {
                if (alquilerMode) setAlquilerMode(false);
                else await handleGoToCart();
              }}
            >
              Comprar
            </button>
            <button
              className={`movie-detail-btn movie-detail-btn-cart${alquilerMode ? ' movie-detail-btn-active' : ''}`}
              onClick={async () => {
                if (!alquilerMode) setAlquilerMode(true);
                else await handleGoToCart();
              }}
            >
              Alquilar
            </button>
          </div>
          <div className="movie-detail-desc">
            <strong>Descripción:</strong>
            <p>{movie.descripcion}</p>
          </div>
          <div className="movie-detail-sinopsis">
            <strong>Sinopsis:</strong>
            <p>{movie.sinopsis}</p>
          </div>
          <div className="movie-detail-extra">
            <span>Estado: <b>{movie.estado}</b></span>
            <span>Cantidad disponible: <b>{movie.cantidad ?? 'Ilimitado'}</b></span>
            <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer" className="movie-detail-trailer">Ver trailer</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
