
// Buscar usuario por correo (case-insensitive)
export const buscarUsuarioPorCorreo = async (correo: string) => {
  return prisma.usuario.findFirst({ where: { correo: { equals: correo.toLowerCase(), mode: 'insensitive' } } });
};

// Actualizar contraseña
export const actualizarPassword = async (correo: string, nueva: string) => {
  const hash = await bcrypt.hash(nueva, 10);
  return prisma.usuario.update({ where: { correo }, data: { contraseña: hash } });
};
import { prisma } from '../prisma/client';
import bcrypt from 'bcrypt';
import { generarToken } from '../utils/jwt';


export const registrarUsuario = async (nombre: string, apellido: string, correo: string, contraseña: string) => {
  const correoLower = correo.toLowerCase();
  const existe = await prisma.usuario.findFirst({ where: { correo: { equals: correoLower, mode: 'insensitive' } } });
  if (existe) throw new Error('El correo ya está registrado');

  const hash = await bcrypt.hash(contraseña, 10);

  const usuario = await prisma.usuario.create({
    data: { nombre, apellido, correo: correoLower, contraseña: hash, rol: 'USUARIO' },
  });

  const token = generarToken({ id: usuario.id, rol: usuario.rol });
  return { usuario, token };
};


export const loginUsuario = async (correo: string, contraseña: string) => {
  const usuario = await prisma.usuario.findFirst({ where: { correo: { equals: correo.toLowerCase(), mode: 'insensitive' } } });
  if (!usuario || !usuario.contraseña) throw new Error('Credenciales inválidas');

  const valido = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!valido) throw new Error('Credenciales inválidas');

  const token = generarToken({ id: usuario.id, rol: usuario.rol });
  return { usuario, token };
};
