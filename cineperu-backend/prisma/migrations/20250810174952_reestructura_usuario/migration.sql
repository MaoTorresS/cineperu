-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'USUARIO');

-- CreateEnum
CREATE TYPE "EstadoAlquiler" AS ENUM ('PENDIENTE', 'FINALIZADO', 'CANCELADO', 'VENCIDO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'EXITOSO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoTransaccion" AS ENUM ('ALQUILER', 'COMPRA');

-- CreateEnum
CREATE TYPE "EstadoPelicula" AS ENUM ('DISPONIBLE', 'PROXIMAMENTE', 'AGOTADA', 'INACTIVA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "imagen_perfil" TEXT,
    "rol" "RolUsuario" NOT NULL DEFAULT 'USUARIO',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genero" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Genero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pelicula" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "sinopsis" TEXT NOT NULL,
    "descripcion" TEXT,
    "director" TEXT NOT NULL,
    "generoId" TEXT,
    "duracion_minutos" INTEGER NOT NULL,
    "cantidad" INTEGER,
    "portada_url" TEXT NOT NULL,
    "trailer_url" TEXT NOT NULL,
    "fecha_estreno" TIMESTAMP(3) NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "precio_compra" DECIMAL(65,30) NOT NULL,
    "precio_alquiler" DECIMAL(65,30) NOT NULL,
    "estado" "EstadoPelicula" NOT NULL DEFAULT 'DISPONIBLE',

    CONSTRAINT "Pelicula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alquiler" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "pelicula_id" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "dias_alquiler" INTEGER NOT NULL DEFAULT 7,
    "estado" "EstadoAlquiler" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "Alquiler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "pelicula_id" TEXT NOT NULL,
    "fecha_compra" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "monto" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaccion" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "pelicula_id" TEXT NOT NULL,
    "tipo" "TipoTransaccion" NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "estado_pago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_transaccion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Genero_nombre_key" ON "Genero"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Pelicula_titulo_key" ON "Pelicula"("titulo");

-- AddForeignKey
ALTER TABLE "Pelicula" ADD CONSTRAINT "Pelicula_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "Genero"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alquiler" ADD CONSTRAINT "Alquiler_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alquiler" ADD CONSTRAINT "Alquiler_pelicula_id_fkey" FOREIGN KEY ("pelicula_id") REFERENCES "Pelicula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_pelicula_id_fkey" FOREIGN KEY ("pelicula_id") REFERENCES "Pelicula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_pelicula_id_fkey" FOREIGN KEY ("pelicula_id") REFERENCES "Pelicula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
