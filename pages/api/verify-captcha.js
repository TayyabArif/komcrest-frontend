export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, message: "Method not allowed" });
    }
  
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ success: false, message: "Token missing" });
      }
  
      const secretKey = process.env.NEXT_PUBLIC_TURNSTILE_SECRET_KEY;
      const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  
      const verifyResponse = await fetch(verifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: secretKey, response: token }),
      });
  
      const verifyData = await verifyResponse.json();
  
      if (!verifyData.success) {
        return res.status(403).json({ success: false, message: "Invalid CAPTCHA" });
      }
  
      // ✅ Set cookie properly
      res.setHeader(
        "Set-Cookie",
        `captcha_verified=true; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
      );
  
      return res.json({ success: true, message: "CAPTCHA verified successfully!" });
    } catch (error) {
      console.error("Error verifying CAPTCHA:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
  