import { getContestMetadata } from 'helpers';
import type { Metadata } from 'next';
import { BoardsPage } from './BoardsPage';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  
  const { title, description } = await getContestMetadata((await searchParams).tab as string);
  
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

export default function Boards() {
  
  return <BoardsPage />;
}
