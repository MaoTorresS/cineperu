import { prisma } from '../prisma/client';
import bcrypt from 'bcrypt';
import { generarToken } from '../utils/jwt';

export const registrarUsuario = async (nombre: string, correo: string, contraseña: string) => {
  const existe = await prisma.usuario.findUnique({ where: { correo } });
  if (existe) throw new Error('El correo ya está registrado');

  const hash = await bcrypt.hash(contraseña, 10);

  const usuario = await prisma.usuario.create({
    data: { nombre, correo, contraseña: hash },
  });

  const token = generarToken({ id: usuario.id, rol: usuario.rol });
  return { usuario, token };
};

export const loginUsuario = async (correo: string, contraseña: string) => {
  const usuario = await prisma.usuario.findUnique({ where: { correo } });
  if (!usuario || !usuario.contraseña) throw new Error('Credenciales inválidas');

  const valido = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!valido) throw new Error('Credenciales inválidas');

  const token = generarToken({ id: usuario.id, rol: usuario.rol });
  return { usuario, token };
};
