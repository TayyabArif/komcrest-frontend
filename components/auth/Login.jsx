import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import AuthLayout from "./AuthLayout";
import { Eye, EyeOff } from "lucide-react";

const Login = ({type}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <AuthLayout Class={type === "vendor" ? 'bg-primary': "bg-secondry"} sideBarDesc={type === "vendor" ? 'Eliminate Security Questionnaire complexity thanks to our A.I. powered solution that helps you get customers the exact answers for their security review in no time.': "Manage your vendors’ security assessment in one place and allow them to use Komcrest A.I. powered solution to answers your questions promptly and qualitatively."}>
      <div className="flex flex-col w-[50%]">
        <p className="text-[30px] font-semibold">Log in to Komcrest</p>
        <Input
          size="md"
          type="email"
          placeholder="Email"
          className="mt-6 -ml-1"
          classNames={{ inputWrapper: "h-[50px]" }}
        />
        <Input
          size="md"
          placeholder="Password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? <EyeOff /> : <Eye />}
            </button>
          }
          type={isVisible ? "text" : "password"}
          classNames={{ inputWrapper: "h-[50px]" }}
          className="mt-4 -ml-1"
        />
        <a className="underline mt-1">Forget password</a>
        <Button
          radius="none"
          size="sm"
          className="mt-4 text-white px-[45px] text-sm bg-[#4fa82e] w-max rounded-[4px] -ml-1"
        >
          Login
        </Button>
      </div>
    </AuthLayout>
  );
};

export default Login;
