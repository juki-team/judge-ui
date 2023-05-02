import {
  Breadcrumbs,
  ButtonLoader,
  Field,
  PagedDataViewer,
  PlusIcon,
  T,
  TextHeadCell,
  TwoContentSection,
} from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { buttonLoaderLink, toFilterUrl, toSortUrl } from 'helpers';
import { useJukiUser, useRouter, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { CourseSummaryListResponseDTO, CourseTab, DataViewerHeadersType, LastLinkKey, QueryParam } from 'types';

function Problems() {
  
  useTrackLastPath(LastLinkKey.PROBLEMS);
  useTrackLastPath(LastLinkKey.SECTION_PROBLEM);
  const { user: { canCreateProblem } } = useJukiUser();
  const columns: DataViewerHeadersType<CourseSummaryListResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue tx-s">name</T>} />,
      index: 'name',
      field: ({ record: { key }, isCard }) => (
        <Field className="jk-row link fw-bd">
          <Link href={ROUTES.COURSES.VIEW(key, CourseTab.OVERVIEW)}>
            {key}
          </Link>
        </Field>
      ),
      sort: true,
      filter: { type: 'text' },
      cardPosition: 'top',
      minWidth: 120,
    },
    {
      head: <TextHeadCell text={<T className="tt-ue tx-s">abstract</T>} />,
      index: 'abstract',
      field: ({ record: { abstract }, isCard }) => (
        <Field className="jk-row link fw-bd">
          {abstract}
        </Field>
      ),
      filter: { type: 'text' },
      cardPosition: 'center',
      minWidth: 120,
    },
  ], [ canCreateProblem ]);
  
  const { push } = useRouter();
  
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <T className="tt-se">courses</T>,
  ];
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="pad-left-right pad-top-bottom">
          <h1><T>courses</T></h1>
        </div>
      </div>
      <div className="pad-top-bottom pad-left-right">
        <PagedDataViewer<CourseSummaryListResponseDTO, CourseSummaryListResponseDTO>
          headers={columns}
          getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
            JUDGE_API_V1.COURSE.LIST(page, pageSize, toFilterUrl(filter), toSortUrl(sort))
          )}
          name={QueryParam.COURSES_TABLE}
          extraNodes={[
            ...(canCreateProblem ? [
              <ButtonLoader
                size="small"
                icon={<PlusIcon />}
                responsiveMobile
                onClick={buttonLoaderLink(() => push(ROUTES.COURSES.CREATE()))}
              >
                <T>create</T>
              </ButtonLoader>,
            ] : []),
          ]}
          cards={{ height: 256 }}
        />
      </div>
    </TwoContentSection>
  );
}

export default Problems;
