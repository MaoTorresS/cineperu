import { Router } from 'express';
import { comprarPelicula, listarComprasUsuario } from '../controladores/compra.controller';
import { protegerRuta } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', protegerRuta, (req, res, next) => {
	Promise.resolve(comprarPelicula(req, res)).catch(next);
});
router.get('/', protegerRuta, (req, res, next) => {
	Promise.resolve(listarComprasUsuario(req, res)).catch(next);
});

export default router;
