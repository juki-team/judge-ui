import { EditCreateSheet } from 'components';
import { useJukiBase } from 'hooks';
import React from 'react';
import Custom404 from '../../404';

function SheetCreate() {
  
  const { user: { canCreatePublicSheet, canCreatePrivateSheet } } = useJukiBase();
  
  if (!canCreatePublicSheet && !canCreatePrivateSheet) {
    return <Custom404 />;
  }
  
  return (
    <EditCreateSheet />
  );
}

export default SheetCreate;
