import { EditCreateCourse } from 'components';
import { useJukiUser } from 'hooks';
import Custom404 from '../../404';

function CourseCreate() {
  
  const { user: { canCreateContest } } = useJukiUser();
  
  if (!canCreateContest) {
    return <Custom404 />;
  }
  
  return (
    <EditCreateCourse />
  );
}

export default CourseCreate;
