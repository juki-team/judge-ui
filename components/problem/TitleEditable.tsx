import { EditIcon, Input, SaveIcon } from 'components';
import { useState } from 'react';

export const TitleEditable = ({ value, onChange }) => {
  
  const [editable, setEditable] = useState(false);
  
  return (
    <div className="title-editable jk-row gap color-primary">
      {editable ? <Input value={value} onChange={onChange} /> : <h5>{value}</h5>}
      {editable ? <SaveIcon onClick={() => setEditable(false)} /> : <EditIcon onClick={() => setEditable(true)} />}
    </div>
  );
};