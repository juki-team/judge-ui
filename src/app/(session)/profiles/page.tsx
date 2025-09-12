import { jukiAppRoutes } from 'config';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<Record<string, string>>
}

export default async function ProfilesPage({ searchParams }: Props) {
  const query = new URLSearchParams(await searchParams).toString();
  redirect(`${jukiAppRoutes.JUDGE().home()}?${query}`);
}
