import { Router, Request, Response } from 'express';
import { RequestHandler } from 'express';

import {
  listarPeliculas,
  obtenerPelicula,
  registrarPelicula,
  editarPelicula,
  borrarPelicula,
} from '../controladores/pelicula.controller';
import { protegerRuta } from '../middlewares/auth.middleware';


const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: Function) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.get('/', asyncHandler(listarPeliculas));
router.post('/', protegerRuta, asyncHandler(registrarPelicula));
router.put('/:id', protegerRuta, asyncHandler(editarPelicula));
router.delete('/:id', protegerRuta, asyncHandler(borrarPelicula));
router.get('/:id', asyncHandler(obtenerPelicula));
export default router;