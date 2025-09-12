import { ProfileViewPage } from './ProfileViewPage';

type Props = {
  params: Promise<{ nickname: string }>
}

export default async function Page({ params }: Props) {
  
  const { nickname } = await params;
  
  return <ProfileViewPage nickname={nickname} />;
}
