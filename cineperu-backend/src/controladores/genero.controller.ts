import { Request, Response } from 'express';
import { listarGeneros as listarGenerosService } from '../servicios/pelicula.service';

export const listarGeneros = async (_req: Request, res: Response) => {
  const generos = await listarGenerosService();
  res.json(generos);
};
