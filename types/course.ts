import { CreateCourseDTO } from 'types';

export enum CourseActivity {
  LECTURE = 'LECTURE',
  PROBLEM_TASK = 'PROBLEM_TASK',
  FORM_TASK = 'FORM_TASK',
}

export type CourseActivityType = {
  estimatedTime: number,
} & ({
  type: CourseActivity.LECTURE,
  contents: string[],
} | {})
export type EditCreateCourseType = CreateCourseDTO & {
  units: [
    {
      title: '',
      activities: [
        {
          content: string
          estimatedTime: number,
        }
      ],
    }
  ]
}
