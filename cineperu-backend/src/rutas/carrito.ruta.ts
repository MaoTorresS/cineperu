import { Router } from 'express';
import { protegerRuta } from '../middlewares/auth.middleware';
import {
  agregarAlCarrito,
  listarCarrito,
  eliminarDelCarrito,
  limpiarCarrito,
  finalizarCarrito
} from '../controladores/carrito.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.post('/', protegerRuta, (req, res) => { agregarAlCarrito(req, res); });
router.get('/', protegerRuta, (req, res) => { listarCarrito(req, res); });
router.delete('/:id', protegerRuta, (req, res) => { eliminarDelCarrito(req, res); });
router.delete('/', protegerRuta, (req, res) => { limpiarCarrito(req, res); });
router.post('/finalizar', protegerRuta, (req, res) => { finalizarCarrito(req, res); });

export default router;
