import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { CourseTable } from './course';
import { ProductTable } from './product';
import { createdAt, updatedAt } from '../schemaHelpers';
import { relations } from 'drizzle-orm';

export const CourseProductTable = pgTable(
  'course_products',
  {
    courseId: uuid()
      .notNull()
      .references(() => CourseTable.id, { onDelete: 'restrict' }),
    //restrict make sure that product cannot be deleted if product with course exist
    productId: uuid()
      .notNull()
      .references(() => ProductTable.id, { onDelete: 'cascade' }),
    //cascade make sure that if we delete product we also remove entry from this JOIN Table
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.courseId, t.productId] })],
  //we create primary key for entries in this table by combining 2 known IDs so we don't need to use uuid
);

export const CourseProductRelationships = relations(
  CourseProductTable,
  ({ one }) => ({
    course: one(CourseTable, {
      fields: [CourseProductTable.courseId],
      references: [CourseTable.id],
    }),
    product: one(ProductTable, {
      fields: [CourseProductTable.productId],
      references: [ProductTable.id],
    }),
  }),
);
