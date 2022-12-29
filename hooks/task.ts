import { useContext } from 'react';
import { TaskContext } from 'store';

export const useTaskDispatch = () => {
  const { listenSubmission } = useContext(TaskContext);
  
  return {
    listenSubmission,
  };
};
