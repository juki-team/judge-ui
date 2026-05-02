import { jukiAppRoutes } from '@juki-team/base-ui/settings';
import { redirect } from 'next/navigation';

export default async function ProfilesPage() {
  redirect(jukiAppRoutes.JUDGE().home());
}
