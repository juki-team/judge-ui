import { PagedDataViewer } from 'components';
import { JUDGE_API_V1, QueryParam } from 'config/constants';
import { useRouter } from 'hooks';
import { DataViewerHeadersType, GetUrl, SubmissionResponseDTO } from 'types';
import { toFilterUrl, toSortUrl } from '../../helpers';
import {
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionProblemColumn,
  submissionTimeUsed,
  submissionVerdict,
} from '../submissions';

const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = [
  submissionProblemColumn({ blankTarget: true }),
  submissionDateColumn(),
  submissionVerdict(false),
  submissionLanguage(),
  submissionTimeUsed(),
  submissionMemoryUsed(),
];

export function ProfileSubmissions() {
  
  const { query: { nickname } } = useRouter();
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => (
    JUDGE_API_V1.SUBMISSIONS.NICKNAME(nickname as string, page, pageSize, toFilterUrl(filter), toSortUrl(sort))
  );
  
  return (
    <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
      headers={columns}
      url={url}
      name={QueryParam.PROFILE_SUBMISSIONS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
}
