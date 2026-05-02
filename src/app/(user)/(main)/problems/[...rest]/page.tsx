import { jukiAppRoutes } from '@juki-team/base-ui/settings';
import { redirect } from 'next/navigation';

export default async function Page() {
  redirect(jukiAppRoutes.JUDGE().problems.list());
}
