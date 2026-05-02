import { ProblemNotFoundCard, ProblemTour, ProblemViewLayout } from 'components';
import { TwoContentLayout } from '@juki-team/base-ui';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { DEFAULT_METADATA } from 'config/constants';
import { get } from 'helpers';
import { oneTab } from '@juki-team/base-ui/helpers';
import { type  Metadata } from 'next';
import { type MetadataResponseDTO, type ProblemDataResponseDTO } from '@juki-team/commons/dto';
import { type ContentResponse } from '@juki-team/commons/types';

type Props = {
  params: Promise<{ problemKey: string }>
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const problemKey = (await params).problemKey;

  const result = await get<ContentResponse<MetadataResponseDTO>>(jukiApiManager.apiV2.problem.getMetadata({ params: { key: problemKey } }).url);

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

  const problemResponse = await get<ContentResponse<ProblemDataResponseDTO>>(jukiApiManager.apiV2.problem.getData({ params: { key: problemKey } }).url);

  if (problemResponse.success) {
    return (
      <ProblemTour>
        <ProblemViewLayout problem={problemResponse.content} />
      </ProblemTour>
    );
  }

  return <TwoContentLayout tabs={oneTab(<ProblemNotFoundCard />)} />;
};
