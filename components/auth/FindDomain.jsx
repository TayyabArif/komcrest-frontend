import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const FindDomain = ({ type }) => {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (e) => {
    setError("");
    setDomain(e.target.value.trim());
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const payLoad = JSON.stringify({ subdomain: domain });

      const response = await fetch(`${baseUrl}/checkdomain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payLoad,
        redirect: "follow",
      });

      const data = await response.json();

      if (response.ok) {
        setError("");
        router.push(
          `http://${domain}.komcrest.com/vendor/login/access`
        );
      } else {
        setError("Domain not registered");
      }
    } catch (error) {
      console.error("Error during domain check:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      Class={type === "vendor" ? "bg-primary" : "bg-secondry"}
      sideBarDesc={
        type === "vendor"
          ? "Eliminate security and compliance questionnaire complexity thanks to our A.I. powered solution that helps you get customers the exact answers for their security review in no time."
          : "Manage your vendors’ security assessment in one place and allow them to use Komcrest A.I. powered solution to answers your questions promptly and qualitatively."
      }
    >
      <div className="flex flex-col w-[50%]">
        <p className="text-[28px] font-semibold">Enter your company domain</p>
        <div className="flex items-center gap-2 mt-5">
          <Input
            isRequired
            value={domain}
            onChange={handleChange}
            name="domain"
            size="md"
            type="text"
            placeholder="Your Domain"
            className="w-[50%]"
            classNames={{
              inputWrapper: "h-[40px]",
              input: "text-base 2xl:text-[20px]",
            }}
          />
          <span>.komcrest.com</span>
        </div>
        {error && <span className="text-red-500 text-sm mt-1">{error}</span>}

        <Button
          radius="none"
          size="sm"
          className="mt-6 text-white px-[45px] text-base 2xl:text-[20px] bg-[#4fa82e] w-max rounded-[6px] -ml-1"
          isDisabled={!domain}
          isLoading={isLoading}
          onPress={handleSubmit}
        >
          Login
        </Button>
      </div>
    </AuthLayout>
  );
};

export default FindDomain;
