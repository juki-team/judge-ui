import { SheetPage, T } from 'components';
import React, { useState } from 'react';

function Sheets() {
  const [sheets, setSheets] = useState([]);
  return (
    <div className="jk-pad-md">
      <h1><T>create new sheet</T></h1>
      <SheetPage sheets={sheets} setSheets={setSheets} />
    </div>
  );
}

export default Sheets;
