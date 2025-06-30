const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  try {
    // Crear admin
    const adminEmail = "admin@cineperu.com";
    const adminPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.usuario.upsert({
      where: { correo: adminEmail },
      update: {
        contraseña: adminPassword,
        rol: "admin"
      },
      create: {
        nombre: "Admin",
        correo: adminEmail,
        contraseña: adminPassword,
        rol: "admin",
      },
    });

    console.log("✅ Admin creado/actualizado:", admin.id);

    // Crear usuario normal
    const userEmail = "user@cineperu.com";
    const userPassword = await bcrypt.hash("user123", 10);

    const usuario = await prisma.usuario.upsert({
      where: { correo: userEmail },
      update: {
        contraseña: userPassword
      },
      create: {
        nombre: "Usuario Normal",
        correo: userEmail,
        contraseña: userPassword,
        rol: "usuario",
      },
    });

    console.log("✅ Usuario normal creado/actualizado:", usuario.id);

    // Crear películas demo
    const peliculas = [
      {
        titulo: "Matrix",
        sinopsis: "Un hacker descubre la verdad sobre su realidad.",
        director: "Wachowski",
        genero: ["Acción", "Ciencia Ficción"],
        duracion_minutos: 136,
        portada_url: "https://via.placeholder.com/200x300?text=Matrix",
        trailer_url: "https://youtube.com/watch?v=m8e-FF8MsqU",
        fecha_estreno: new Date("1999-03-31"),
        precio_compra: 19.99,
        precio_alquiler: 4.99,
        estado: "DISPONIBLE",
      },
      {
        titulo: "Interestelar",
        sinopsis: "Un viaje a través del espacio para salvar a la humanidad.",
        director: "Christopher Nolan",
        genero: ["Drama", "Ciencia Ficción"],
        duracion_minutos: 169,
        portada_url: "https://via.placeholder.com/200x300?text=Interestelar",
        trailer_url: "https://youtube.com/watch?v=zSWdZVtXT7E",
        fecha_estreno: new Date("2014-11-07"),
        precio_compra: 24.99,
        precio_alquiler: 5.99,
        estado: "DISPONIBLE",
      },
      {
        titulo: "El Padrino",
        sinopsis: "La historia de una familia de la mafia italiana.",
        director: "Francis Ford Coppola",
        genero: ["Drama", "Crimen"],
        duracion_minutos: 175,
        portada_url: "https://via.placeholder.com/200x300?text=El+Padrino",
        trailer_url: "https://youtube.com/watch?v=sY1S34973zA",
        fecha_estreno: new Date("1972-03-24"),
        precio_compra: 19.99,
        precio_alquiler: 4.99,
        estado: "DISPONIBLE",
      },
    ];

    // Crear películas
    for (const peliculaData of peliculas) {
      try {
        const pelicula = await prisma.pelicula.upsert({
          where: { titulo: peliculaData.titulo },
          update: peliculaData,
          create: peliculaData,
        });
        console.log(`✅ Película "${peliculaData.titulo}" creada/actualizada:`, pelicula.id);
      } catch (error) {
        console.log(`⚠️ Error con película "${peliculaData.titulo}":`, error.message);
      }
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