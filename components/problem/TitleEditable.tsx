import { EditIcon, Input, SaveIcon } from 'components';
import { useState } from 'react';

export const TitleEditable = ({ value, onChange }) => {
  
  const [editable, setEditable] = useState(false);
  
  return (
    <div className="title-editable jk-row gap cr-py">
      {editable ? <Input value={value} onChange={onChange} /> : <h3>{value}</h3>}
      {editable ? <SaveIcon onClick={() => setEditable(false)} /> : <EditIcon onClick={() => setEditable(true)} />}
    </div>
  );
};
