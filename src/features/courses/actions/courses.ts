'use server';

import { z } from 'zod';
import { courseSchema } from '../schemas/courses';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/services/clerk';
import {
  canCreateCourses,
  canDeleteCourses,
  canUpdateCourses,
} from '../permissions/courses';
import {
  insertCourse,
  deleteCourse as deleteCourseDB,
  updateCourse as updateCourseDB,
} from '../db/courses';

export async function createCourse(unsafeData: z.infer<typeof courseSchema>) {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success || !canCreateCourses(await getCurrentUser())) {
    return { error: true, message: 'There was an error creating your course' };
  }

  const course = await insertCourse(data);

  redirect(`/admin/courses/${course.id}/edit`);
}

export async function updateCourse(
  id: string,
  unsafeData: z.infer<typeof courseSchema>,
) {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success || !canUpdateCourses(await getCurrentUser())) {
    return { error: true, message: 'There was an error updating your course' };
  }

  await updateCourseDB(id, data);

  return { error: false, message: 'successfully updated your course' };
}

function wait(number: number) {
  return new Promise((res) => setTimeout(res, number));
}
export async function deleteCourse(id: string) {
  // await wait(2000);

  if (!canDeleteCourses(await getCurrentUser())) {
    return {
      error: true,
      message: 'There was an error while deleting your course',
    };
  }

  await deleteCourseDB(id);
  return { error: false, message: 'Succesfully deleted your course' };
}
