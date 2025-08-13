'use client';

import {
  Button,
  ButtonLoader,
  CommentIcon,
  EditIcon,
  Input,
  InputSelect,
  InputToggle,
  MdMathEditor,
  MdMathViewer,
  Modal,
  NotificationsActiveIcon,
  Popover,
  ScheduleIcon,
  T,
  UserNicknameLink,
} from 'components';
import { authorizedRequest, classNames, cleanRequest } from 'helpers';
import { useDateFormat, useFetcher, useJukiNotification, useJukiUI } from 'hooks';
import React, { useState } from 'react';
import { JUDGE_API_V1 } from 'src/constants';
import { ContentResponseType, ContestDataResponseDTO, HTTPMethod, Status } from 'types';

export const ViewClarifications = ({ contest }: { contest: ContestDataResponseDTO }) => {
  
  const { dtf } = useDateFormat();
  const { isAdministrator, isParticipant, isManager } = contest.user;
  const [ clarification, setClarification ] = useState<null | {
    clarificationId: string,
    problemJudgeKey: string,
    question: string,
    answer: string,
    public: boolean,
  }>(null);
  const { notifyResponse } = useJukiNotification();
  const { mutate } = useFetcher(JUDGE_API_V1.CONTEST.CONTEST_DATA(contest.key));
  const { components: { Image } } = useJukiUI();
  const isJudgeOrAdmin = isManager || isAdministrator;
  
  return (
    <div className="jk-col top jk-pg-md nowrap">
      <div className="jk-row">
        {(isJudgeOrAdmin || isParticipant) && (
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
          ) : isParticipant && (
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
      <div className="jk-pg-md jk-col stretch gap">
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
              <div className="elevation-1 jk-pg-md jk-border-radius-inline pn-re bc-we" key={clarification.key}>
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
                      icon={!!clarification.answerTimestamp ? <EditIcon /> : <CommentIcon />}
                    >
                      {!!clarification.answerTimestamp
                        ? <T className="tt-se">edit</T>
                        : <T className="tt-se">answer</T>}
                    </Button>
                  </div>
                )}
                <div className="jk-row left gap">
                  <div className="tx-h fw-bd cr-py">{clarification.question}</div>
                  <div className="jk-row gap">
                    <div
                      data-tooltip-id="jk-tooltip"
                      data-tooltip-content={dtf(clarification.questionTimestamp)}
                      data-tooltip-t-class-name="ws-np"
                      className="jk-row"
                    >
                      <ScheduleIcon className="cr-py" size="small" />
                    </div>
                    <Popover
                      content={
                        <UserNicknameLink nickname={clarification.questionUserNickname}>
                          <div className="link tx-s ws-np">{clarification.questionUserNickname}</div>
                        </UserNicknameLink>
                      }
                    >
                      <div className="jk-row">
                        <UserNicknameLink nickname={clarification.questionUserNickname}>
                          <Image
                            src={clarification.questionUserImageUrl}
                            alt={clarification.questionUserNickname}
                            width={24}
                            height={24}
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
                            {contest?.problems?.[clarification.problemJudgeKey]?.index
                              || <><T>problem deleted</T> ({clarification.problemJudgeKey})</>}
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
                    <div
                      data-tooltip-id="jk-tooltip"
                      data-tooltip-content={dtf(clarification.answerTimestamp)}
                      data-tooltip-t-class-name="ws-np"
                      className="jk-row"
                    >
                      <ScheduleIcon size="small" />
                    </div>
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
        <Modal isOpen onClose={() => setClarification(null)} closeIcon>
          <div className="jk-pg-md jk-col gap stretch">
            <h3><T className="tt-se">clarification</T></h3>
            <div className="jk-form-item">
              <InputSelect
                label={<T className="tt-se">problem</T>}
                labelPlacement="top"
                options={[
                  { value: '', label: <T className="tt-se">general</T> },
                  ...(Object.values(contest.problems)
                    .map(problem => ({
                      value: problem.key,
                      label: <>
                        <span
                          className="fw-bd"
                        >{problem.index}</span> - {problem.name} ({problem.judge.key} {problem.key})
                      </>,
                    }))),
                ]}
                selectedOption={{
                  value: clarification.problemJudgeKey,
                  label: clarification.problemJudgeKey === '' || Object.values(contest.problems).map(problem => problem.key).includes(clarification.problemJudgeKey)
                    ? undefined
                    : <T className="tt-se">problem not found</T>,
                }}
                onChange={({ value }) => setClarification({ ...clarification, problemJudgeKey: value })}
                expand
              />
            </div>
            <div className="jk-form-item">
              <Input
                label={<T className="tt-se">question</T>}
                labelPlacement="top"
                onChange={question => setClarification({ ...clarification, question })}
                value={clarification.question}
              />
            </div>
            {isJudgeOrAdmin && (
              <div className="jk-form-item">
                <label>
                  <div className="jk-row left gap"><T className="fw-bd tt-se">answer</T></div>
                </label>
                <MdMathEditor
                  onChange={answer => setClarification({ ...clarification, answer })}
                  value={clarification.answer || '\n\n'}
                  informationButton
                  enableTextPlain
                  enableImageUpload
                  enableIA
                />
              </div>
            )}
            {isJudgeOrAdmin && (
              <div>
                <T className="tt-se fw-bd">visible for</T>
                <InputToggle
                  checked={clarification.public}
                  onChange={(value) => setClarification({ ...clarification, public: value })}
                  leftLabel={
                    <T className={classNames('tt-se', { 'fw-bd': clarification.public })}>contestant who asked</T>
                  }
                  rightLabel={
                    <T className={classNames('tt-se', { 'fw-bd': !clarification.public })}>all contestants</T>
                  }
                />
              </div>
            )}
            <div className="jk-row right gap">
              <Button type="light" onClick={() => setClarification(null)}><T>cancel</T></Button>
              <ButtonLoader
                onClick={async (setLoaderStatus) => {
                  setLoaderStatus(Status.LOADING);
                  let payload = {};
                  if (isJudgeOrAdmin) {
                    payload = {
                      problemJudgeKey: clarification.problemJudgeKey,
                      question: clarification.question,
                      answer: clarification.answer,
                      public: clarification.public,
                    };
                  } else if (isParticipant) {
                    payload = {
                      problemJudgeKey: clarification.problemJudgeKey,
                      question: clarification.question,
                    };
                  }
                  const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                    clarification.clarificationId
                      ? JUDGE_API_V1.CONTEST.ANSWER_CLARIFICATION(contest.key + '', clarification.clarificationId)
                      : JUDGE_API_V1.CONTEST.CLARIFICATION(contest.key as string),
                    {
                      method: clarification.clarificationId ? HTTPMethod.PUT : HTTPMethod.POST,
                      body: JSON.stringify(payload),
                    }));
                  if (notifyResponse(response, setLoaderStatus)) {
                    setLoaderStatus(Status.LOADING);
                    await mutate();
                    setLoaderStatus(Status.SUCCESS);
                    setClarification(null);
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
