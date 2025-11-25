import { jukiApiManager } from 'config';
import { DEFAULT_METADATA } from 'config/constants';
import { cleanRequest, getMetaHeaders } from 'helpers';
import type { Metadata } from 'next';
import { ContentResponseType } from 'types';
import ProblemViewPage from './ProblemViewPage';

type Props = {
  params: Promise<{ problemKey: string }>
}

export const dynamic = 'force-static';

async function getMetadata(problemKey: string) {
  
  let result;
  try {
    const response = await fetch(
      jukiApiManager.API_V2.problem.getMetadata({ params: { key: problemKey } }).url,
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

export default async function Pageold({ params }: Props) {
  
  const problemKey = (await params).problemKey;
  
  return <ProblemViewPage problemKey={problemKey} />;
}
