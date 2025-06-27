import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const obtenerUsuarios = async (_req: Request, res: Response) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
};
