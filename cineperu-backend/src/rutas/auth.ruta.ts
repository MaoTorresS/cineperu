import { Router } from 'express';
import { registro, login } from '../controladores/auth.controller';

const router = Router();

// ✅ Registro público - cualquiera puede registrarse
router.post('/registro', registro);
// ✅ Login público
router.post('/login', login);

export default router;
