import { Loader, ThemeProvider } from "@aws-amplify/ui-react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import React from "react";
import awsexports from "./aws-exports";

// Configure Amplify
Amplify.configure(awsexports);

export function App() {
  const [loading, setLoading] = React.useState(true);
  const [sessionId, setSessionId] = React.useState(null);
  const [isLive, setIsLive] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [debugInfo, setDebugInfo] = React.useState({});
  const [verifiedImage, setVerifiedImage] = React.useState(null);
  const [authDetails, setAuthDetails] = React.useState({
    identityId: "Checking...",
    authenticated: "Checking...",
  });

  // Check authentication
  React.useEffect(() => {
    const checkAuthDetails = async () => {
      try {
        const session = await fetchAuthSession();
        const credentials = session.credentials;
        const identityId = session.identityId;

        setAuthDetails({
          identityId: identityId || "No identity",
          authenticated: credentials
            ? "✅ Authenticated"
            : "⚠️ Unauthenticated (guest)",
          accessKey: credentials?.accessKeyId ? "✅ Present" : "❌ Missing",
        });
      } catch (err) {
        setAuthDetails({
          identityId: `Error: ${err.message}`,
          authenticated: "❌ Auth failed",
          accessKey: "Check configuration",
        });
      }
    };

    checkAuthDetails();
  }, []);

  // Create liveness session
  React.useEffect(() => {
    const createLivenessSession = async () => {
      try {
        setDebugInfo((prev) => ({ ...prev, step: "Creating session..." }));

        const response = await fetch("/api/create-liveness", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ request_token: `req_${Date.now()}` }),
        });

        const data = await response.json();
        setDebugInfo((prev) => ({ ...prev, sessionResponse: data }));

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
        }

        if (!data.sessionId) {
          throw new Error("No sessionId in response");
        }

        setSessionId(data.sessionId);
        setDebugInfo((prev) => ({
          ...prev,
          step: "Session created",
          sessionId: data.sessionId,
        }));
      } catch (err) {
        setDebugInfo((prev) => ({ ...prev, error: err.message }));
        setError("Failed to create session: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    createLivenessSession();
  }, []);

  const handleAnalysisComplete = async () => {
    try {
      console.log("Getting results for session:", sessionId);

      const response = await fetch("/api/get-liveness-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      // Store in debug info
      setDebugInfo((prev) => ({ ...prev, apiResponse: data }));

      // Extract confidence score
      const confidence = data.Confidence || data.confidence || 0;
      const isVerified = confidence > 90;
      setIsLive(isVerified);

      // ✅ SHOW THE REFERENCE IMAGE
      if (isVerified && data.ReferenceImage && data.ReferenceImage.Bytes) {
        // The Bytes field now contains base64 encoded image
        const imageUrl = `data:image/jpeg;base64,${data.ReferenceImage.Bytes}`;
        setVerifiedImage(imageUrl);
        console.log("✅ Verified image loaded successfully");
      } else {
        console.log("⚠️ No reference image in response");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to get results: " + err.message);
    }
  };

  const handleError = (error) => {
    console.error("Liveness error:", error);
    setError("Liveness check failed: " + (error.message || "Unknown error"));
  };

  return (
    <ThemeProvider>
      <div style={{ padding: "10px", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Face Liveness Detection</h1>

        {/* Auth Status Display */}
        <div
          style={{
            background: "#e3f2fd",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "5px",
            fontFamily: "monospace",
          }}
        >
          <strong>🔐 AUTH STATUS:</strong>
          <div>Identity: {authDetails.identityId}</div>
          <div>Status: {authDetails.authenticated}</div>
          <div>Access Key: {authDetails.accessKey}</div>
        </div>

        {/* Error Display */}
        {error && (
          <div
            style={{
              padding: "15px",
              marginBottom: "20px",
              backgroundColor: "#ffebee",
              border: "2px solid #f44336",
              borderRadius: "5px",
              color: "#b71c1c",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
            }}
          >
            <h3>⚠️ ERROR</h3>
            <div>{error}</div>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "15px",
                padding: "10px",
                width: "100%",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Result Display with Verified Image */}
        {isLive !== null && !error && (
          <div
            style={{
              padding: "20px",
              marginBottom: "20px",
              backgroundColor: isLive ? "#e8f5e8" : "#ffebee",
              border: `2px solid ${isLive ? "#4caf50" : "#f44336"}`,
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <h2>{isLive ? "✅ VERIFIED!" : "❌ FAILED"}</h2>

            {/* SHOW VERIFIED IMAGE */}
            {isLive && verifiedImage && (
              <div style={{ margin: "20px 0" }}>
                <h3>📸 Verified User Image</h3>
                <div
                  style={{
                    width: "280px",
                    height: "280px",
                    margin: "0 auto",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "3px solid #4caf50",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  <img
                    src={verifiedImage}
                    alt="Verified user"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      console.error("Image failed to load:", e);
                    }}
                    onLoad={() => console.log("Image loaded successfully")}
                  />
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginTop: "10px",
                  }}
                >
                  ✓ Image captured during liveness check
                </p>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: verifiedImage ? "10px" : "0",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Liveness Detector */}
        {loading && <Loader />}
        {!loading && sessionId && !error && isLive === null && (
          <FaceLivenessDetector
            sessionId={sessionId}
            region="us-east-1"
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleError}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
