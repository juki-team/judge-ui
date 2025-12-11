import { ButtonLoader, Input, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useJukiNotification, useState } from 'hooks';
import { type Dispatch, type SetStateAction } from 'react';
import { ContentResponseType, HTTPMethod, Language, Status, UpsertProblemUIDTO } from 'types';

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
              const response = cleanRequest<ContentResponseType<{ pdfUrl: string, signedUrl: string }>>(
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
