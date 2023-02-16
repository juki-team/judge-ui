import { CourseType, CreateCourseDTO } from 'types';

export const COURSE_DEFAULT = (): CreateCourseDTO => {
  return {
    key: '',
    title: '',
    abstract: '',
    description: '',
    coverImageUrl: 'https://images.juki.pub/c/juki-hello-1-image.svg',
    type: CourseType.PUBLIC,
  };
};
