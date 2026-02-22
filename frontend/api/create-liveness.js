export default async function handler(req, res) {
  // Enable CORS for your frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { request_token } = req.body;

    if (!request_token) {
      return res.status(400).json({ error: "request_token is required" });
    }

    console.log("Proxying request to Lambda with token:", request_token);

    // Call the Lambda function
    const response = await fetch(process.env.CREATE_SESSION_LAMBDA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ request_token }),
    });

    // Get the response as text first
    const responseText = await response.text();
    console.log("Lambda response status:", response.status);
    console.log("Lambda response:", responseText);

    // Try to parse as JSON
    try {
      const data = JSON.parse(responseText);
      return res.status(response.status).json(data);
    } catch {
      // If not JSON, return as text
      return res.status(response.status).send(responseText);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({
      error: "Failed to call Lambda function",
      details: error.message,
    });
  }
}
