-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Carrito" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "pelicula_id" TEXT NOT NULL,
    "tipo" "TipoTransaccion" NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "fecha_agregado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Carrito_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_pelicula_id_fkey" FOREIGN KEY ("pelicula_id") REFERENCES "Pelicula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
