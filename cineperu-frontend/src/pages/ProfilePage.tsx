import React, { useEffect, useState } from 'react';
import AdminPeliculas from './AdminPeliculas';
import useRedirectIfNotAuth from '../hooks/useRedirectIfNotAuth';
import DefaultUserImg from '../components/DefaultUserImg';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

interface Pelicula {
  id: string;
  titulo: string;
  portada_url: string;
}

interface CompraAlquiler {
  id: string;
  tipo: 'COMPRA' | 'ALQUILER';
  fecha: string;
  estado: string;
  pelicula: Pelicula;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  useRedirectIfNotAuth();
  const [compras, setCompras] = useState<CompraAlquiler[]>([]);
  const [alquileres, setAlquileres] = useState<CompraAlquiler[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const [showAdminPeliculas, setShowAdminPeliculas] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await axios.get(`/usuarios/perfil`);
        const data = res.data as { compras?: CompraAlquiler[]; alquileres?: CompraAlquiler[] };
        setCompras(data.compras || []);
        setAlquileres(data.alquileres || []);
      } catch {
        // Manejo de error opcional
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) return <div className="text-center py-10">No autenticado</div>;
  if (loading) return <div className="text-center py-10">Cargando perfil...</div>;

  return (
    <div style={{ maxWidth: 540, margin: '40px auto', background: '#18181b', borderRadius: 18, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.13)', padding: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, marginBottom: 32 }}>
        <div>
          {user.imagen_perfil ? (
            <img src={user.imagen_perfil} alt="Perfil" style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: '4px solid #e5b100', background: '#23232b' }} />
          ) : (
            <DefaultUserImg size={110} />
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{user.nombre} {user.apellido}</h2>
          <div style={{ color: '#e5b100', fontWeight: 500, fontSize: 15, marginBottom: 2 }}>{user.correo}</div>
          {/* <div style={{ color: '#aaa', fontSize: 14, marginBottom: 10 }}>Rol: {user.rol}</div> */}
          <button onClick={() => setShowPwd(true)} style={{ background: '#e5b100', color: '#18181b', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 10, padding: '8px 24px', cursor: 'pointer', marginTop: 6 }}>Cambiar contraseña</button>
          {user.rol === 'ADMIN' && (
            <button
              onClick={() => setShowAdminPeliculas(true)}
              style={{ background: '#e5b100', color: '#18181b', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 10, padding: '8px 24px', cursor: 'pointer', marginTop: 14, marginLeft: 8 }}
            >
              Ver películas
            </button>
          )}
        </div>
      </div>
      {/* Modal admin ver películas */}
      {showAdminPeliculas && user.rol === 'ADMIN' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#23232b', borderRadius: 14, padding: 24, minWidth: 340, maxWidth: 1200, width: '96vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)', position: 'relative' }}>
            <button onClick={() => setShowAdminPeliculas(false)} style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', color: '#fff', fontSize: 26, cursor: 'pointer', zIndex: 10 }}>×</button>
            <AdminPeliculas onEdit={() => {}} />
          </div>
        </div>
      )}

      {/* Modal cambiar contraseña */}
      {showPwd && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.55)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#23232b', borderRadius: 14, padding: 32, minWidth: 320, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Cambiar contraseña</h3>
            <input type="password" placeholder="Nueva contraseña" value={pwd} onChange={e => setPwd(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
            <input type="password" placeholder="Repetir contraseña" value={pwd2} onChange={e => setPwd2(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#18181b', color: '#fff' }} />
            {pwdMsg && <div style={{ color: pwdMsg.startsWith('¡') ? '#22c55e' : '#e50914', marginBottom: 10 }}>{pwdMsg}</div>}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={async () => {
                setPwdMsg('');
                if (!pwd || !pwd2) return setPwdMsg('Completa ambos campos');
                if (pwd !== pwd2) return setPwdMsg('Las contraseñas no coinciden');
                setPwdLoading(true);
                try {
                  await axios.put('/usuarios/cambiar-password', { password: pwd });
                  setPwdMsg('¡Contraseña actualizada!');
                  setPwd(''); setPwd2('');
                  setTimeout(() => { setShowPwd(false); setPwdMsg(''); }, 1200);
                } catch {
                  setPwdMsg('Error al actualizar contraseña');
                }
                setPwdLoading(false);
              }} style={{ background: '#e5b100', color: '#18181b', fontWeight: 700, border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', opacity: pwdLoading ? 0.7 : 1 }} disabled={pwdLoading}>Guardar</button>
              <button onClick={() => { setShowPwd(false); setPwdMsg(''); setPwd(''); setPwd2(''); }} style={{ background: '#23232b', color: '#fff', border: '1px solid #444', borderRadius: 8, padding: '8px 18px', cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>Mis Compras</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px,1fr))', gap: 16 }}>
          {compras.length === 0 && <div style={{ gridColumn: '1/-1', color: '#aaa', textAlign: 'center' }}>No tienes compras registradas.</div>}
          {compras.map((c) => (
            <div key={c.id} style={{ background: '#23232b', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
              <img src={c.pelicula.portada_url} alt={c.pelicula.titulo} style={{ width: 54, height: 78, objectFit: 'cover', borderRadius: 8, marginBottom: 6 }} />
              <div style={{ fontWeight: 600, color: '#fff', fontSize: 13, textAlign: 'center', marginBottom: 2 }}>{c.pelicula.titulo}</div>
              <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 500 }}>{c.tipo}</div>
              <div style={{ color: '#aaa', fontSize: 11 }}>{new Date(c.fecha).toLocaleDateString()}</div>
              <div style={{ color: '#e5b100', fontSize: 12, fontWeight: 600 }}>{c.estado}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>Mis Alquileres</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px,1fr))', gap: 16 }}>
          {alquileres.length === 0 && <div style={{ gridColumn: '1/-1', color: '#aaa', textAlign: 'center' }}>No tienes alquileres activos.</div>}
          {alquileres.map((a) => (
            <div key={a.id} style={{ background: '#23232b', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
              <img src={a.pelicula.portada_url} alt={a.pelicula.titulo} style={{ width: 54, height: 78, objectFit: 'cover', borderRadius: 8, marginBottom: 6 }} />
              <div style={{ fontWeight: 600, color: '#fff', fontSize: 13, textAlign: 'center', marginBottom: 2 }}>{a.pelicula.titulo}</div>
              <div style={{ color: '#3b82f6', fontSize: 12, fontWeight: 500 }}>{a.tipo}</div>
              <div style={{ color: '#aaa', fontSize: 11 }}>{new Date(a.fecha).toLocaleDateString()}</div>
              <div style={{ color: '#e5b100', fontSize: 12, fontWeight: 600 }}>{a.estado}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
