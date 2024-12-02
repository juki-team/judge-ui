import { FlagEnImage, FlagEsImage, MdMathEditor, Tabs } from 'components';
import React from 'react';
import { Language, TextLanguageType } from 'src/types';

export const TextLangEdit = ({ text, setText }: {
  text: TextLanguageType,
  setText: (text: TextLanguageType) => void
}) => {
  return (
    <div className="text-editor">
      <Tabs
        tabs={[
          {
            key: Language.ES,
            body: (
              <MdMathEditor
                informationButton
                uploadImageButton
                source={text?.[Language.ES]}
                onChange={value => setText({ ...text, [Language.ES]: value })}
                initEditMode
              />
            ),
            header: (
              <div className="jk-row nowrap">
                Español <div style={{ width: 50, height: 24 }}><FlagEsImage /></div>
              </div>
            ),
          },
          {
            key: Language.EN,
            body: (
              <MdMathEditor
                informationButton
                uploadImageButton
                source={text?.[Language.EN]}
                onChange={value => setText({ ...text, [Language.EN]: value })}
                initEditMode
              />
            ),
            header: (
              <div className="jk-row nowrap">
                English <div style={{ width: 50, height: 24 }}><FlagEnImage /></div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
