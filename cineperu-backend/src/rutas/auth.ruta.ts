import { Router } from 'express';
import { registro, login } from '../controladores/auth.controller';

const router = Router();

router.post('/registro', registro);
router.post('/login', login); // ✅ esta es la que usaremos ahora

export default router;
