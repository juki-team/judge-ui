import { DEFAULT_METADATA } from 'config/constants';
import { getContestMetadata } from 'helpers';
import type { Metadata } from 'next';
import ContestViewPage from './ContestViewPage';

type Props = {
  params: Promise<{ contestKey: string }>
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  
  const { title, description } = await getContestMetadata((await params).contestKey);
  
  return {
    ...DEFAULT_METADATA,
    title,
    description,
    openGraph: {
      ...DEFAULT_METADATA.openGraph,
      title,
      description,
      // images: [
      //   {
      //     url: cover,
      //     width: 400,
      //     height: 210,
      //   },
      // ],
    },
    twitter: {
      ...DEFAULT_METADATA.twitter,
      title,
      description,
    },
  };
}

export default async function Page({ params }: Props) {
  
  const { contestKey } = await params;
  
  return <ContestViewPage contestKey={contestKey} />;
}
