import { ButtonLoader, CheckIcon, Field, PlusIcon, Popover, T, TextField, TextHeadCell } from 'components';
import { ROUTES } from 'config/constants';
import { buttonLoaderLink } from 'helpers';
import { useRouter } from 'hooks';
import Link from 'next/link';
import { ContestSummaryListResponseDTO, ContestTab, DataViewerHeadersType, JkTableHeaderFilterType } from 'types';

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
  head: <TextHeadCell text={<T>contest name</T>} />,
  index: 'name',
  field: ({ record: { name, key, user } }) => (
    <Field className="jk-row">
      {user.isGuest || user.isAdmin || user.isContestant || user.isJudge || user.isSpectator ? (
        <Link href={ROUTES.CONTESTS.VIEW(key, ContestTab.OVERVIEW)}>
          <a>
            <div className="jk-row gap nowrap link text-semi-bold">
              {name}
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
          </a>
        </Link>
      ) : (
        <div className="jk-row gap text-semi-bold">
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
  head: <TextHeadCell text={<T>contestants</T>} />,
  index: 'totalContestants',
  field: ({ record: { totalContestants } }) => (
    <TextField text={totalContestants} label={<T>registered</T>} />
  ),
  sort: true,
  cardPosition: 'center',
  minWidth: 160,
});
