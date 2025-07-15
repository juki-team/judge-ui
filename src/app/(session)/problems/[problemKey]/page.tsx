import { jukiApiManager } from 'config';
import { cleanRequest, getMetaHeaders } from 'helpers';
import type { Metadata } from 'next';
import { ContentResponseType } from 'types';
import ProblemViewPage from './ProblemViewPage';

type Props = {
  params: Promise<{ problemKey: string }>
}

async function getMetadata(problemKey: string) {
  
  let result;
  try {
    const response = await fetch(
      jukiApiManager.API_V1.problem.getMetadata({ params: { key: problemKey } }).url,
      { headers: getMetaHeaders() });
    const text = await response.text();
    result = cleanRequest<ContentResponseType<{
      title: string,
      description: string,
      cover: string
    }>>(text);
  } catch (error) {
    console.error('error on generateMetadata', error);
  }
  
  const { title, description, cover } = result?.success ? result.content : { title: '', description: '', cover: '' };
  
  return { title, description, cover };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  
  const { title, description } = await getMetadata((await params).problemKey);
  
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
      //     width: 400,
      //     height: 210,
      //   },
      // ],
    },
  };
}

export default async function Page({ params }: Props) {
  
  const problemKey = (await params).problemKey;
  
  return <ProblemViewPage problemKey={problemKey} />;
}
