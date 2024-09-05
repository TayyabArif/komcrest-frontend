import React from 'react'
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import AuthLayout from "./AuthLayout";

const CreateNewPassword = ({type}) => {
  return (
    <AuthLayout Class={type === "vendor" ? 'bg-primary': "bg-secondry"} sideBarDesc={type === "vendor" ? 'Eliminate Security Questionnaire complexity thanks to our A.I. powered solution that helps you get customers the exact answers for their security review in no time.': "Manage your vendors’ security assessment in one place and allow them to use Komcrest A.I. powered solution to answers your questions promptly and qualitatively."}>
      <div className="w-[50%]">
          <p className="text-[30px] font-semibold">
            Create a new password
          </p>
          <Input
            size="md"
            type="text"
            placeholder="Create a password"
            className="mt-8"
            classNames={{ inputWrapper: "h-[50px]" }}
          />
          <Input
            size="md"
            type="text"
            placeholder="Confirm password"
            className="mt-5"
            classNames={{ inputWrapper: "h-[50px]" }}
          />
          <Button
            size="sm"
            className="mt-7 text-white px-8 text-sm bg-[#4fa82e] rounded-[6px]"
          >
            Register
          </Button>
      </div>
    </AuthLayout>
  )
}

export default CreateNewPassword
