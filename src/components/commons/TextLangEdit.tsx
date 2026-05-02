'use client';

import { MdMathEditor, Tabs, useUIStore } from '@juki-team/base-ui';
import { Language } from '@juki-team/commons/enums';
import { type TextLanguage } from '@juki-team/commons/types';

interface TextLangEditProps {
  text: TextLanguage,
  setText: (text: TextLanguage) => void,
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
                Español&nbsp;
                <Image
                  alt="ES image"
                  src="https://images.juki.pub/assets/image-es.png"
                  width={50}
                  height={24}
                />
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
                English&nbsp;
                <Image
                  alt="US image"
                  src="https://images.juki.pub/assets/image-us.png"
                  width={50}
                  height={24}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
