import { EditCreateProblem } from 'components';
import React, { useState } from 'react';
import { useUserState } from 'store';
import Custom404 from '../../404';

function ProblemCreate() {
  
  const { canCreateProblem } = useUserState();
  
  if (!canCreateProblem) {
    return <Custom404 />;
  }
  
  return (
    <EditCreateProblem />
  );
}

export default ProblemCreate;
