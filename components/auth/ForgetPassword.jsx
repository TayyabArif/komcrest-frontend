import React from 'react'
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import AuthLayout from "./AuthLayout";
import { Eye, EyeOff } from "lucide-react";

const ForgetPassword = ({type}) => {
  return (
    <AuthLayout Class={type === "vendor" ? 'bg-primary': "bg-secondry"} sideBarDesc={type === "vendor" ? 'Eliminate Security Questionnaire complexity thanks to our A.I. powered solution that helps you get customers the exact answers for their security review in no time.': "Manage your vendors’ security assessment in one place and allow them to use Komcrest A.I. powered solution to answers your questions promptly and qualitatively."}>
      <div className="flex flex-col w-[50%]">
        <p className="text-[28px] font-semibold">Did you forget your password? Enter your email to reset it</p>
        <Input
          size="md"
          type="email"
          placeholder="Email"
          className="mt-3 -ml-1"
          classNames={{ inputWrapper: "h-[40px]" }}
        />
        <Button
          radius="none"
          size="sm"
          className="mt-6 text-white px-[45px] text-sm bg-[#4fa82e] w-max rounded-[6px] -ml-1"
        >
          Receive link
        </Button>
      </div>
    </AuthLayout>
  )
}

export default ForgetPassword
