'use client';

import { MdMathEditor, Tabs } from 'components';
import { useUIStore } from 'hooks';
import { Language, TextLanguageType } from 'types';

interface TextLangEditProps {
  text: TextLanguageType,
  setText: (text: TextLanguageType) => void,
}

export const TextLangEdit = ({ text, setText }: TextLangEditProps) => {
  
  const { Image } = useUIStore(store => store.components);
  
  return (
    <div className="text-editor">
      <Tabs
        tabs={[
          {
            key: Language.ES,
            body: (
              <MdMathEditor
                informationButton
                enableTextPlain
                enableImageUpload
                enableIA
                value={text?.[Language.ES]}
                onChange={value => setText({ ...text, [Language.ES]: value })}
              />
            ),
            header: (
              <div className="jk-row nowrap">
                Español <div style={{ width: 50, height: 24 }}>
                <Image
                  alt="ES image"
                  fill
                  src="https://images.juki.pub/assets/image-es.png"
                />
              </div>
              </div>
            ),
          },
          {
            key: Language.EN,
            body: (
              <MdMathEditor
                informationButton
                enableTextPlain
                enableImageUpload
                enableIA
                value={text?.[Language.EN]}
                onChange={value => setText({ ...text, [Language.EN]: value })}
              />
            ),
            header: (
              <div className="jk-row nowrap">
                English <div style={{ width: 50, height: 24 }}>
                <Image
                  alt="US image"
                  fill
                  src="https://images.juki.pub/assets/image-us.png"
                />
              </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
