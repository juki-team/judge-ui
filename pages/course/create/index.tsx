import { EditCreateCourse } from 'components';
import { useJukiBase } from 'hooks';
import React from 'react';
import Custom404 from '../../404';

function CourseCreate() {
  
  const { user: { canCreateContest } } = useJukiBase();
  
  if (!canCreateContest) {
    return <Custom404 />;
  }
  
  return (
    <EditCreateCourse />
  );
}

export default CourseCreate;
