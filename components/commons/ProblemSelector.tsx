import { LoadingIcon, MultiSelectSearchable } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { useFetcher } from 'hooks';
import React from 'react';
import { ContentsResponseType } from 'types';

interface ProblemSummaryResponseDTO {
  id: string,
  name: string,
  tags: string[],
}

interface ProblemSummary {
  key: string,
  name: string,
  tags: string[],
}

export const ProblemSelector = ({ onSelect }: { onSelect: (selectedUsers: ProblemSummary) => void }) => {
  
  const { isLoading, data } = useFetcher<ContentsResponseType<ProblemSummaryResponseDTO>>(JUDGE_API_V1.PROBLEM.BASIC_LIST());
  if (isLoading) {
    return <div><LoadingIcon /></div>;
  }
  
  return (
    <MultiSelectSearchable
      options={(data?.success ? data?.contents : []).map(problem => ({
        label: (
          <div className="jk-row gap nowrap jk-pad-sm">
            <div><span className="tx-wd-bolder color-primary">{problem.id}</span></div>
            <div className="jk-col stretch">
              {problem.name}
              <div className="jk-row left gap">
                {problem.tags?.map(tag => <div className="jk-tag gray-5" key={tag}>{tag}</div>)}
              </div>
            </div>
          
          </div>
        ),
        inputLabel: (
          <div>
            {problem.id} {problem.name} {problem.tags?.map(tag => <div className="jk-tag gray-6" key={tag}>{tag}</div>)}
          </div>
        ),
        value: problem,
      }))}
      selectedOptions={[].map(user => ({ value: user }))}
      onChange={options => options[0] ? onSelect({ ...options[0].value, key: options[0].value?.id }) : null}
      optionsPlacement="bottom"
      block
      rowHeightOption={72}
      onFilter={({ search, option }) => {
        const text = search.toLowerCase();
        return (
          option.value.name.toLowerCase().indexOf(text) > -1 ||
          (option.value.id + '').toLowerCase().indexOf(text) > -1 ||
          option.value.tags.some(tag => tag.toLowerCase().indexOf(text) > -1)
        );
      }}
      multiselect={false}
    />
  );
};