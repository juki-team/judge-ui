import {
  Breadcrumbs,
  ButtonLoader,
  Field,
  HomeLink,
  PagedDataViewer,
  PlusIcon,
  T,
  TextHeadCell,
  TwoContentSection,
} from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { buttonLoaderLink, toFilterUrl, toSortUrl } from 'helpers';
import { useJukiRouter, useJukiUI, useJukiUser, useMemo, useTrackLastPath } from 'hooks';
import { CourseSummaryListResponseDTO, CourseTab, DataViewerHeadersType, LastPathKey, QueryParam } from 'types';

function Courses() {
  
  useTrackLastPath(LastPathKey.PROBLEMS);
  useTrackLastPath(LastPathKey.SECTION_PROBLEM);
  const { user: { canCreateProblem } } = useJukiUser();
  const { components: { Link } } = useJukiUI();
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
  ], [ Link ]);
  
  const { pushRoute } = useJukiRouter();
  
  const breadcrumbs = [
    <HomeLink key="home" />,
    <T className="tt-se" key="courses">courses</T>,
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
                onClick={buttonLoaderLink(() => pushRoute(ROUTES.COURSES.CREATE()))}
                key="create"
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

export default Courses;
