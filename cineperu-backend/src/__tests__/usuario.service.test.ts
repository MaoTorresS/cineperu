import { listarUsuarios } from '../servicios/usuario.service';

describe('listarUsuarios', () => {
  it('debe retornar un array (puede estar vacío o tener usuarios)', async () => {
    const usuarios = await listarUsuarios();
    expect(Array.isArray(usuarios)).toBe(true);
  });

  it('cada usuario debe tener las propiedades esperadas', async () => {
    const usuarios = await listarUsuarios();
    if (usuarios.length > 0) {
      const usuario = usuarios[0];
      expect(usuario).toHaveProperty('id');
      expect(usuario).toHaveProperty('nombre');
      expect(usuario).toHaveProperty('apellido');
      expect(usuario).toHaveProperty('correo');
      expect(usuario).toHaveProperty('rol');
      expect(usuario).toHaveProperty('fecha_creacion');
      expect(usuario).toHaveProperty('activo');
    }
  });
});
