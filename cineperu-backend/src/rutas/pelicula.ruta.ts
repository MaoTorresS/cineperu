// File: cineperu-backend/src/rutas/pelicula.ruta.ts
// Este archivo define las rutas relacionadas con la entidad "pelicula" en la aplicación Express.
import { Router, Request, Response, NextFunction } from 'express';

// Importamos el tipo RequestHandler de Express para definir manejadores de rutas
// Este tipo se utiliza para definir funciones que manejan las solicitudes HTTP
import { RequestHandler } from 'express';

// Importamos los controladores de películas
// Estos controladores contienen la lógica para manejar las solicitudes HTTP relacionadas con películas
import {
  listarPeliculas,
  obtenerPelicula,
  registrarPelicula,
  editarPelicula,
  borrarPelicula,
} from '../controladores/pelicula.controller';

// Importamos el middleware de autenticación para proteger las rutas
// Este middleware se utiliza para asegurar que solo los usuarios autenticados puedan acceder a ciertas rutas
import { protegerRuta } from '../middlewares/auth.middleware';

// Importamos el middleware isAdmin para verificar si el usuario es administrador
// Este middleware se utiliza para asegurar que solo los usuarios con rol de administrador puedan acceder a ciertas
import { isAdmin } from '../middlewares/isAdmin';

// Importamos el middleware isAdmin para verificar si el usuario es administrador
// Este middleware se utiliza para asegurar que solo los usuarios con rol de administrador puedan acceder a ciertas rutas
const router = Router();

// Esta función envuelve un manejador de rutas para capturar errores asíncronos
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Definición de las rutas para la entidad "pelicula"
// GET /peliculas - Listar todas las películas
// Esta ruta no requiere autenticación, por lo que no se protege
router.get('/', asyncHandler(listarPeliculas));

// GET /peliculas/:id - Obtener una película por su ID
// Esta ruta no requiere autenticación, por lo que no se protege
router.get('/:id', asyncHandler(obtenerPelicula));

// POST /peliculas - Registrar una nueva película
// Se protege la ruta para que solo usuarios autenticados puedan registrar películas
router.post('/', protegerRuta, isAdmin, asyncHandler(registrarPelicula));
router.put('/:id', protegerRuta, isAdmin, asyncHandler(editarPelicula));
router.delete('/:id', protegerRuta, isAdmin, asyncHandler(borrarPelicula));

export default router;