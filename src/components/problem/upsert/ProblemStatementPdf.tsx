import { ButtonLoader, Input, T, useJukiNotification } from '@juki-team/base-ui';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest } from '@juki-team/base-ui/helpers';
import { HTTPMethod, Language, Status } from '@juki-team/commons/enums';
import { cleanRequest } from '@juki-team/commons/helpers';
import { type ContentResponse } from '@juki-team/commons/types';
import { useState } from 'hooks';
import { type Dispatch, type SetStateAction } from 'react';
import { UpsertProblemUIDTO } from 'types';

interface ProblemStatementPdfProps {
  problem: UpsertProblemUIDTO,
  setProblem: Dispatch<SetStateAction<UpsertProblemUIDTO>>,
  language: Language,
}

export const ProblemStatementPdf = ({ problem, setProblem, language }: ProblemStatementPdfProps) => {

  const { addErrorNotification, addSuccessNotification } = useJukiNotification();
  const [ file, setFile ] = useState<FileList[number] | null>(null);

  return (
    <div className="jk-col nowrap">
      <div className="jk-row gap">
        <Input<FileList>
          type="file"
          onChange={(files) => {
            if (files[0]) {
              setFile(files[0]);
            }
          }}
        />
        <ButtonLoader
          disabled={!file}
          onClick={async (setLoader) => {
            setLoader(Status.LOADING);
            try {
              const response = cleanRequest<ContentResponse<{ pdfUrl: string, signedUrl: string }>>(
                await authorizedRequest(
                  JUDGE_API_V1.PROBLEM.POST_PDF(),
                  { method: HTTPMethod.POST }),
              );

              if (!response.success) {
                throw response;
              }

              await fetch(response.content.signedUrl, {
                method: HTTPMethod.PUT,
                headers: {
                  'Content-Type': 'application/pdf',
                },
                body: file,
              });
              setProblem(prevState => ({
                ...prevState,
                statement: {
                  ...prevState.statement,
                  pdfUrl: { ...prevState.statement.pdfUrl, [language]: response.content.pdfUrl },
                },
              }));
              addSuccessNotification(<T className="tt-se">pdf uploaded successfully</T>);
              setLoader(Status.SUCCESS);
            } catch (error) {
              console.error(error);
              addErrorNotification(<T className="tt-se">ups, please try again</T>);
              setLoader(Status.ERROR);
            }
          }}
        >
          <T className="tt-se">upload and replace</T>
        </ButtonLoader>
      </div>
      <div className="wh-100 ht-100">
        <iframe
          src={problem.statement.pdfUrl[language]}
          width="100%"
          height="800px"
          style={{ border: 'none' }}
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};
