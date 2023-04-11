import { contentResponse } from 'helpers';

export default function handler(req, res) {
  res.status(200).json(contentResponse('ok', { version: '1.0.2' }));
}
