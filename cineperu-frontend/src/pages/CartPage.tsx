
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/movie.css';

interface CarritoItem {
  id: string;
  pelicula: {
    id: string;
    titulo: string;
    portada_url: string;
    precio_compra: string;
    precio_alquiler: string;
  };
  tipo: 'COMPRA' | 'ALQUILER';
  cantidad: number;
}

const CartPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CarritoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('/carrito', {
      headers: { Authorization: `Bearer ${token}` }
    })
  .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('No se pudo cargar el carrito'))
      .then(() => setLoading(false));
  }, [token]);

  const handleRemove = async (id: string) => {
    try {
      await axios.delete(`/carrito/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.filter(item => item.id !== id));
    } catch {
      setError('No se pudo eliminar el ítem 😞');
    }
  };

  const handleQuantity = async (id: string, cantidad: number) => {
    if (cantidad < 1) return;
    try {
      await axios.put(`/carrito/${id}`, { cantidad }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.map(item => item.id === id ? { ...item, cantidad } : item));
    } catch {
      setError('No se pudo actualizar la cantidad');
    }
  };

  const getPrecio = (item: CarritoItem) => {
    if (item.tipo === 'COMPRA') return Number(item.pelicula.precio_compra);
    if (item.tipo === 'ALQUILER') return Number(item.pelicula.precio_alquiler);
    return 0;
  };
  const total = items.reduce((sum, item) => sum + getPrecio(item) * item.cantidad, 0);

  if (loading) return <div className="text-center py-10">Cargando carrito...</div>;

  // Acción de realizar pago (finalizar carrito)
  const handleCheckout = async () => {
    try {
      await axios.post('/carrito/finalizar', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems([]);
      setSuccess('¡Pago realizado con éxito 😎! Serás redirigido al inicio...');
      setTimeout(() => {
        setSuccess('');
        navigate('/');
      }, 2200);
    } catch (err: unknown) {
      // Definir tipo auxiliar para error de Axios
      interface AxiosError {
        response?: {
          data?: {
            mensaje?: string;
          };
        };
      }
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        (err as AxiosError).response?.data?.mensaje
      ) {
        setError((err as AxiosError).response!.data!.mensaje!);
      } else {
        setError('No se pudo realizar el pago');
      }
    }
  };

  return (
    <div style={{ maxWidth: 540, margin: '40px auto', background: '#18181b', borderRadius: 18, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.13)', padding: 32 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24, color: '#fff', borderBottom: '2px solid #e5b100', paddingBottom: 12 }}>Seguir a pago</h1>
  {error && <div style={{ color: '#e50914', marginBottom: 16 }}>{error}</div>}
  {success && <div style={{ color: '#22c55e', background: '#232b23', borderRadius: 8, padding: '10px 0', marginBottom: 16, textAlign: 'center', fontWeight: 600 }}>{success}</div>}
      {items.length === 0 ? (
        <div style={{ color: '#aaa', textAlign: 'center' }}>Tu carrito está vacío.</div>
      ) : (
        <>
          <table style={{ width: '100%', marginBottom: 18, background: 'none' }}>
            <thead>
              <tr style={{ color: '#e5b100', fontWeight: 600, fontSize: 15 }}>
                <th style={{ width: 70 }}></th>
                <th style={{ textAlign: 'left' }}>Producto</th>
                <th style={{ width: 60 }}>Cant.</th>
                <th style={{ width: 80 }}>Precio</th>
                <th style={{ width: 30 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #222' }}>
                  <td>
                    <img
                      src={item.pelicula.portada_url && item.pelicula.portada_url.startsWith('/assets/portadas/') ? `http://localhost:3000${item.pelicula.portada_url}` : item.pelicula.portada_url}
                      alt={item.pelicula.titulo}
                      style={{ width: 54, height: 78, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 16 }}>{item.pelicula.titulo}</div>
                    <div style={{ color: '#e5b100', fontSize: 13, fontWeight: 500 }}>{item.tipo === 'ALQUILER' ? 'Alquiler (7 días)' : 'Compra'}</div>
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={item.cantidad}
                      style={{ width: 44, borderRadius: 6, border: '1px solid #333', background: '#23232b', color: '#fff', padding: '4px 8px', textAlign: 'center' }}
                      onChange={e => handleQuantity(item.id, Number(e.target.value))}
                    />
                  </td>
                  <td style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>
                    S/ {getPrecio(item).toFixed(2)}
                  </td>
                  <td>
                    <button onClick={() => handleRemove(item.id)} style={{ background: 'none', border: 'none', color: '#e50914', fontSize: 20, cursor: 'pointer' }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <button type="button" onClick={() => window.history.back()} style={{ color: '#e5b100', textDecoration: 'underline', fontWeight: 500, fontSize: 15, background: 'none', border: 'none', cursor: 'pointer' }}>&lt; Continuar comprando</button>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>
              Total: <span style={{ color: '#e5b100', fontSize: 18 }}>S/ {total.toFixed(2)}</span>
            </div>
          </div>
          <button
            style={{ width: '100%', background: '#e5b100', color: '#18181b', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 10, padding: '12px 0', marginTop: 8, cursor: items.length === 0 ? 'not-allowed' : 'pointer', opacity: items.length === 0 ? 0.6 : 1, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            Realizar pago
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
