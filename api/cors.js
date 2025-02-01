export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    console.log('Attempting to fetch:', url);

    // Add headers to make the request look like a regular browser request
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml,application/xml;q=0.9',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`Target URL returned ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    console.log('Response data preview:', data.substring(0, 200));

    // Forward the response with correct content type
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from target URL: ' + error.message,
      details: error.stack
    });
  }
}
  