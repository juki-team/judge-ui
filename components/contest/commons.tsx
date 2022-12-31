import { ButtonLoader, CheckIcon, Field, PlusIcon, Popover, T, TextField, TextHeadCell } from 'components';
import { ROUTES } from 'config/constants';
import { buttonLoaderLink } from 'helpers';
import { useLasLink, useRouter } from 'hooks';
import Link from 'next/link';
import { ContestSummaryListResponseDTO, ContestTab, DataViewerHeadersType, JkTableHeaderFilterType, LastLinkKey } from 'types';

export const CreateContestButton = () => {
  const { push } = useRouter();
  return (
    <ButtonLoader
      size="small"
      icon={<PlusIcon />}
      onClick={buttonLoaderLink(() => push(ROUTES.CONTESTS.CREATE()))}
    >
      <T>create</T>
    </ButtonLoader>
  );
};

export const contestNameColumn = (auto: boolean): DataViewerHeadersType<ContestSummaryListResponseDTO> => ({
  head: <TextHeadCell text={<T className="tt-ue tx-s">contest name</T>} className="left" />,
  index: 'name',
  field: ({ record: { name, key, user }, isCard }) => (
    <Field className="jk-row left block">
      {user.isGuest || user.isAdmin || user.isContestant || user.isJudge || user.isSpectator ? (
        <Link href={ROUTES.CONTESTS.VIEW(key, ContestTab.OVERVIEW)}>
          <div className="jk-row gap nowrap link fw-bd space-between">
            <div style={{ textAlign: isCard ? undefined : 'left' }}>{name}</div>
            {user.isAdmin ? (
              <Popover
                content={<T className="tt-se ws-np">you are admin</T>}
                placement="top"
                showPopperArrow
              >
                <div className="jk-tag tx-s fw-bd letter-tag">A</div>
              </Popover>
            ) : user.isJudge ? (
              <Popover
                content={<T className="tt-se ws-np">you are judge</T>}
                placement="top"
                showPopperArrow
              >
                <div className="jk-tag tx-s fw-bd letter-tag">J</div>
              </Popover>
            ) : user.isContestant ? (
              <Popover
                content={<T className="tt-se ws-np">registered</T>}
                placement="top"
                showPopperArrow
              >
                <div><CheckIcon filledCircle className="cr-ss" /></div>
              </Popover>
            ) : user.isGuest ? (
              <Popover
                content={<T className="tt-se ws-np">you are guest</T>}
                placement="top"
                showPopperArrow
              >
                <div className="jk-tag tx-s fw-bd letter-tag">G</div>
              </Popover>
            ) : user.isSpectator && (
              <Popover
                content={<T className="tt-se ws-np">you are spectator</T>}
                placement="top"
                showPopperArrow
              >
                <div className="jk-tag tx-s fw-bd letter-tag">S</div>
              </Popover>
            )}
          </div>
        </Link>
      ) : (
        <div className="jk-row gap left">
          {name}
        </div>
      )}
    </Field>
  ),
  sort: auto ? { compareFn: () => (rowA, rowB) => rowB.name.localeCompare(rowA.name) } : true,
  filter: { type: auto ? 'text-auto' : 'text' } as JkTableHeaderFilterType<ContestSummaryListResponseDTO>,
  cardPosition: 'center',
  minWidth: 320,
});

export const contestantsColumn = (): DataViewerHeadersType<ContestSummaryListResponseDTO> => ({
  head: <TextHeadCell text={<T className="tt-ue tx-s">contestants</T>} />,
  index: 'totalContestants',
  field: ({ record: { totalContestants } }) => (
    <TextField text={totalContestants} label={<T className="tt-ue">contestants</T>} />
  ),
  sort: true,
  cardPosition: 'bottom',
  minWidth: 160,
});

export const LinkContests = ({ children }) => {
  const { lastLink } = useLasLink();
  return (
    <Link
      href={{ pathname: lastLink[LastLinkKey.CONTESTS].pathname, query: lastLink[LastLinkKey.CONTESTS].query }}
      className="link"
    >
      {children}
    </Link>
  );
};

export const LinkSectionContest = ({ children }) => {
  const { lastLink } = useLasLink();
  return (
    <Link
      href={{ pathname: lastLink[LastLinkKey.SECTION_CONTEST].pathname, query: lastLink[LastLinkKey.SECTION_CONTEST].query }}
      className="link"
    >
      {children}
    </Link>
  );
};
