import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Turnstile from "react-turnstile";
import { useCookies } from "react-cookie";
import jwt from "jwt-simple";

export default function CaptchaPage() {
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleVerify = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(`${baseUrl}/verify-captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (data.success) {

        const jwtPayload = {
          captchaVerified: true,
        }
        const expirationTime = Math.floor(Date.now() / 1000) + (60 * 60 * 3);
        jwtPayload.exp = expirationTime;
        const jwtToken = jwt.encode(jwtPayload, process.env.NEXT_PUBLIC_JWT_SECRET);

        setCookie("cpatchajwtToken", jwtToken, { path: "/" , expires: expirationTime});
        setMessage("✅ CAPTCHA verified successfully!");
        setTimeout(() => {
          if (cookiesData?.companyType == "vendor") {
            router.push("/vendor/document");
          } else {
            router.push("/admin/company-settings");
          }
        }, 1500);
        // ✅ Redirect after 2 sec
      } else {
        setMessage("❌ CAPTCHA verification failed. Try again.");
      }
    } catch (error) {
      setMessage("⚠️ An error occurred while verifying CAPTCHA.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center space-y-10 p-10 bg-white shadow-lg rounded-lg">
        <h2 className="text-[33px]">Please verify you are human</h2>
        <div
          style={{
            transform: "scale(1.3)",
            transformOrigin: "center",
            display: "inline-block",
          }}
          className="px-20"
        >
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onVerify={handleVerify}
          />
        </div>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
