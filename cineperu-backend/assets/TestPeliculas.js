// Test Peliculas: POST masivo de 20 películas taquilleras (2020-2025)
// Puedes ejecutar este script con Node.js para poblar tu backend
// Asegúrate de tener axios instalado: npm install axios


const axios = require('axios');
// Pega aquí tu token JWT de administrador:
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcwZTkwMTIyLThkYTAtNDA1ZC05ZGVkLTZiMTA4MTk3NmJiYiIsInJvbCI6IkFETUlOIiwiaWF0IjoxNzU0OTM5MTYyLCJleHAiOjE3NTUwMjU1NjJ9.0_SYB_iPzcszvvqPMaQuQER5ySkhzM23KJywJMTw6T4';

const peliculas = [
  {
    titulo: "Spider-Man: No Way Home",
    sinopsis: "Peter Parker busca ayuda para restaurar su identidad secreta, pero el multiverso se desata.",
    descripcion: "Peter Parker se enfrenta a villanos de otros universos tras un hechizo fallido del Doctor Strange.",
    director: "Jon Watts",
    genero: { connect: { nombre: "Acción" } },
    duracion_minutos: 148,
    cantidad: 20,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/spiderman_no_way_home.jpg",
    trailer_url: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
    fecha_estreno: "2021-12-17",
    precio_compra: 39.90,
    precio_alquiler: 12.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Avatar: The Way of Water",
    sinopsis: "Jake Sully y Neytiri exploran nuevas regiones de Pandora.",
    descripcion: "Secuela de Avatar, la familia Sully enfrenta nuevas amenazas en los océanos de Pandora.",
    director: "James Cameron",
    genero: { connect: { nombre: "Ciencia Ficción" } },
    duracion_minutos: 192,
    cantidad: 15,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/avatar_way_of_water.jpg",
    trailer_url: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    fecha_estreno: "2022-12-16",
    precio_compra: 44.90,
    precio_alquiler: 14.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Top Gun: Maverick",
    sinopsis: "Pete 'Maverick' Mitchell regresa como instructor de vuelo.",
    descripcion: "Maverick debe entrenar a una nueva generación de pilotos para una misión peligrosa.",
    director: "Joseph Kosinski",
    genero: { connect: { nombre: "Acción" } },
    duracion_minutos: 131,
    cantidad: 12,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/top_gun_maverick.jpg",
    trailer_url: "https://www.youtube.com/watch?v=giXco2jaZ_4",
    fecha_estreno: "2022-05-27",
    precio_compra: 36.90,
    precio_alquiler: 11.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Fast & Furious 9",
    sinopsis: "Dom Toretto enfrenta a su hermano perdido y una amenaza global.",
    descripcion: "La familia Fast se reúne para detener un complot mundial y enfrentarse a viejos enemigos.",
    director: "Justin Lin",
    genero: { connect: { nombre: "Acción" } },
    duracion_minutos: 143,
    cantidad: 18,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/fast9.jpg",
    trailer_url: "https://www.youtube.com/watch?v=aSiDu3Ywi8E",
    fecha_estreno: "2021-06-25",
    precio_compra: 34.90,
    precio_alquiler: 10.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Black Panther: Wakanda Forever",
    sinopsis: "Wakanda lucha por protegerse tras la muerte de su rey.",
    descripcion: "Nuevas amenazas surgen mientras Wakanda busca un nuevo líder tras la muerte de T'Challa.",
    director: "Ryan Coogler",
    genero: { connect: { nombre: "Acción" } },
    duracion_minutos: 161,
    cantidad: 14,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/black_panther_wakanda_forever.jpg",
    trailer_url: "https://www.youtube.com/watch?v=_Z3QKkl1WyM",
    fecha_estreno: "2022-11-11",
    precio_compra: 38.90,
    precio_alquiler: 12.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Doctor Strange in the Multiverse of Madness",
    sinopsis: "El Doctor Strange explora el multiverso con Wanda Maximoff.",
    descripcion: "Strange y Wanda enfrentan realidades alternativas y amenazas mágicas.",
    director: "Sam Raimi",
    genero: { connect: { nombre: "Ciencia Ficción" } },
    duracion_minutos: 126,
    cantidad: 13,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/doctor_strange_multiverse.jpg",
    trailer_url: "https://www.youtube.com/watch?v=aWzlQ2N6qqg",
    fecha_estreno: "2022-05-06",
    precio_compra: 37.90,
    precio_alquiler: 11.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "The Batman",
    sinopsis: "Bruce Wayne enfrenta a El Acertijo en Gotham.",
    descripcion: "Batman investiga una serie de asesinatos y corrupción en Gotham City.",
    director: "Matt Reeves",
    genero: { connect: { nombre: "Crimen" } },
    duracion_minutos: 176,
    cantidad: 16,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/the_batman.jpg",
    trailer_url: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    fecha_estreno: "2022-03-04",
    precio_compra: 40.90,
    precio_alquiler: 13.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Minions: The Rise of Gru",
    sinopsis: "Gru y los Minions enfrentan a los Vicious 6.",
    descripcion: "La historia de cómo Gru se convierte en el villano favorito del mundo.",
    director: "Kyle Balda",
    genero: { connect: { nombre: "Animación" } },
    duracion_minutos: 87,
    cantidad: 20,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/minions_rise_of_gru.jpg",
    trailer_url: "https://www.youtube.com/watch?v=6DxjJzmYsXo",
    fecha_estreno: "2022-07-01",
    precio_compra: 32.90,
    precio_alquiler: 9.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "No Time to Die",
    sinopsis: "James Bond sale del retiro para enfrentar a un nuevo villano.",
    descripcion: "Bond debe rescatar a un científico secuestrado y enfrentar a Safin, un villano con tecnología peligrosa.",
    director: "Cary Joji Fukunaga",
    genero: { connect: { nombre: "Acción" } },
    duracion_minutos: 163,
    cantidad: 10,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/no_time_to_die.jpg",
    trailer_url: "https://www.youtube.com/watch?v=BIhNsAtPbPI",
    fecha_estreno: "2021-10-08",
    precio_compra: 36.90,
    precio_alquiler: 11.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Dune",
    sinopsis: "Paul Atreides lidera la lucha por el control de Arrakis.",
    descripcion: "Adaptación de la novela de Frank Herbert sobre poder, traición y destino en un planeta desértico.",
    director: "Denis Villeneuve",
    genero: { connect: { nombre: "Ciencia Ficción" } },
    duracion_minutos: 155,
    cantidad: 12,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/dune.jpg",
    trailer_url: "https://www.youtube.com/watch?v=n9xhJrPXop4",
    fecha_estreno: "2021-10-22",
    precio_compra: 39.90,
    precio_alquiler: 12.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Oppenheimer",
    sinopsis: "La vida de J. Robert Oppenheimer y el desarrollo de la bomba atómica.",
    descripcion: "Biopic sobre el físico Oppenheimer y su papel en el Proyecto Manhattan.",
    director: "Christopher Nolan",
    genero: { connect: { nombre: "Drama" } },
    duracion_minutos: 180,
    cantidad: 10,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/oppenheimer.jpg",
    trailer_url: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    fecha_estreno: "2023-07-21",
    precio_compra: 45.90,
    precio_alquiler: 15.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Barbie",
    sinopsis: "Barbie y Ken exploran el mundo real y descubren su verdadera identidad.",
    descripcion: "Una aventura cómica y colorida sobre el autodescubrimiento.",
    director: "Greta Gerwig",
    genero: { connect: { nombre: "Comedia" } },
    duracion_minutos: 114,
    cantidad: 15,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/barbie.jpg",
    trailer_url: "https://www.youtube.com/watch?v=pBk4NYhWNMM",
    fecha_estreno: "2023-07-21",
    precio_compra: 39.90,
    precio_alquiler: 13.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Guardians of the Galaxy Vol. 3",
    sinopsis: "Los Guardianes enfrentan nuevas amenazas y buscan salvar a uno de los suyos.",
    descripcion: "La última aventura de los Guardianes en el MCU.",
    director: "James Gunn",
    genero: { connect: { nombre: "Ciencia Ficción" } },
    duracion_minutos: 150,
    cantidad: 12,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/guardians3.jpg",
    trailer_url: "https://www.youtube.com/watch?v=u3V5KDHRQvk",
    fecha_estreno: "2023-05-05",
    precio_compra: 41.90,
    precio_alquiler: 13.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "The Super Mario Bros. Movie",
    sinopsis: "Mario y Luigi deben salvar el Reino Champiñón.",
    descripcion: "Aventura animada basada en el famoso videojuego de Nintendo.",
    director: "Aaron Horvath, Michael Jelenic",
    genero: { connect: { nombre: "Animación" } },
    duracion_minutos: 92,
    cantidad: 18,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/super_mario_bros.jpg",
    trailer_url: "https://www.youtube.com/watch?v=TnGl01FkMMo",
    fecha_estreno: "2023-04-05",
    precio_compra: 35.90,
    precio_alquiler: 11.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Mission: Impossible – Dead Reckoning Part One",
    sinopsis: "Ethan Hunt y su equipo enfrentan una nueva amenaza global.",
    descripcion: "La séptima entrega de la saga de acción protagonizada por Tom Cruise.",
    director: "Christopher McQuarrie",
    genero: { connect: { nombre: "Acción" } },
    duracion_minutos: 163,
    cantidad: 14,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/mi_dead_reckoning.jpg",
    trailer_url: "https://www.youtube.com/watch?v=avz06PDqDbM",
    fecha_estreno: "2023-07-12",
    precio_compra: 43.90,
    precio_alquiler: 14.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "John Wick: Chapter 4",
    sinopsis: "John Wick lucha por su libertad enfrentando a la Alta Mesa.",
    descripcion: "Acción intensa y coreografías espectaculares en la cuarta entrega de la saga.",
    director: "Chad Stahelski",
    genero: { connect: { nombre: "Acción" } },
    duracion_minutos: 169,
    cantidad: 13,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/john_wick4.jpg",
    trailer_url: "https://www.youtube.com/watch?v=qEVUtrk8_B4",
    fecha_estreno: "2023-03-24",
    precio_compra: 42.90,
    precio_alquiler: 14.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Godzilla vs. Kong",
    sinopsis: "Dos titanes se enfrentan en una batalla épica por la supremacía.",
    descripcion: "Godzilla y Kong luchan mientras la humanidad busca sobrevivir.",
    director: "Adam Wingard",
    genero: { connect: { nombre: "Ciencia Ficción" } },
    duracion_minutos: 113,
    cantidad: 16,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/godzilla_vs_kong.jpg",
    trailer_url: "https://www.youtube.com/watch?v=odM92ap8_c0",
    fecha_estreno: "2021-03-31",
    precio_compra: 36.90,
    precio_alquiler: 12.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Jungle Cruise",
    sinopsis: "Una expedición por el Amazonas en busca de un árbol legendario.",
    descripcion: "Aventura inspirada en la atracción de Disney, protagonizada por Dwayne Johnson y Emily Blunt.",
    director: "Jaume Collet-Serra",
    genero: { connect: { nombre: "Aventura" } },
    duracion_minutos: 127,
    cantidad: 12,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/jungle_cruise.jpg",
    trailer_url: "https://www.youtube.com/watch?v=f_HvoipFcA8",
    fecha_estreno: "2021-07-30",
    precio_compra: 34.90,
    precio_alquiler: 11.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "Frozen II",
    sinopsis: "Elsa y Anna viajan más allá de Arendelle para descubrir el origen de los poderes de Elsa.",
    descripcion: "Secuela animada de Frozen, con nuevas canciones y aventuras.",
    director: "Chris Buck, Jennifer Lee",
    genero: { connect: { nombre: "Animación" } },
    duracion_minutos: 103,
    cantidad: 17,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/frozen2.jpg",
    trailer_url: "https://www.youtube.com/watch?v=bwzLiQZDw2I",
    fecha_estreno: "2019-11-22",
    precio_compra: 33.90,
    precio_alquiler: 10.90,
    estado: "DISPONIBLE"
  },
  {
    titulo: "The Marvels",
    sinopsis: "Carol Danvers, Kamala Khan y Monica Rambeau unen fuerzas para salvar el universo.",
    descripcion: "Aventura cósmica del MCU con tres heroínas principales.",
    director: "Nia DaCosta",
    genero: { connect: { nombre: "Ciencia Ficción" } },
    duracion_minutos: 105,
    cantidad: 11,
    portada_url: "https://res.cloudinary.com/demo/image/upload/v1700000000/the_marvels.jpg",
    trailer_url: "https://www.youtube.com/watch?v=wS_qbDztgVY",
    fecha_estreno: "2023-11-10",
    precio_compra: 38.90,
    precio_alquiler: 12.90,
    estado: "DISPONIBLE"
  }
];

const API_URL = 'https://cineperu-backend.onrender.com/api/peliculas'; // Cambia por tu endpoint si es necesario

(async () => {
  for (const pelicula of peliculas) {
    try {
      const res = await axios.post(API_URL, pelicula, {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      });
      console.log(`✅ Película creada: ${pelicula.titulo}`);
    } catch (err) {
      console.error(`❌ Error al crear ${pelicula.titulo}:`, err.response?.data || err.message);
    }
  }
})();
