import { jukiAppRoutes } from 'config';
import { redirect } from 'next/navigation';
import { ContestsTab } from 'types';

export default async function Page() {
  redirect(jukiAppRoutes.JUDGE().contests.list({ tab: ContestsTab.CLASSICS }));
}
