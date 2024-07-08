import React from 'react'
import { Button } from "@nextui-org/react";
import AuthLayout from "../../auth/AuthLayout";
import { useRouter } from 'next/router';

const Success = ({type, text}) => {
  const router = useRouter();
  return (
    <AuthLayout Class={type === "vendor" ? 'bg-primary': "bg-secondry"} sideBarDesc={type === "vendor" ? 'Eliminate Security Questionnaire complexity thanks to our A.I. powered solution that helps you get customers the exact answers for their security review in no time.': "Manage your vendors’ security assessment in one place and allow them to use Komcrest A.I. powered solution to answers your questions promptly and qualitatively."}>
    <div className="w-[50%]">
        <p className="text-[25px] font-semibold">
          {text}
        </p>
        <Button
          size="sm"
          className="mt-3 text-white px-8 text-base 2xl:text-[20px] bg-[#4fa82e] rounded-[6px]"
          onPress={() => router.push(`/${type}/login/access`)}
        >
          Access Komcrest
        </Button>
    </div>
  </AuthLayout>
  )
}

export default Success
