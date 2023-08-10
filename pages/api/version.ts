import { contentResponse } from 'helpers';
import getConfig from 'next/config';
import { NextApiRequest, NextApiResponse } from 'types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { publicRuntimeConfig } = getConfig();
  res.status(200).json(contentResponse('ok', { version: publicRuntimeConfig?.version }));
}
