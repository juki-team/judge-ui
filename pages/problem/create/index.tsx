import { EditCreateProblem } from 'components';
import { useJukiUser } from 'hooks';
import React from 'react';
import Custom404 from '../../404';

function ProblemCreate() {
  
  const { user: { canCreateProblem } } = useJukiUser();
  
  if (!canCreateProblem) {
    return <Custom404 />;
  }
  
  return (
    <EditCreateProblem />
  );
}

export default ProblemCreate;
