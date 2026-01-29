// Google reCAPTCHA v2 Verification via Firebase Cloud Function
// This backend verification prevents tampering with the token

export async function verifyCaptcha(token) {
  if (!token) {
    console.warn("No captcha token provided");
    return false;
  }

  try {
    console.log("Sending captcha token to Firebase Cloud Function...");

    const response = await fetch(
      "https://us-central1-indshow-f1057.cloudfunctions.net/verifyCaptcha",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    if (!response.ok) {
      console.error("Cloud function error:", response.status);
      return false;
    }

    const data = await response.json();
    console.log("reCAPTCHA verification response:", data);

    // Return true only if Google confirms success
    return data.success === true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}
