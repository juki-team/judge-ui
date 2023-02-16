import { useFetcher } from '@juki-team/base-ui';
import {
  Button,
  ButtonLoader,
  ClockIcon,
  EditIcon,
  Input,
  InputToggle,
  MdMathEditor,
  MdMathViewer,
  Modal,
  NotificationsActiveIcon,
  Popover,
  QuestionAnswerIcon,
  Select,
  T,
  UserNicknameLink,
} from 'components';
import { JUDGE, JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, classNames, cleanRequest, getProblemJudgeKey, notifyResponse } from 'helpers';
import { useDateFormat, useNotification, useRouter } from 'hooks';
import React, { useState } from 'react';
import { ContentResponseType, ContestResponseDTO, HTTPMethod, Status } from 'types';

export const ViewClarifications = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { query } = useRouter();
  const { dtf } = useDateFormat();
  const { isAdmin, isContestant, isJudge } = contest.user;
  const [clarification, setClarification] = useState<null | {
    clarificationId: string,
    problemJudgeKey: string,
    question: string,
    answer: string,
    public: boolean,
  }>(null);
  const { addNotification } = useNotification();
  const { mutate } = useFetcher(JUDGE_API_V1.CONTEST.CONTEST_DATA(query.key as string));
  const isJudgeOrAdmin = isJudge || isAdmin;
  
  return (
    <div className="jk-col top jk-pad-md nowrap pad-left-right pad-top-bottom">
      <div className="jk-row">
        {(isJudgeOrAdmin || isContestant) && (
          isJudgeOrAdmin ? (
            <Button
              icon={<NotificationsActiveIcon />}
              size="small"
              onClick={() => setClarification({
                clarificationId: '',
                problemJudgeKey: '',
                question: '',
                answer: '',
                public: true,
              })}
            >
              <T className="tt-se fw-bd">send clarification</T>
            </Button>
          ) : isContestant && (
            <Button
              icon={<NotificationsActiveIcon />}
              size="small"
              onClick={() => setClarification({
                clarificationId: '',
                problemJudgeKey: '',
                question: '',
                answer: '',
                public: false,
              })}
            >
              <T className="tt-se fw-bd">ask question</T>
            </Button>
          )
        )}
      </div>
      <div className="jk-pad-md jk-col stretch gap">
        {contest?.clarifications
          ?.sort((c1, c2) => {
            if (c2?.answerTimestamp === c1?.answerTimestamp) {
              return 0;
            }
            if (!c1?.answerTimestamp) {
              return -1;
            }
            if (!c2?.answerTimestamp) {
              return 1;
            }
            return c2?.answerTimestamp - c1?.answerTimestamp;
          })
          ?.filter(clarification => isJudgeOrAdmin ? true : !!contest?.problems?.[clarification.problemJudgeKey]?.index)
          ?.map(clarification => {
            return (
              <div className="elevation-1 jk-pad-md jk-border-radius-inline pn-re" key={clarification.key}>
                {isJudgeOrAdmin && (
                  <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    <Button
                      size="small"
                      style={{ borderTopLeftRadius: 0, borderBottomRightRadius: 0 }}
                      onClick={() => {
                        setClarification({
                          clarificationId: clarification.key,
                          problemJudgeKey: clarification.problemJudgeKey,
                          question: clarification.question,
                          answer: clarification.answer,
                          public: clarification.public,
                        });
                      }}
                      icon={!!clarification.answerTimestamp ? <EditIcon /> : <QuestionAnswerIcon />}
                    >
                      {!!clarification.answerTimestamp ? <T>edit</T> : <T>to-answer</T>}
                    </Button>
                  </div>
                )}
                <div className="jk-row left gap">
                  <div className="tx-h fw-bd cr-py">{clarification.question}</div>
                  <div className="jk-row gap">
                    <Popover
                      content={<div className="ws-np">{dtf(clarification.questionTimestamp)}</div>}
                      triggerOn="hover"
                    >
                      <div className="jk-row"><ClockIcon className="cr-py" size="small" /></div>
                    </Popover>
                    <Popover
                      content={<UserNicknameLink nickname={clarification.questionUserNickname}>
                        <div className="link tx-s ws-np">{clarification.questionUserNickname}</div>
                      </UserNicknameLink>}
                      triggerOn="hover"
                    >
                      <div className="jk-row">
                        <UserNicknameLink nickname={clarification.questionUserNickname}>
                          <img
                            src={clarification.questionUserImageUrl}
                            className="jk-user-profile-img elevation-1"
                            alt={clarification.questionUserNickname}
                          />
                        </UserNicknameLink>
                      </div>
                    </Popover>
                  </div>
                  <div className="jk-row nowrap gap">
                    <div className="jk-tag primary-light">
                      {!clarification.problemJudgeKey
                        ? <T className="tt-se">general</T>
                        : <div>
                          <T className="tt-se">problem</T>&nbsp;
                          <span className="fw-bd">
                            {contest?.problems?.[clarification.problemJudgeKey]?.index || <><T>problem
                              deleted</T> ({clarification.problemJudgeKey})</>}
                          </span>
                        </div>}
                    </div>
                    <div className="jk-tag gray-6">
                      {clarification.public ? <T>public</T> : isJudgeOrAdmin ? <T>only for the user</T> :
                        <T>only for you</T>}</div>
                    {!clarification.answerTimestamp && <div className="jk-tag error"><T>not answered yet</T></div>}
                  </div>
                </div>
                {!!clarification.answerTimestamp && (
                  <div className="jk-row gap left top stretch nowrap">
                    <Popover
                      content={<div className="ws-np">{dtf(clarification.answerTimestamp)}</div>}
                      triggerOn="hover"
                    >
                      <div style={{ marginTop: 16 }} className="tx-m"><ClockIcon size="small" /></div>
                    </Popover>
                    <div className="flex-1" style={{ overflow: 'auto', maxWidth: 'calc(100vw - 300px)' }}>
                      <MdMathViewer source={clarification.answer} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
      {clarification && (
        <Modal isOpen={true} onClose={() => setClarification(null)} closeIcon>
          <div className="jk-pad-md jk-col gap stretch">
            <div>
              <T className="fw-bd tt-se">clarification</T>
            </div>
            <div className="jk-form-item">
              <label>
                <T>problem</T>
                <Select
                  options={[
                    { value: '', label: <T className="tt-se">general</T> },
                    ...(Object.values(contest.problems)
                      .map(problem => ({
                        value: getProblemJudgeKey(problem.judge, problem.key),
                        label: <><span
                          className="fw-bd">{problem.index}</span> - {problem.name} ({JUDGE[problem.judge]?.label} {problem.key})</>,
                      }))),
                  ]}
                  selectedOption={{ value: clarification.problemJudgeKey }}
                  onChange={({ value }) => setClarification({ ...clarification, problemJudgeKey: value })}
                  extend
                />
              </label>
            </div>
            <div className="jk-form-item">
              <label>
                <div className="jk-row left gap"><T>question</T></div>
                <Input onChange={question => setClarification({ ...clarification, question })} value={clarification.question} />
              </label>
            </div>
            {isJudgeOrAdmin && (
              <div className="jk-form-item">
                <label>
                  <div className="jk-row left gap"><T>answer</T></div>
                </label>
                <MdMathEditor
                  onChange={answer => setClarification({ ...clarification, answer })}
                  source={clarification.answer || '\n\n'}
                  informationButton
                  uploadImageButton
                  initEditMode
                />
              </div>
            )}
            {isJudgeOrAdmin && (
              <div className="jk-form-item">
                <label>
                  <T className="tt-se fw-bd tx-s">visible for</T>
                  <InputToggle
                    checked={clarification.public}
                    onChange={(value) => setClarification({ ...clarification, public: value })}
                    leftLabel={<T className={classNames('tt-se', { 'fw-bd': clarification.public })}>contestant who
                      asked</T>}
                    rightLabel={<T className={classNames('tt-se', { 'fw-bd': !clarification.public })}>all
                      contestants</T>}
                  />
                </label>
              </div>
            )}
            <div className="jk-row right gap">
              <Button type="text" onClick={() => setClarification(null)}><T>cancel</T></Button>
              <ButtonLoader
                onClick={async (setLoaderStatus, loaderStatus, event) => {
                  setLoaderStatus(Status.LOADING);
                  let payload = {};
                  if (isJudgeOrAdmin) {
                    payload = {
                      problemJudgeKey: clarification.problemJudgeKey,
                      question: clarification.question,
                      answer: clarification.answer,
                      public: clarification.public,
                    };
                  } else if (isContestant) {
                    payload = {
                      problemJudgeKey: clarification.problemJudgeKey,
                      question: clarification.question,
                    };
                  }
                  const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                    clarification.clarificationId ? JUDGE_API_V1.CONTEST.ANSWER_CLARIFICATION(query.key + '', clarification.clarificationId) : JUDGE_API_V1.CONTEST.CLARIFICATION(query.key as string),
                    {
                      method: clarification.clarificationId ? HTTPMethod.PUT : HTTPMethod.POST,
                      body: JSON.stringify(payload),
                    }));
                  if (notifyResponse(response, addNotification)) {
                    await mutate();
                    setLoaderStatus(Status.SUCCESS);
                    setClarification(null);
                  } else {
                    setLoaderStatus(Status.ERROR);
                  }
                }}
              >
                <T>send</T>
              </ButtonLoader>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
