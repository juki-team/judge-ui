import { Dispatch, SetStateAction } from 'react';
import { consoleWarn, request, settings } from '../../../helpers';

export const publishNote = async (source: string) => {
  const { status, data } = await request(...settings.UTILS_API.POST_PUBLIC_NOTE(JSON.stringify({ source: source.trim() })));
  if (status === 200) {
    if (data?.success) {
      return data.content.sourceUrl;
    }
  }
  consoleWarn({ message: 'error on publish note', status, data });
  return '';
};

export const openNewTab = (url: string) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) {
    newWindow.opener = null;
  }
};

export const handleShareMdPdf = (type: string, source: string, sourceUrl: string, setSourceUrl: Dispatch<SetStateAction<string>>) => async () => {
  let url = sourceUrl;
  if (!sourceUrl) {
    url = await publishNote(source);
    setSourceUrl(url);
  }
  if (url) {
    openNewTab(...(
      type === 'md-fullscreen'
        ? settings.UTILS_API.GET_PUBLIC_NOTE_MARKDOWN_FULLSCREEN(url)
        : type === 'md'
          ? settings.UTILS_API.GET_PUBLIC_NOTE_MARKDOWN(url)
          : settings.UTILS_API.GET_PUBLIC_NOTE_PDF(url)
    ));
  } else {
    throw new Error('no url generated');
  }
};
