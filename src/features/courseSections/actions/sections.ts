'use server';

import { z } from 'zod';
import { sectionSchema } from '../schemas/sections';
import {
  canCreateCoursesSections,
  canDeleteCoursesSections,
  canUpdateCoursesSections,
} from '../permissions/sections';
import { getCurrentUser } from '@/services/clerk';
import {
  getNextCourseSectionOrder,
  insertSection,
  updateSection as updateSectionDB,
  deleteSection as deleteSectionDB,
  updateSectionOrders as updateSectionOrdersDB,
} from '../db/sections';

export async function createSection(
  courseId: string,
  unsafeData: z.infer<typeof sectionSchema>,
) {
  const { success, data } = sectionSchema.safeParse(unsafeData);

  if (!success || !canCreateCoursesSections(await getCurrentUser())) {
    return { error: true, message: 'There was an error creating your section' };
  }

  const order = await getNextCourseSectionOrder(courseId);

  await insertSection({ ...data, courseId, order });

  return { error: false, message: 'Succesfully created your section' };
}

export async function updateSection(
  id: string,
  unsafeData: z.infer<typeof sectionSchema>,
) {
  const { success, data } = sectionSchema.safeParse(unsafeData);

  if (!success || !canUpdateCoursesSections(await getCurrentUser())) {
    return { error: true, message: 'There was an error updating your section' };
  }

  await updateSectionDB(id, data);

  return { error: false, message: 'successfully updated your section' };
}

function wait(number: number) {
  return new Promise((res) => setTimeout(res, number));
}
export async function deleteSection(id: string) {
  // await wait(2000);

  if (!canDeleteCoursesSections(await getCurrentUser())) {
    return {
      error: true,
      message: 'There was an error while deleting your section',
    };
  }

  await deleteSectionDB(id);
  return { error: false, message: 'Succesfully deleted your section' };
}

export async function udpateSectionOrders(sectionIds: string[]) {
  if (
    sectionIds.length === 0 ||
    !canUpdateCoursesSections(await getCurrentUser())
  ) {
    return { error: true, message: 'Error reordering your sections' };
  }

  await updateSectionOrdersDB(sectionIds);

  return { error: false, message: 'Succesfully reordered your sections' };
}
