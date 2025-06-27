import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { json } from 'express';
import usuarioRuta from './rutas/usuario.ruta';
import authRuta from './rutas/auth.ruta';
import peliculaRuta from './rutas/pelicula.ruta';
import compraRuta from './rutas/compra.ruta';
import alquilerRuta from './rutas/alquiler.ruta';
import transaccionRuta from './rutas/transaccion.ruta';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

// Aquí se importarán las rutas
app.get('/', (_req, res) => {
  res.send('🎬 Bienvenido a la API de CinePerú');
});

app.use('/api/usuarios', usuarioRuta);

app.use('/api/auth', authRuta);

app.use('/api/peliculas', peliculaRuta);

app.use('/api/compras', compraRuta);

app.use('/api/alquileres', alquilerRuta);

app.use('/api/transacciones', transaccionRuta);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
