import React from 'react'
import { Button } from "@nextui-org/react";
import AuthLayout from './AuthLayout';

const RequestSuccess = ({type, text}) => {
  return (
    <AuthLayout Class={type === "vendor" ? 'bg-primary': "bg-secondry"} sideBarDesc={type === "vendor" ? 'Eliminate Security Questionnaire complexity thanks to our A.I. powered solution that helps you get customers the exact answers for their security review in no time.': "Manage your vendors’ security assessment in one place and allow them to use Komcrest A.I. powered solution to answers your questions promptly and qualitatively."}>
    <div className="w-[80%]">
        <p className="text-[25px] font-[550]">
          Password recovery email has been sent to your email address. Please check your inbox for further details
        </p>
    </div>
  </AuthLayout>
  )
}

export default RequestSuccess
