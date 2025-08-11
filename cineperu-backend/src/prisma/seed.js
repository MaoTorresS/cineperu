const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  try {
    // Crear admin
    const adminEmail = "admin@cineperu.com";
    const adminPassword = await bcrypt.hash("admin123", 10);

    // Solo crear admin si no existe
    let admin = await prisma.usuario.findUnique({ where: { correo: adminEmail } });
    if (!admin) {
      admin = await prisma.usuario.create({
        data: {
          nombre: "Admin",
          apellido: "CinePeru",
          correo: adminEmail,
          contraseña: adminPassword,
          rol: "ADMIN",
        },
      });
      console.log("✅ Admin creado:", admin.id);
    } else {
      console.log("ℹ️ Admin ya existe:", admin.id);
    }

    // Solo crear usuario normal si no existe
    const userEmail = "user@cineperu.com";
    const userPassword = await bcrypt.hash("user123", 10);
    let usuario = await prisma.usuario.findUnique({ where: { correo: userEmail } });
    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: {
          nombre: "Usuario",
          apellido: "Normal",
          correo: userEmail,
          contraseña: userPassword,
          rol: "USUARIO",
        },
      });
      console.log("✅ Usuario normal creado:", usuario.id);
    } else {
      console.log("ℹ️ Usuario normal ya existe:", usuario.id);
    }


    // Crear géneros demo
    const generosData = [
      { nombre: "Acción", descripcion: "Películas de acción y aventura" },
      { nombre: "Ciencia Ficción", descripcion: "Películas de ciencia ficción" },
      { nombre: "Drama", descripcion: "Películas dramáticas" },
      { nombre: "Crimen", descripcion: "Películas de crimen y mafia" },
      { nombre: "Fantasia", descripcion: "Películas de fantasía" },
      { nombre: "Animación", descripcion: "Películas animadas" },
      { nombre: "Comedia", descripcion: "Películas cómicas" }
    ];

    const generos = {};
    for (const generoData of generosData) {
      let genero = await prisma.genero.findUnique({ where: { nombre: generoData.nombre } });
      if (!genero) {
        genero = await prisma.genero.create({ data: generoData });
        console.log(`✅ Género creado: ${genero.nombre}`);
      } else {
        console.log(`ℹ️ Género ya existe: ${genero.nombre}`);
      }
      generos[genero.nombre] = genero;
    }

    // Solo crear la película Matrix si no existe
    const matrixData = {
      titulo: "Matrix",
      sinopsis: "Un hacker descubre la verdad sobre su realidad.",
      descripcion: "Matrix es una película de ciencia ficción y acción que explora la realidad simulada.",
      director: "Wachowski",
      generoId: generos["Ciencia Ficción"].id,
      duracion_minutos: 136,
      cantidad: 10,
      portada_url: "https://via.placeholder.com/200x300?text=Matrix",
      trailer_url: "https://youtube.com/watch?v=m8e-FF8MsqU",
      fecha_estreno: new Date("1999-03-31"),
      precio_compra: 19.99,
      precio_alquiler: 4.99,
      estado: "DISPONIBLE",
    };
    let matrix = await prisma.pelicula.findUnique({ where: { titulo: matrixData.titulo } });
    if (!matrix) {
      matrix = await prisma.pelicula.create({ data: matrixData });
      console.log(`✅ Película "${matrixData.titulo}" creada:`, matrix.id);
    } else {
      console.log(`ℹ️ Película "${matrixData.titulo}" ya existe:`, matrix.id);
    }

    console.log("🎬 Seed completado exitosamente");

  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Conexión a la base de datos cerrada');
  });