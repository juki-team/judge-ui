import { ECSTaskDefinitionsManagement } from './ECSTaskDefinitionsManagement';
import { ECSTasksManagement } from './ECSTasksManagement';

export const ECSManagement = () => {
  return (
    <div className="jk-row" style={{ height: '100%', width: '100%' }}>
      <div style={{ height: '100%', width: '50%' }}>
        <ECSTasksManagement />
      </div>
      <div style={{ height: '100%', width: '50%' }}>
        <ECSTaskDefinitionsManagement />
      </div>
    </div>
  );
};
