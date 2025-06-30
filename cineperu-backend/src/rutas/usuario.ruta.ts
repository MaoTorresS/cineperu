import { Router, Request, Response, NextFunction } from 'express';
import { protegerRuta } from '../middlewares/auth.middleware';
import { prisma } from '../prisma/client';

const router = Router();

// Wrapper para manejar funciones asíncronas
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Obtener perfil del usuario
router.get('/perfil', protegerRuta, asyncHandler(async (req: Request, res: Response) => {
  const usuarioId = (req as any).usuario.id;
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: {
      id: true,
      nombre: true,
      correo: true,
      imagen_perfil: true,
      rol: true,
      creado_en: true,
    },
  });

  if (!usuario) {
    res.status(404).json({ mensaje: 'Usuario no encontrado' });
    return;
  }

  res.json(usuario);
}));

// Obtener historial completo del usuario (compras + alquileres)
router.get('/historial', protegerRuta, asyncHandler(async (req: Request, res: Response) => {
  const usuarioId = (req as any).usuario.id;

  const [compras, alquileres] = await Promise.all([
    prisma.compra.findMany({
      where: { usuario_id: usuarioId },
      include: { pelicula: true },
      orderBy: { fecha_compra: 'desc' }
    }),
    prisma.alquiler.findMany({
      where: { usuario_id: usuarioId },
      include: { pelicula: true },
      orderBy: { fecha_inicio: 'desc' }
    })
  ]);

  res.json({
    compras,
    alquileres: alquileres.map(alquiler => ({
      ...alquiler,
      dias_restantes: Math.max(0, Math.ceil(
        (new Date(alquiler.fecha_fin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )),
      estado: new Date(alquiler.fecha_fin) > new Date() ? 'vigente' : 'vencido'
    }))
  });
}));

export default router;
