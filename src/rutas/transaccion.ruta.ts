import { Router, Request, Response } from 'express';
import { crearTransaccion, listarTransaccionesUsuario } from '../controladores/transaccion.controller';
import { protegerRuta } from '../middlewares/auth.middleware';

const router = Router();
const asyncHandler = (fn: any) => (req: Request, res: Response, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', protegerRuta, asyncHandler(crearTransaccion));
router.get('/', protegerRuta, asyncHandler(listarTransaccionesUsuario));

export default router;
