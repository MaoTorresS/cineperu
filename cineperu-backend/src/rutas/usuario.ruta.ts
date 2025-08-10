
import { Router } from 'express';
import { protegerRuta } from '../middlewares/auth.middleware';
import { perfilUsuario, registrarUsuario, listarUsuarios, editarUsuario, cambiarEstadoUsuario, eliminarUsuario } from '../controladores/usuario.controller';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

// Listar todos los usuarios (solo admin)
router.get('/', protegerRuta, isAdmin, (req, res, next) => {
  Promise.resolve(listarUsuarios(req, res)).catch(next);
});

// Editar usuario (solo admin)
router.put('/:id', protegerRuta, isAdmin, (req, res, next) => {
  Promise.resolve(editarUsuario(req, res)).catch(next);
});

// Bloquear/desbloquear usuario (solo admin)
router.patch('/:id/estado', protegerRuta, isAdmin, (req, res, next) => {
  Promise.resolve(cambiarEstadoUsuario(req, res)).catch(next);
});

// Eliminar usuario (solo admin)
router.delete('/:id', protegerRuta, isAdmin, (req, res, next) => {
  Promise.resolve(eliminarUsuario(req, res)).catch(next);
});

// Registro de usuario
router.post('/registrar', (req, res, next) => {
  Promise.resolve(registrarUsuario(req, res)).catch(next);
});

// Endpoint robusto de perfil de usuario (datos + historial)
router.get('/perfil', protegerRuta, (req, res) => { perfilUsuario(req, res); });

export default router;
