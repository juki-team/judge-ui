import { jukiAppRoutes } from 'config';
import { redirect } from 'next/navigation';

export default async function Page() {
  redirect(jukiAppRoutes.JUDGE().contests.list());
}
