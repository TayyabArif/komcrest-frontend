import React, { useState } from 'react'
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import AuthLayout from "./AuthLayout";
import { toast } from "react-toastify";
import { useRouter } from 'next/router';


const ForgetPassword = ({ type }) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const [formData, setFormData] = useState({
    email: "",
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    setIsLoading(true)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: formData?.email
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${baseUrl}/users/request-password-reset`, requestOptions)
      .then((response) => {
        return response.json().then((data) => ({
          status: response.status,
          ok: response.ok,
          data,
        }));
      })
      .then(({ status, ok, data }) => {
        if (ok){
          toast.success("Reset password email sent successfully")
          router.push(`/${type}/login/password-recovery/request/success`)
        }else{
          toast.error(data?.error)
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <AuthLayout Class={type === "vendor" ? 'bg-primary' : "bg-secondry"} sideBarDesc={type === "vendor" ? 'Eliminate Security Questionnaire complexity thanks to our A.I. powered solution that helps you get customers the exact answers for their security review in no time.' : "Manage your vendors’ security assessment in one place and allow them to use Komcrest A.I. powered solution to answers your questions promptly and qualitatively."}>
      <div className="flex flex-col w-[50%]">
        <p className="text-[28px] font-semibold">Did you forget your password? Enter your email to reset it</p>
        <Input
          isRequired
          value={formData.email}
          onChange={handleChange}
          name="email"
          size="md"
          type="email"
          placeholder="Email"
          className="mt-3 -ml-1"
          classNames={{ inputWrapper: "h-[40px]", input: "text-base 2xl:text-[20px]" }}
        />
        <Button
          radius="none"
          size="sm"
          className="mt-6 text-white px-[45px] text-base 2xl:text-[20px] bg-[#4fa82e] w-max rounded-[6px] -ml-1"
          isDisabled={!formData?.email || isLoading}
          isLoading={isLoading}
          onPress={handleSubmit}
        >
          Receive link
        </Button>
      </div>
    </AuthLayout>
  )
}

export default ForgetPassword
