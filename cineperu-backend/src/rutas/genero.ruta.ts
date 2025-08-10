import { Router } from 'express';
import { listarGeneros } from '../controladores/genero.controller';

const router = Router();

router.get('/', listarGeneros);

export default router;
