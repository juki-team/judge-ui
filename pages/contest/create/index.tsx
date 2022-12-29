import { EditCreateContest } from 'components';
import { useJukiBase } from 'hooks';
import React from 'react';
import Custom404 from '../../404';

function ContestCreate() {
  
  const { user: { canCreateContest } } = useJukiBase();
  
  if (!canCreateContest) {
    return <Custom404 />;
  }
  
  return (
    <EditCreateContest />
  );
}

export default ContestCreate;
