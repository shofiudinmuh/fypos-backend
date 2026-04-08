/*
  Warnings:

  - The primary key for the `product_ingredients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `product_ingredient_id` was added to the `product_ingredients` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "product_ingredients" DROP CONSTRAINT "product_ingredients_pkey",
ADD COLUMN     "product_ingredient_id" TEXT NOT NULL,
ADD CONSTRAINT "product_ingredients_pkey" PRIMARY KEY ("product_ingredient_id");

-- CreateTable
CREATE TABLE "ingredients" (
    "ingredient_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "outlet_id" TEXT NOT NULL,
    "ingredient_name" VARCHAR(100) NOT NULL,
    "unit" VARCHAR(10) NOT NULL,
    "minimum_stock" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("ingredient_id")
);

-- CreateIndex
CREATE INDEX "ingredients_tenant_id_outlet_id_idx" ON "ingredients"("tenant_id", "outlet_id");

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_ingredients" ADD CONSTRAINT "product_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("ingredient_id") ON DELETE RESTRICT ON UPDATE CASCADE;
