import { prisma } from '../prisma/client';

export const listarUsuarios = async () => {
  return prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      apellido: true,
      correo: true,
      imagen_perfil: true,
      rol: true,
      fecha_creacion: true,
      activo: true
    }
  });
};

export const editarUsuario = async (id: string, data: any) => {
  return prisma.usuario.update({
    where: { id },
    data
  });
};

export const cambiarEstadoUsuario = async (id: string, activo: boolean) => {
  return prisma.usuario.update({
    where: { id },
    data: { activo }
  });
};

export const eliminarUsuario = async (id: string) => {
  return prisma.usuario.delete({
    where: { id }
  });
};
