import { Judge, QueryParam } from 'types';
import { ProblemsPage } from './ProblemsPage';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>,
}

export default async function Page({ searchParams }: Props) {
  
  const contestsTab = (await searchParams)[QueryParam.JUDGE] as Judge;
  
  return <ProblemsPage judgeKey={contestsTab} />;
}
