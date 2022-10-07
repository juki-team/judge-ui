import { MdMathEditor, Tabs } from 'components';
import { LANGUAGE } from 'config/constants';
import React from 'react';
import { Language, TextLanguageType } from 'types';

export const TextLangEdit = ({ text, setText }: { text: TextLanguageType, setText: (text: TextLanguageType) => void }) => {
  return (
    <div className="text-lang-edit">
      <Tabs
        tabs={[
          {
            key: Language.EN,
            body: (
              <MdMathEditor
                informationButton
                uploadImageButton
                source={text?.[Language.EN]}
                onChange={value => setText({ ...text, [Language.EN]: value })}
              />
            ),
            header: <span className="tt-se">{LANGUAGE[Language.EN].label}</span>,
          },
          {
            key: Language.ES,
            body: (
              <MdMathEditor
                informationButton
                uploadImageButton
                source={text?.[Language.ES]}
                onChange={value => setText({ ...text, [Language.ES]: value })}
              />
            ),
            header: <span className="tt-se">{LANGUAGE[Language.ES].label}</span>,
          },
        ]}
      />
    </div>
  );
};
