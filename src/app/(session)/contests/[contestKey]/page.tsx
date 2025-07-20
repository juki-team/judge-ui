import { getContestMetadata } from 'helpers';
import type { Metadata } from 'next';
import ContestViewPage from './ContestViewPage';

type Props = {
  params: Promise<{ contestKey: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  
  const { title, description } = await getContestMetadata((await params).contestKey);
  
  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      siteName: 'Juki Judge',
      url: 'https://judge.juki.app',
      // images: [
      //   {
      //     url: cover,
      //   },
      // ],
    },
  };
}

export default async function Page({ params }: Props) {
  
  const { contestKey } = await params;
  
  return <ContestViewPage contestKey={contestKey} />;
}
