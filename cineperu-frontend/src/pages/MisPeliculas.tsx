import React, { useEffect, useState } from 'react';
import useRedirectIfNotAuth from '../hooks/useRedirectIfNotAuth';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
// import MovieCard from '../components/MovieCard';
import '../styles/movie.css';

interface Pelicula {
  id: string;
  titulo: string;
  portada_url: string;
  descripcion: string;
  fecha_estreno: string;
}

interface CompraAlquiler {
  id: string;
  tipo: 'COMPRA' | 'ALQUILER';
  fecha: string;
  pelicula: Pelicula;
  estado?: string;
  dias_restantes?: number;
}

const MisPeliculas: React.FC = () => {
  const { user, token } = useAuth();
  useRedirectIfNotAuth();
  const [peliculas, setPeliculas] = useState<CompraAlquiler[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  // Formulario para admins
  const [form, setForm] = useState({
    titulo: '',
    sinopsis: '',
    descripcion: '',
    director: '',
    generoId: '',
    duracion_minutos: '',
    cantidad: '',
    portada_url: '',
    trailer_url: '',
    fecha_estreno: '',
    precio_compra: '',
    precio_alquiler: '',
    estado: 'DISPONIBLE',
  });
  const [portadaFile, setPortadaFile] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [generos, setGeneros] = useState<{ id: string; nombre: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    axios.get('/usuarios/perfil', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        const data = (res && res.data) ? res.data : {};
        type CompraRaw = Omit<CompraAlquiler, 'tipo' | 'fecha'> & { fecha_compra?: string; fecha?: string };
        type AlquilerRaw = Omit<CompraAlquiler, 'tipo' | 'fecha'> & { fecha_inicio?: string; fecha?: string };
        const comprasArr: CompraRaw[] = (data && typeof data === 'object' && 'compras' in data && Array.isArray((data as { compras?: CompraRaw[] }).compras)) ? (data as { compras?: CompraRaw[] }).compras ?? [] : [];
        const alquileresArr: AlquilerRaw[] = (data && typeof data === 'object' && 'alquileres' in data && Array.isArray((data as { alquileres?: AlquilerRaw[] }).alquileres)) ? (data as { alquileres?: AlquilerRaw[] }).alquileres ?? [] : [];
        const compras: CompraAlquiler[] = comprasArr.map((c) => ({
          ...c,
          tipo: 'COMPRA',
          fecha: c.fecha_compra || c.fecha || '',
        }));
        const alquileres: CompraAlquiler[] = alquileresArr.map((a) => ({
          ...a,
          tipo: 'ALQUILER',
          fecha: a.fecha_inicio || a.fecha || '',
        }));
        setPeliculas([...compras, ...alquileres]);
      })
      .catch(() => setPeliculas([]))
      .then(() => setLoading(false));
    if (user.rol === 'ADMIN') {
      axios.get('/generos').then(res => setGeneros(Array.isArray(res.data) ? res.data : []));
    }
  }, [user]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'portada_url' && e.target instanceof HTMLInputElement && e.target.type === 'file') {
      if (e.target.files && e.target.files[0]) {
        setPortadaFile(e.target.files[0]);
        setForm({ ...form, portada_url: e.target.files[0].name });
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setModalMsg('');
    try {
      const formData = new FormData();
  formData.append('titulo', form.titulo);
  formData.append('sinopsis', form.sinopsis);
  formData.append('descripcion', form.descripcion);
  formData.append('director', form.director);
  formData.append('generoId', form.generoId);
  formData.append('duracion_minutos', String(Number(form.duracion_minutos)));
  formData.append('cantidad', String(Number(form.cantidad)));
  formData.append('trailer_url', form.trailer_url);
  formData.append('fecha_estreno', form.fecha_estreno);
  formData.append('precio_compra', String(Number(form.precio_compra)));
  formData.append('precio_alquiler', String(Number(form.precio_alquiler)));
  formData.append('estado', form.estado);
      if (portadaFile) {
        formData.append('portada', portadaFile);
      }
      await axios.post('/peliculas', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      setModalMsg('¡Película registrada!');
      setForm({
        titulo: '',
        sinopsis: '',
        descripcion: '',
        director: '',
        generoId: '',
        duracion_minutos: '',
        cantidad: '',
        portada_url: '',
        trailer_url: '',
        fecha_estreno: '',
        precio_compra: '',
        precio_alquiler: '',
        estado: 'DISPONIBLE',
      });
      setPortadaFile(null);
    } catch {
      setModalMsg('Error al registrar película');
    }
    setFormLoading(false);
  };

  return (
  <div style={{ width: '100%', minHeight: '60vh', margin: '40px 0', background: '#18181b', borderRadius: 18, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.13)', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: 0 }}>Mis Películas</h1>
        {user?.rol === 'ADMIN' && (
          <button onClick={() => setShowModal(true)} style={{ background: '#e5b100', color: '#18181b', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 10, padding: '8px 24px', cursor: 'pointer' }}>Registrar nueva película</button>
        )}
      </div>
      {loading ? (
        <div style={{ color: '#aaa', textAlign: 'center' }}>Cargando...</div>
      ) : (
  <div className="movie-search-grid" style={{ justifyContent: 'flex-start' }}>
          {peliculas.length === 0 && <div style={{ gridColumn: '1/-1', color: '#aaa', textAlign: 'center' }}>No tienes películas compradas ni alquiladas.</div>}
          {peliculas.map((item, idx) => (
            item.pelicula && (
              <div key={item.id + '-' + item.tipo + '-' + idx} className="movie-card" onClick={() => window.open(`/peliculas/${item.pelicula.id}`, '_blank')} tabIndex={0} role="button" aria-label={item.pelicula.titulo}>
                <div className="movie-image">
                  <img src={item.pelicula.portada_url} alt={item.pelicula.titulo} />
                </div>
                <div className="movie-title" title={item.pelicula.titulo}>{item.pelicula.titulo}</div>
                <div className="movie-meta" style={{ color: item.tipo === 'COMPRA' ? '#22c55e' : '#3b82f6', fontWeight: 600 }}>
                  {item.tipo === 'COMPRA' ? 'Comprada (acceso permanente)' : 'Alquilada'}
                </div>
                {item.tipo === 'ALQUILER' && (
                  <div className="movie-meta" style={{ color: '#e5b100', fontWeight: 500, fontSize: 13 }}>
                    {item.estado === 'VIGENTE' ? `Días restantes: ${item.dias_restantes ?? '?'} día(s)` : 'Alquiler vencido'}
                  </div>
                )}
                <div className="movie-meta" style={{ color: '#aaa', fontSize: 12 }}>{new Date(item.fecha).toLocaleDateString()}</div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Modal registro película */}
      {showModal && user?.rol === 'ADMIN' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.55)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#23232b', borderRadius: 14, padding: 32, minWidth: 340, maxWidth: 480, width: '100%', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Registrar nueva película</h3>
            <form onSubmit={handleSubmit}>
              <input name="titulo" value={form.titulo} onChange={handleFormChange} placeholder="Título" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <textarea name="sinopsis" value={form.sinopsis} onChange={handleFormChange} placeholder="Sinopsis" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <textarea name="descripcion" value={form.descripcion} onChange={handleFormChange} placeholder="Descripción" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="director" value={form.director} onChange={handleFormChange} placeholder="Director" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <select name="generoId" value={form.generoId} onChange={handleFormChange} style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }}>
                <option value="">Selecciona género</option>
                {generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>
              <input name="duracion_minutos" value={form.duracion_minutos} onChange={handleFormChange} placeholder="Duración (minutos)" type="number" min="0" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="cantidad" value={form.cantidad} onChange={handleFormChange} placeholder="Cantidad" type="number" min="0" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="portada_url" type="file" accept="image/*" onChange={handleFormChange} style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="trailer_url" value={form.trailer_url} onChange={handleFormChange} placeholder="URL trailer" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="fecha_estreno" value={form.fecha_estreno} onChange={handleFormChange} placeholder="Fecha estreno" type="date" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="precio_compra" value={form.precio_compra} onChange={handleFormChange} placeholder="Precio compra" type="number" min="0" step="0.01" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="precio_alquiler" value={form.precio_alquiler} onChange={handleFormChange} placeholder="Precio alquiler" type="number" min="0" step="0.01" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <select name="estado" value={form.estado} onChange={handleFormChange} style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }}>
                <option value="DISPONIBLE">Disponible</option>
                <option value="PROXIMAMENTE">Próximamente</option>
                <option value="AGOTADA">Agotada</option>
                <option value="INACTIVA">Inactiva</option>
              </select>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" style={{ background: '#e5b100', color: '#18181b', fontWeight: 700, border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', opacity: formLoading ? 0.7 : 1 }} disabled={formLoading}>Registrar</button>
                <button type="button" onClick={() => { setShowModal(false); setModalMsg(''); }} style={{ background: '#23232b', color: '#fff', border: '1px solid #444', borderRadius: 8, padding: '8px 18px', cursor: 'pointer' }}>Cancelar</button>
              </div>
              {modalMsg && <div style={{ color: modalMsg.startsWith('¡') ? '#22c55e' : '#e50914', marginTop: 10 }}>{modalMsg}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisPeliculas;
