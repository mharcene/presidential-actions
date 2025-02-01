export default async function handler(req, res) {
    // Get the target URL from the query parameters.
    const { url } = req.query;
    if (!url) {
      res.status(400).send("Missing url parameter");
      return;
    }
    
    try {
      // Fetch the target URL.
      const response = await fetch(url);
      const contentType = response.headers.get("content-type") || "text/plain";
      const body = await response.text();
      
      // Forward the response with the appropriate content type.
      res.setHeader("Content-Type", contentType);
      res.status(response.status).send(body);
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
  