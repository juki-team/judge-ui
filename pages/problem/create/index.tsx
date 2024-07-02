import { EditCreateProblem } from 'components';
import { useJukiUser } from 'hooks';
import Custom404 from '../../404';

function ProblemCreate() {
  
  const { user: { permissions: { problem: { create } } } } = useJukiUser();
  
  if (!create) {
    return <Custom404 />;
  }
  
  return (
    <EditCreateProblem />
  );
}

export default ProblemCreate;
