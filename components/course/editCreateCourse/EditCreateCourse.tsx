import {
  Breadcrumbs,
  ButtonLoader,
  CheckUnsavedChanges,
  CloseIcon,
  CodeEditor,
  Input,
  LastLink,
  SaveIcon,
  Select,
  T,
  TabsInline,
  TextArea,
  TwoContentSection,
  UploadImageButton,
} from 'components';
import { COURSE_DEFAULT, COURSE_STATUS, JUDGE_API_V1, ROUTES } from 'config/constants';
import { diff } from 'deep-object-diff';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useJukiRouter, useJukiUI, useNotification } from 'hooks';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import {
  ButtonLoaderOnClickType,
  ContentResponseType,
  ContestsTab,
  ContestTab,
  CourseStatus,
  CourseTab,
  EditCreateCourseType,
  HTTPMethod,
  LastLinkKey,
  ProgrammingLanguage,
  Status,
} from 'types';

interface EditCreateContestProps {
  course?: any | undefined,
}

export const EditCreateCourse = ({ course: initialCourse }: EditCreateContestProps) => {
  
  const editing = !!initialCourse;
  
  const { addWarningNotification } = useNotification();
  const { notifyResponse } = useNotification();
  const { viewPortSize } = useJukiUI();
  const [ course, setCourse ] = useState<EditCreateCourseType>(initialCourse || COURSE_DEFAULT());
  const lastContest = useRef(initialCourse);
  useEffect(() => {
    if (editing && JSON.stringify(initialCourse) !== JSON.stringify(lastContest.current)) {
      const text = JSON.stringify(diff(lastContest.current, initialCourse), null, 2);
      const height = text.split('\n').length;
      addWarningNotification(
        <div>
          <>
            <T className="tt-se">the course changed</T>
            <T>your changes can override other admins</T>
          </>
          :
          <div style={{ height: height * 24 + 'px' }}>
            <CodeEditor
              sourceCode={text}
              language={ProgrammingLanguage.JSON}
              readOnly
            />
          </div>
        </div>,
      );
      lastContest.current = initialCourse;
    }
  }, [ addWarningNotification, editing, JSON.stringify(initialCourse) ]);
  
  const { pushRoute, searchParams } = useJukiRouter();
  
  const onSave: ButtonLoaderOnClickType = async (setLoaderStatus) => {
    setLoaderStatus(Status.LOADING);
    const response = cleanRequest<ContentResponseType<string>>(
      await authorizedRequest(
        editing ? JUDGE_API_V1.CONTEST.CONTEST(initialCourse.key) : JUDGE_API_V1.CONTEST.CREATE(),
        { method: editing ? HTTPMethod.PUT : HTTPMethod.POST, body: JSON.stringify(course) },
      ),
    );
    if (notifyResponse(response, setLoaderStatus)) {
      setLoaderStatus(Status.LOADING);
      await pushRoute(ROUTES.CONTESTS.VIEW(course.key, ContestTab.OVERVIEW));
      setLoaderStatus(Status.SUCCESS);
    }
  };
  
  const tabHeaders = {
    [CourseTab.OVERVIEW]: {
      key: CourseTab.OVERVIEW,
      header: <T className="tt-ce">overview</T>,
      body: (
        <div className="jk-col gap stretch top pad-top-bottom pad-left-right">
          <div className="jk-row left gap nowrap">
            <div className="fw-bd tt-se tx-xl cr-py"><T>key</T>:</div>
            <Input
              value={course.key}
              onChange={value => {
                setCourse(prevState => ({
                  ...prevState,
                  key: value.trim().split(' ').join('-').replace(/[^0-9a-z_-]/gi, ''),
                }));
              }}
            />
          </div>
          <div className="jk-row left gap nowrap">
            <div className="jk-row nowrap fw-bd tx-xl cr-er"><T className="tt-se ws-np">contest status</T>:</div>
            <Select
              options={Object.values(COURSE_STATUS).map(status => ({
                value: status.value,
                label: (
                  <div className="jk-col left">
                    <T className="fw-bd tt-se tx-xl cr-py">{status.label}</T>
                    <T className="tt-se">{status.description}</T>
                  </div>
                ),
              }))}
              selectedOption={{ value: CourseStatus.IN_DRAFT }}
              // onChange={({ value }) => setContest(prevState => ({ ...prevState, status: value }))}
              popoverClassName="max-popover-select-size"
              // extend
            />
          </div>
          <div className="jk-row gap left">
            <div className="fw-bd tt-se tx-xl cr-py"><T>cover image</T></div>
            <UploadImageButton
              withLabel
              onPickImageUrl={({ imageUrl }) => setCourse(prevState => ({ ...prevState, coverImageUrl: imageUrl }))}
            />
          </div>
          <div>
            <div className="fw-bd tt-se tx-xl cr-py"><T>abstract</T></div>
            <TextArea
              value={course.abstract}
              onChange={(value) => setCourse(prevState => ({ ...prevState, abstract: value }))}
            />
          </div>
          <div>
            <div className="fw-bd tt-se tx-xl cr-py"><T>description</T></div>
            <TextArea
              value={course.description}
              onChange={(value) => setCourse(prevState => ({ ...prevState, description: value }))}
            />
          </div>
        </div>
      ),
    },
    [CourseTab.UNITS]: {
      key: CourseTab.UNITS,
      header: <T className="tt-ce">units</T>,
      body: (
        <div className="pad-top-bottom pad-left-right">
          <T>lessons</T>
          <div>
            add unit
          </div>
          
          <div>
            <T>add lesson</T>
            <T>add task</T>
            <T>add task</T>
          </div>
        </div>
      ),
    },
  };
  
  const [ contestTab, setContestTab ] = useState<CourseTab>(CourseTab.OVERVIEW);
  
  const extraNodes = [
    <CheckUnsavedChanges
      onClickContinue={() => pushRoute(editing ? ROUTES.COURSES.VIEW(course.key, CourseTab.OVERVIEW) : ROUTES.CONTESTS.LIST(ContestsTab.ALL))}
      value={course}
      key="cancel"
    >
      <ButtonLoader
        type="light"
        icon={<CloseIcon />}
        responsiveMobile
        size="small"
      >
        {viewPortSize !== 'sm' && <T>cancel</T>}
      </ButtonLoader>
    </CheckUnsavedChanges>,
    <ButtonLoader
      type="secondary"
      responsiveMobile
      size="small"
      onClick={onSave}
      icon={<SaveIcon />}
      key="update/create"
    >
      {viewPortSize !== 'sm' && (editing ? <T>update</T> : <T>create</T>)}
    </ButtonLoader>,
  ];
  
  const breadcrumbs = [
    <Link href="/" className="link" key="home"><T className="tt-se">home</T></Link>,
    <LastLink lastLinkKey={LastLinkKey.CONTESTS} key="courses"><T className="tt-se">courses</T></LastLink>,
  ];
  
  if (editing) {
    breadcrumbs.push(
      <Link
        href={{ pathname: ROUTES.CONTESTS.VIEW(course.key, ContestTab.OVERVIEW), search: searchParams.toString() }}
        className="link"
        key="course.title"
      >
        <div>{course.title}</div>
      </Link>,
    );
  }
  
  breadcrumbs.push(tabHeaders[contestTab]?.header);
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div
          style={{
            backgroundImage: `url(${course.coverImageUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center right',
            backgroundSize: 'contain',
            opacity: 0.8,
          }}
        >
          <div className="jk-row center pad-left-right">
            <h3 style={{ padding: 'var(--pad-sm) 0' }}><T>title</T></h3>:&nbsp;
            <Input
              value={course.title}
              onChange={value => setCourse(prevState => ({
                ...prevState,
                title: value,
              }))}
              size="auto"
            />
          </div>
          <div className="pad-left-right" style={{ overflow: 'hidden' }}>
            <TabsInline
              tabs={tabHeaders}
              selectedTabKey={contestTab}
              onChange={(tab) => setContestTab(tab)}
              extraNodes={extraNodes}
            />
          </div>
        </div>
      </div>
      {tabHeaders[contestTab]?.body}
    </TwoContentSection>
  );
};
