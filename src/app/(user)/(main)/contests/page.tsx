import { ContestsTab } from '@juki-team/base-ui/enums';
import { ContestsPage } from './ContestsPage';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>,
}

export default async function Page({ searchParams }: Props) {
  
  const contestsTab = (await searchParams).tab as ContestsTab;
  
  return <ContestsPage tab={contestsTab} />;
}
