import { useContext } from 'react';
import { TaskContext } from 'store';

export const useTask = () => {
  const { listenSubmission, submissions } = useContext(TaskContext);
  
  return {
    listenSubmission,
    submissions,
  };
};
