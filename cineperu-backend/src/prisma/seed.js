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
        rol: "ADMIN",
        apellido: "CinePeru"
      },
      create: {
        nombre: "Admin",
        apellido: "CinePeru",
        correo: adminEmail,
        contraseña: adminPassword,
        rol: "ADMIN",
      },
    });

    console.log("✅ Admin creado/actualizado:", admin.id);

    // Crear usuario normal
    const userEmail = "user@cineperu.com";
    const userPassword = await bcrypt.hash("user123", 10);

    const usuario = await prisma.usuario.upsert({
      where: { correo: userEmail },
      update: {
        contraseña: userPassword,
        apellido: "Normal"
      },
      create: {
        nombre: "Usuario",
        apellido: "Normal",
        correo: userEmail,
        contraseña: userPassword,
        rol: "USUARIO",
      },
    });

    console.log("✅ Usuario normal creado/actualizado:", usuario.id);


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
      const genero = await prisma.genero.upsert({
        where: { nombre: generoData.nombre },
        update: generoData,
        create: generoData,
      });
      generos[genero.nombre] = genero;
    }

    // Crear películas demo (asociando género principal)
    const peliculas = [
      {
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
      },
      {
        titulo: "Interestelar",
        sinopsis: "Un viaje a través del espacio para salvar a la humanidad.",
        descripcion: "Interestelar es una película de drama y ciencia ficción dirigida por Christopher Nolan.",
        director: "Christopher Nolan",
        generoId: generos["Drama"].id,
        duracion_minutos: 169,
        cantidad: 8,
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
        descripcion: "El Padrino es un clásico del cine de crimen y drama.",
        director: "Francis Ford Coppola",
        generoId: generos["Crimen"].id,
        duracion_minutos: 175,
        cantidad: 5,
        portada_url: "https://via.placeholder.com/200x300?text=El+Padrino",
        trailer_url: "https://youtube.com/watch?v=sY1S34973zA",
        fecha_estreno: new Date("1972-03-24"),
        precio_compra: 19.99,
        precio_alquiler: 4.99,
        estado: "DISPONIBLE",
      },
      {
        titulo: "Blancanieves 2025",
        sinopsis: "Una nueva adaptación del clásico cuento, más oscura y retorcida.",
        descripcion: "Blancanieves 2025 es una versión moderna y oscura del cuento clásico.",
        director: "Sofia Luna",
        generoId: generos["Fantasia"].id,
        duracion_minutos: 120,
        cantidad: 7,
        portada_url: "/portadas/blancanieves2025.jpg",
        trailer_url: "https://www.youtube.com/watch?v=abc123",
        fecha_estreno: new Date("2025-11-01"),
        precio_compra: 40,
        precio_alquiler: 6,
        estado: "DISPONIBLE"
      },
      {
        titulo: "Shrek 5",
        sinopsis: "El ogro favorito de todos regresa con nuevas locuras.",
        descripcion: "Shrek 5 es la nueva entrega animada y cómica de la saga.",
        director: "Walt Dohrn",
        generoId: generos["Animación"].id,
        duracion_minutos: 135,
        cantidad: 12,
        portada_url: "/portadas/sherk5.jpg",
        trailer_url: "https://www.youtube.com/watch?v=ghi012",
        fecha_estreno: new Date("2025-08-10"),
        precio_compra: 45.99,
        precio_alquiler: 6.99,
        estado: "DISPONIBLE",
      }
    ];

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