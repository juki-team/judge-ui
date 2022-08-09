import {
  Button,
  ButtonLoader,
  ClockIcon,
  EditIcon,
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
import { authorizedRequest, classNames, cleanRequest, getProblemJudgeKey, notifyResponse, useDateFormat } from 'helpers';
import { useNotification, useRouter } from 'hooks';
import React, { useState } from 'react';
import { useUserState } from 'store';
import { useSWRConfig } from 'swr';
import { ContentResponseType, ContestResponseDTO, HTTPMethod, Status } from 'types';
import { Input, InputToggle } from '../../index';

export const ViewClarifications = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { query } = useRouter();
  const { dtf } = useDateFormat();
  const { session } = useUserState();
  const { isAdmin, isContestant, isJudge } = contest.user;
  const [clarification, setClarification] = useState<null | {
    clarificationId: string,
    problemJudgeKey: string,
    question: string,
    answer: string,
    public: boolean,
  }>(null);
  const { addNotification } = useNotification();
  const { mutate } = useSWRConfig();
  const isJudgeOrAdmin = isJudge || isAdmin;
  
  return (
    <div className="jk-col jk-pad">
      {isJudgeOrAdmin || isContestant && (
        <div
          className="jk-pad-md bg-color-white jk-shadow jk-border-radius-inline"
          style={{ position: 'sticky', top: 'var(--pad-md)', zIndex: 1 }}
        >
          {isJudgeOrAdmin ? (
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
              <T className="tx-cs-sentence tx-wd-bold">send clarification</T>
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
              <T className="tx-cs-sentence tx-wd-bold">ask question</T>
            </Button>
          )}
        </div>
      )}
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
          ?.map(clarification => {
            return (
              <div className="jk-shadow jk-pad-md jk-border-radius-inline relative">
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
                  <h6>{clarification.question}</h6>
                  <div className="jk-row gap">
                    <Popover
                      content={<div className="tx-ws-nowrap">{dtf(clarification.questionTimestamp)}</div>}
                      triggerOn="hover"
                    >
                      <div className="jk-row"><ClockIcon className="color-primary" size="small" /></div>
                    </Popover>
                    <Popover
                      content={<UserNicknameLink nickname={clarification.questionUserNickname}>
                        <div className="link tx-s tx-ws-nowrap">{clarification.questionUserNickname}</div>
                      </UserNicknameLink>}
                      triggerOn="hover"
                    >
                      <div className="jk-row">
                        <UserNicknameLink nickname={clarification.questionUserNickname}>
                          <img
                            src={clarification.questionUserImageUrl}
                            className="jk-user-profile-img small jk-shadow"
                            alt={clarification.questionUserNickname}
                          />
                        </UserNicknameLink>
                      </div>
                    </Popover>
                  </div>
                  <div className="jk-row nowrap gap">
                    <div className="jk-tag primary-light">
                      {!clarification.problemJudgeKey
                        ? <T className="tx-cs-sentence">general</T>
                        : <div>
                          <T className="tx-cs-sentence">problem</T> <span
                          className="tx-wd-bold">{contest?.problems?.[clarification.problemJudgeKey]?.index}</span>
                        </div>}
                    </div>
                    <div className="jk-tag gray-6">{clarification.public ? <T>pubic</T> : <T>only for the user who asked</T>}</div>
                    {!clarification.answerTimestamp && <div className="jk-tag error"><T>not answered yet</T></div>}
                  </div>
                </div>
                {!!clarification.answerTimestamp && (
                  <div className="jk-row gap left top stretch nowrap">
                    <Popover
                      content={<div className="tx-ws-nowrap">{dtf(clarification.answerTimestamp)}</div>}
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
          <div className="jk-pad jk-col gap stretch">
            <div>
              <T className="tx-wd-bold tx-cs-sentence">clarification</T>
            </div>
            <div className="jk-form-item">
              <label>
                <T>problem</T>
                <Select
                  options={[
                    { value: '', label: <T className="tx-cs-sentence">general</T> },
                    ...(Object.values(contest.problems)
                      .map(problem => ({
                        value: getProblemJudgeKey(problem.judge, problem.key),
                        label: <><span
                          className="tx-wd-bold">{problem.index}</span> - {problem.name} ({JUDGE[problem.judge]?.label} {problem.key})</>,
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
                  <T className="tx-cs-sentence tx-wd-bold tx-s">visible for</T>
                  <InputToggle
                    checked={clarification.public}
                    onChange={(value) => setClarification({ ...clarification, public: value })}
                    leftLabel={<T className={classNames('tx-cs-sentence', { 'tx-wd-bold': clarification.public })}>contestant who
                      asked</T>}
                    rightLabel={<T className={classNames('tx-cs-sentence', { 'tx-wd-bold': !clarification.public })}>all
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
                    clarification.clarificationId ? JUDGE_API_V1.CONTEST.ANSWER_CLARIFICATION_V1(query.key + '', clarification.clarificationId, session) : JUDGE_API_V1.CONTEST.CLARIFICATION_V1(query.key + '', session),
                    {
                      method: clarification.clarificationId ? HTTPMethod.PUT : HTTPMethod.POST,
                      body: JSON.stringify(payload),
                    }));
                  if (notifyResponse(response, addNotification)) {
                    await mutate(JUDGE_API_V1.CONTEST.CONTEST(query.key as string));
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