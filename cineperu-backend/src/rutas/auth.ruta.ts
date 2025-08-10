import { Router } from 'express';
import { registro, login, recuperarPassword } from '../controladores/auth.controller';

const router = Router();


// Wrapper para manejar funciones asíncronas y evitar errores de tipos
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

// ✅ Registro público - cualquiera puede registrarse
router.post('/registro', asyncHandler(registro));
// ✅ Login público
router.post('/login', asyncHandler(login));

// ✅ Recuperar contraseña (sin email, solo cambio directo)
router.post('/recuperar', asyncHandler(recuperarPassword));

export default router;
