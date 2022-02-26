import { useRouter } from 'next/router';

function ProblemCreate() {
  
  const router = useRouter();
  
  console.log(router);
  
  return (
    <div>
      ProblemCreate
    </div>
  );
}

export default ProblemCreate;
