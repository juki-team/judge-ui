import { jukiAppRoutes } from 'config';
import { redirect } from 'next/navigation';

export default async function ProfilesPage() {
  redirect(jukiAppRoutes.JUDGE().home());
}
