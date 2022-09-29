import { EditCreateContest } from 'components';
import React from 'react';
import { useUserState } from 'store';
import Custom404 from '../../404';

function ContestCreate() {
  
  const { canCreateContest } = useUserState();
  
  if (!canCreateContest) {
    return <Custom404 />;
  }
  
  return (
    <EditCreateContest />
  );
}

export default ContestCreate;
