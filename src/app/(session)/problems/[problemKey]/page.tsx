import {
  AssignmentIcon,
  Button,
  LinkLastPath,
  PageNotFound,
  ProblemViewLayout,
  T,
  TwoContentLayout,
} from 'components';
import { jukiApiManager } from 'config';
import { DEFAULT_METADATA } from 'config/constants';
import { oneTab } from 'helpers';
import type { Metadata } from 'next';
import { ContentResponseType, LastPathKey, MetadataResponseDTO, ProblemDataResponseDTO } from 'types';
import { get } from '../../../../helpers/fetch';
import { ProblemTour } from './ProblemTour';

type Props = {
  params: Promise<{ problemKey: string }>
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  
  const problemKey = (await params).problemKey;
  
  let result;
  try {
    result = await get<ContentResponseType<MetadataResponseDTO>>(jukiApiManager.API_V2.problem.getMetadata({ params: { key: problemKey } }).url);
  } catch (error) {
    console.error('error on generateMetadata', error);
  }
  
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
  
  return (
    <TwoContentLayout
      // breadcrumbs={breadcrumbs}
      tabs={oneTab(
        <PageNotFound>
          <p>
            <T className="tt-se">the problem does not exist or you do not have permissions to view it</T>
          </p>
          <LinkLastPath lastPathKey={LastPathKey.PROBLEMS}>
            <Button icon={<AssignmentIcon />} type="light">
              <T className="tt-se">go to problem list</T>
            </Button>
          </LinkLastPath>
        </PageNotFound>,
      )}
    >
      <h2><T>problem not found</T></h2>
    </TwoContentLayout>
  );
};
