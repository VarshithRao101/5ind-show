const functions = require("firebase-functions");
const fetch = require("node-fetch");

// reCAPTCHA verification endpoint
exports.verifyCaptcha = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const secretKey = "6LeRUigsAAAAAIF8aEtQBGFmZKLEIbLkMJG4ywb6";
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ success: false, error: "No token provided" });
  }

  const googleVerifyURL = "https://www.google.com/recaptcha/api/siteverify";

  try {
    console.log("Verifying reCAPTCHA token with Google API...");

    const response = await fetch(googleVerifyURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(
        token
      )}`,
    });

    if (!response.ok) {
      console.error("Google API error:", response.status);
      return res.status(500).json({
        success: false,
        error: "Captcha verification service error",
      });
    }

    const data = await response.json();
    console.log("Google reCAPTCHA response:", data);

    return res.json(data);
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return res.status(500).json({
      success: false,
      error: "Captcha verification failed",
    });
  }
});
