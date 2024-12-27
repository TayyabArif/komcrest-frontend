import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";

const FindDomain = ({ type }) => {
  // State to manage the domain input
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setDomain(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    console.log("domain",domain)
    setError("");
    router.push(`http://${domain}.localhost:3000/vendor/login/access`)

    setError("Domain not register");
    // if (!domain) {
    //   alert("Please enter a domain.");
    //   return;
    // }
    // setIsLoading(true);
    // try {
    //   // Example: API call to validate the domain
    //   const response = await fetch("/api/validate-domain", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ domain }),
    //   });

    //   const result = await response.json();

    //   if (response.ok) {
    //     alert("Domain validated successfully!");
    //     // Redirect or perform another action
    //   } else {
    //     alert(`Error: ${result.message}`);
    //   }
    // } catch (error) {
    //   console.error("Error validating domain:", error);
    //   alert("An error occurred. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }
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
        {error && (
          <span className="text-red-500 text-sm mt-1">
            {error}
          </span>
        )}

        <Button
          radius="none"
          size="sm"
          className="mt-6 text-white px-[45px] text-base 2xl:text-[20px] bg-[#4fa82e] w-max rounded-[6px] -ml-1"
          isDisabled={!domain || isLoading}
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
