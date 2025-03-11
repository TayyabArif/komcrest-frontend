import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Turnstile from "react-turnstile";
import { useCookies } from "react-cookie";

export default function CaptchaPage() {
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [domain, setDomain] = useState("");


  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname; 
      const subdomain = hostname.split(".")[0];
      setDomain(subdomain);
    }
  }, []);


  const handleVerify = async (token) => {
    if (!token) return;

    try {
      const response = await fetch(`http://${domain}.${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/verify-captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        credentials: "include", // ✅ Important for setting cookies
      });

      const data = await response.json();
      if (data.success) {
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
        <h2 className="text-[40px]">Please verify you are human</h2>
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
