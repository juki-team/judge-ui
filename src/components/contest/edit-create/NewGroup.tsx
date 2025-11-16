'use client';

import { Button, Input, InputColor, Modal, T } from 'components';
import { useStableState } from 'hooks';
import { BasicModalProps, UpsertContestDTOUI } from 'types';

type GroupType = UpsertContestDTOUI['groups'][string];

interface EditGroupProps extends BasicModalProps {
  group: GroupType,
  onSave: (group: GroupType) => void,
}

export const NewGroup = ({ group, onSave, isOpen, onClose }: EditGroupProps) => {
  
  const [ newGroup, setNewGroup ] = useStableState<UpsertContestDTOUI['groups'][string]>(group);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="jk-pg jk-col gap stretch">
        <h3><T className="tt-se">{group.value ? 'edit group' : 'new group'}</T></h3>
        <Input
          expand
          label={<T className="tt-se">label</T>}
          value={newGroup.label}
          onChange={label => setNewGroup(prevState => ({ ...prevState, label }))}
        />
        <InputColor
          expand
          label={<T className="tt-se">color</T>}
          value={newGroup.color}
          onChange={color => setNewGroup(prevState => ({ ...prevState, color: color.hex }))}
        />
        <div className="jk-row gap right">
          <Button type="light" onClick={() => onClose()}><T className="tt-se">cancel</T></Button>
          <Button onClick={() => onSave(newGroup)}><T className="tt-se">save</T></Button>
        </div>
      </div>
    </Modal>
  );
};
