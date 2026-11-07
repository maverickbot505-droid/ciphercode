import { NextApiRequest, NextApiResponse } from 'next';
import catalog from './catalog';
import detail from './[id]';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Route requests to appropriate handler based on method and path
  const url = new URL(req.url.replace('/api/projects', '/'));
  const pathname = url.pathname;

  if (pathname === '/catalog') {
    return catalog(req, res);
  } else if (pathname.startsWith('/[id]')) {
    return detail(req, res);
  } else {
    return catalog(req, res); // Default to catalog
  }
}
