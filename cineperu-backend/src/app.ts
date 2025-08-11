import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { json } from 'express';

import usuarioRuta from './rutas/usuario.ruta';
import authRuta from './rutas/auth.ruta';
import peliculaRuta from './rutas/pelicula.ruta';
import compraRuta from './rutas/compra.ruta';
import alquilerRuta from './rutas/alquiler.ruta';
import transaccionRuta from './rutas/transaccion.ruta';
import generoRuta from './rutas/genero.ruta';
import carritoRuta from './rutas/carrito.ruta';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear una instancia de Express
const app = express();
app.use(cors());
app.use(json());


// Ruta raíz de la API
app.get('/api', (_req, res) => {
  res.json({ mensaje: '🎬 Bienvenido a la API de CinePerú' });
});

// Rutas de la API
// Aquí se importarán las rutas de usuario, autenticación, películas, compras, alquileres y transacciones
app.use('/api/usuarios', usuarioRuta);

app.use('/api/auth', authRuta);

app.use('/api/peliculas', peliculaRuta);

app.use('/api/compras', compraRuta);

app.use('/api/alquiler', alquilerRuta);


app.use('/api/generos', generoRuta);
app.use('/api/carrito', carritoRuta);
app.use('/api/transacciones', transaccionRuta);

// corremos el servidor en el puerto especificado en las variables de entorno o en el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
