import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { revalidateProductCache } from './cache';
import { ProductTable } from '@/drizzle/schema';

export async function insertProduct() {}
export async function updateProduct() {}
export async function deleteProduct(id: string) {
  const [deletedProduct] = await db
    .delete(ProductTable)
    .where(eq(ProductTable.id, id))
    .returning();
  if (deletedProduct == null) throw new Error('Failed to delete product');

  revalidateProductCache(deletedProduct.id);

  return deletedProduct;
}
