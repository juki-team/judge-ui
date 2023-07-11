import { EditCreateContest } from 'components';
import { useJukiUser } from 'hooks';
import Custom404 from '../../404';

function ContestCreate() {
  
  const { user: { canCreateContest } } = useJukiUser();
  
  if (!canCreateContest) {
    return <Custom404 />;
  }
  
  return (
    <EditCreateContest />
  );
}

export default ContestCreate;
