import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/movie.css';


interface Pelicula {
  id: string;
  titulo: string;
  sinopsis?: string;
  descripcion?: string;
  director?: string;
  genero?: { id: string; nombre: string } | string;
  generoId?: string;
  duracion_minutos?: number | string;
  cantidad?: number | string;
  portada_url: string;
  trailer_url?: string;
  fecha_estreno?: string;
  precio_compra?: string | number;
  precio_alquiler?: string | number;
  estado?: string;
}


const AdminPeliculas: React.FC<{ onEdit?: (pelicula: any) => void }> = () => {
  const { token } = useAuth();
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<Pelicula | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editPortada, setEditPortada] = useState<File | null>(null);
  const [editMsg, setEditMsg] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [generos, setGeneros] = useState<{ id: string; nombre: string }[]>([]);

  useEffect(() => {
    setLoading(true);
    axios.get('/peliculas', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => {
        const data = res.data as { peliculas?: Pelicula[] };
        setPeliculas(data.peliculas || []);
      })
      .catch(() => setPeliculas([]))
      .then(() => setLoading(false));
    axios.get('/generos').then(res => setGeneros(Array.isArray(res.data) ? res.data : []));
  }, [token, showEdit]);

  const openEdit = (p: Pelicula) => {
    setEditData(p);
    setEditForm({
      titulo: p.titulo || '',
      sinopsis: (p as any).sinopsis || '',
      descripcion: (p as any).descripcion || '',
      director: (p as any).director || '',
      generoId: typeof p.genero === 'object' && p.genero ? (p.genero as any).id : '',
      duracion_minutos: p.duracion_minutos || '',
      cantidad: p.cantidad || '',
      trailer_url: (p as any).trailer_url || '',
      fecha_estreno: p.fecha_estreno ? p.fecha_estreno.slice(0,10) : '',
      precio_compra: p.precio_compra || '',
      precio_alquiler: (p as any).precio_alquiler || '',
      estado: (p as any).estado || 'DISPONIBLE',
    });
    setEditPortada(null);
    setEditMsg('');
    setShowEdit(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'portada_url' && e.target instanceof HTMLInputElement && e.target.type === 'file') {
      if (e.target.files && e.target.files[0]) {
        setEditPortada(e.target.files[0]);
      }
    } else {
      setEditForm({ ...editForm, [e.target.name]: e.target.value });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    setEditLoading(true);
    setEditMsg('');
    try {
      const formData = new FormData();
      formData.append('titulo', editForm.titulo);
      formData.append('sinopsis', editForm.sinopsis);
      formData.append('descripcion', editForm.descripcion);
      formData.append('director', editForm.director);
      formData.append('generoId', editForm.generoId);
      formData.append('duracion_minutos', String(Number(editForm.duracion_minutos)));
      formData.append('cantidad', String(Number(editForm.cantidad)));
      formData.append('trailer_url', editForm.trailer_url);
      formData.append('fecha_estreno', editForm.fecha_estreno);
      formData.append('precio_compra', String(Number(editForm.precio_compra)));
      formData.append('precio_alquiler', String(Number(editForm.precio_alquiler)));
      formData.append('estado', editForm.estado);
      if (editPortada) {
        formData.append('portada', editPortada);
      }
      await axios.put(`/peliculas/${editData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      setEditMsg('¡Película actualizada!');
      setTimeout(() => { setShowEdit(false); setEditMsg(''); }, 1200);
    } catch {
      setEditMsg('Error al actualizar película');
    }
    setEditLoading(false);
  };

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
                <img src={p.portada_url && p.portada_url.startsWith('/assets/portadas/') ? `http://localhost:3000${p.portada_url}` : p.portada_url} alt={p.titulo} />
              </div>
              <div className="movie-title" title={p.titulo}>{p.titulo}</div>
              {p.genero && <div className="movie-meta">{typeof p.genero === 'string' ? p.genero : p.genero.nombre}</div>}
              {p.precio_compra && <div className="movie-price movie-price-center">S/ {parseFloat(p.precio_compra as any).toFixed(2)}</div>}
              <div style={{ flex: 1 }} />
              <button className="movie-btn" style={{ background: '#e5b100', color: '#18181b', fontWeight: 700 }} onClick={() => openEdit(p)}>Editar</button>
            </div>
          ))}
        </div>
      )}

      {/* Modal edición */}
      {showEdit && editData && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#23232b', borderRadius: 14, padding: 32, minWidth: 340, maxWidth: 480, width: '100%', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)', position: 'relative' }}>
            <button onClick={() => { setShowEdit(false); setEditMsg(''); }} style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', color: '#fff', fontSize: 26, cursor: 'pointer', zIndex: 10 }}>×</button>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Editar película</h3>
            <form onSubmit={handleEditSubmit}>
              <input name="titulo" value={editForm.titulo} onChange={handleEditChange} placeholder="Título" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <textarea name="sinopsis" value={editForm.sinopsis} onChange={handleEditChange} placeholder="Sinopsis" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <textarea name="descripcion" value={editForm.descripcion} onChange={handleEditChange} placeholder="Descripción" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="director" value={editForm.director} onChange={handleEditChange} placeholder="Director" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <select name="generoId" value={editForm.generoId} onChange={handleEditChange} style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }}>
                <option value="">Selecciona género</option>
                {generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>
              <input name="duracion_minutos" value={editForm.duracion_minutos} onChange={handleEditChange} placeholder="Duración (minutos)" type="number" min="0" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="cantidad" value={editForm.cantidad} onChange={handleEditChange} placeholder="Cantidad" type="number" min="0" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="portada_url" type="file" accept="image/*" onChange={handleEditChange} style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="trailer_url" value={editForm.trailer_url} onChange={handleEditChange} placeholder="URL trailer" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="fecha_estreno" value={editForm.fecha_estreno} onChange={handleEditChange} placeholder="Fecha estreno" type="date" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="precio_compra" value={editForm.precio_compra} onChange={handleEditChange} placeholder="Precio compra" type="number" min="0" step="0.01" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <input name="precio_alquiler" value={editForm.precio_alquiler} onChange={handleEditChange} placeholder="Precio alquiler" type="number" min="0" step="0.01" style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
              <select name="estado" value={editForm.estado} onChange={handleEditChange} style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }}>
                <option value="DISPONIBLE">Disponible</option>
                <option value="PROXIMAMENTE">Próximamente</option>
                <option value="AGOTADA">Agotada</option>
                <option value="INACTIVA">Inactiva</option>
              </select>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" style={{ background: '#e5b100', color: '#18181b', fontWeight: 700, border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', opacity: editLoading ? 0.7 : 1 }} disabled={editLoading}>Guardar</button>
                <button type="button" onClick={() => { setShowEdit(false); setEditMsg(''); }} style={{ background: '#23232b', color: '#fff', border: '1px solid #444', borderRadius: 8, padding: '8px 18px', cursor: 'pointer' }}>Cancelar</button>
              </div>
              {editMsg && <div style={{ color: editMsg.startsWith('¡') ? '#22c55e' : '#e50914', marginTop: 10 }}>{editMsg}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPeliculas;
