import { jukiAppRoutes } from '@juki-team/base-ui/settings';
import { redirect } from 'next/navigation';
import { ContestsTab } from '@juki-team/base-ui/enums';

export default async function Page() {
  redirect(jukiAppRoutes.JUDGE().contests.list({ tab: ContestsTab.CLASSICS }));
}
