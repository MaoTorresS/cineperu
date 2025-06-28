// src/rutas/alquiler.ruta.ts
import { Router, Request, Response } from 'express';
import { alquilarPelicula, listarAlquileresUsuario } from '../controladores/alquiler.controller';
import { protegerRuta } from '../middlewares/auth.middleware';

const router = Router();
const asyncHandler = (fn: any) => (req: Request, res: Response, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', protegerRuta, asyncHandler(alquilarPelicula));
router.get('/', protegerRuta, asyncHandler(listarAlquileresUsuario));

export default router;
