import { Router, Request, Response } from 'express';
import { protegerRuta } from '../middlewares/auth.middleware';
import { prisma } from '../prisma/client';

const router = Router();

router.get('/perfil', protegerRuta, async (req: Request, res: Response) => {
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

  res.json(usuario);
});

export default router; // ⬅️ MUY IMPORTANTE
