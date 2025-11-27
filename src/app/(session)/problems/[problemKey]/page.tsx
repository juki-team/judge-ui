import { ProblemNotFoundCard, ProblemTour, ProblemViewLayout, TwoContentLayout } from 'components';
import { jukiApiManager } from 'config';
import { DEFAULT_METADATA } from 'config/constants';
import { get, oneTab } from 'helpers';
import type { Metadata } from 'next';
import { ContentResponseType, MetadataResponseDTO, ProblemDataResponseDTO } from 'types';

type Props = {
  params: Promise<{ problemKey: string }>
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  
  const problemKey = (await params).problemKey;
  
  const result = await get<ContentResponseType<MetadataResponseDTO>>(jukiApiManager.API_V2.problem.getMetadata({ params: { key: problemKey } }).url);
  
  const { title, description } = result?.success ? result.content : { title: '', description: '' };
  
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

export default async function ProblemViewPage({ params }: Props) {
  
  const problemKey = (await params).problemKey;
  
  const problemResponse = await get<ContentResponseType<ProblemDataResponseDTO>>(jukiApiManager.API_V2.problem.getData({ params: { key: problemKey as string } }).url);
  
  if (problemResponse.success) {
    return (
      <ProblemTour>
        <ProblemViewLayout problem={problemResponse.content} />
      </ProblemTour>
    );
  }
  
  return <TwoContentLayout tabs={oneTab(<ProblemNotFoundCard />)} />;
};
