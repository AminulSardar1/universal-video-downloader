import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const apiURL = `https://aminul-rest-api-three.vercel.app/downloader/alldownloader?url=${encodeURIComponent(url)}`;
    
    const response = await axios.get(apiURL, {
      timeout: 15000, // 15s timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Set CORS headers for security and flexibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Vercel API Error:', error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    
    return res.status(status).json({ 
      error: 'Downloader API Error', 
      details: message 
    });
  }
}
