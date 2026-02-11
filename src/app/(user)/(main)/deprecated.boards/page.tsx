import { DEFAULT_METADATA } from 'config/constants';
import { getContestMetadata } from 'helpers';
import type { Metadata } from 'next';
import { BoardsPage } from './BoardsPage';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const dynamic = 'force-static';

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  
  const { tab } = await searchParams;
  
  if (!!tab) {
    
    const { title, description } = await getContestMetadata(tab as string);
    
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
  
  return DEFAULT_METADATA;
}

export default function Boards() {
  
  return <BoardsPage />;
}
