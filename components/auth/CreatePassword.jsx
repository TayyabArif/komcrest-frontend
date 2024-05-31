import React from "react";
import { Input } from "@nextui-org/input";
import { Checkbox, Button } from "@nextui-org/react";
import AuthLayout from "./AuthLayout";

const CreatePassword = ({type}) => {
  return (
    <AuthLayout Class={type === "vendor" ? 'bg-primary': "bg-secondry"} sideBarDesc={type === "vendor" ? 'Eliminate Security Questionnaire complexity thanks to our A.I. powered solution that helps you get customers the exact answers for their security review in no time.': "Manage your vendors’ security assessment in one place and allow them to use Komcrest A.I. powered solution to answers your questions promptly and qualitatively."}>
      <div className="w-[50%]">
          <p className="text-[30px] font-semibold">
            You have been invited to join your team in Komcrest
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
            placeholder="confirm password"
            className="mt-5"
            classNames={{ inputWrapper: "h-[50px]" }}
          />
          <Checkbox size="md" className="mt-2" classNames={{ label: "mt-5" }}>
            {" "}
            I agree to Komcrest’s <a className="underline">
              Terms of Services
            </a>{" "}
            including the <a className="underline">Privacy Policy</a>{" "}
          </Checkbox>
          <Button
            radius="sm"
            size="sm"
            className="mt-2 text-white px-8 text-sm bg-[#4fa82e]"
          >
            Register
          </Button>
      </div>
    </AuthLayout>
  );
};

export default CreatePassword;
