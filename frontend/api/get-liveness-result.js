export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    console.log("Getting liveness result for session:", sessionId);

    const response = await fetch(process.env.GET_SESSION_LAMBDA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    const responseText = await response.text();
    console.log("Lambda response status:", response.status);
    console.log("Lambda response:", responseText);

    try {
      const data = JSON.parse(responseText);
      return res.status(response.status).json(data);
    } catch {
      return res.status(response.status).send(responseText);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({
      error: "Failed to get liveness results",
      details: error.message,
    });
  }
}
