import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Checkbox, Button } from "@nextui-org/react";
import AuthLayout from "./AuthLayout";
import { toast } from "react-toastify";
import { useRouter } from 'next/router';
import { Eye, EyeOff } from "lucide-react";

const CreatePassword = ({type, isNew}) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const { token } = router.query;
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    isPasswordStrong: true
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      isPasswordStrong: name === 'password' ? isPasswordStrong(value) : prevState.isPasswordStrong
    }));
  };
  const handleSubmit= async () => {
    if (formData?.password !== formData?.confirmPassword) {
      toast.error("Password do not match")
      return;
    }
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  token: token,
  newPassword: formData?.password
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch(`${baseUrl}/users/reset-password`, requestOptions)
  .then((response) => response.text())
  .then((result) => {
    console.log(result)
    toast.success("Your password has been reset")
    router.push(`/${type}/login/password-confimation/success`)
  })
  .catch((error) => console.error(error));

  }
  const isPasswordStrong = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'<>?,.])[A-Za-z\d!@#$%^&*()_+{}":;'<>?,.]{8,}$/;
    return regex.test(password);
  };

  const [isPassowrdVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPassowrdVisible, setIsConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPassowrdVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPassowrdVisible);
  return (
    <AuthLayout Class={type === "vendor" ? 'bg-primary': "bg-secondry"} sideBarDesc={type === "vendor" ? 'Eliminate Security Questionnaire complexity thanks to our A.I. powered solution that helps you get customers the exact answers for their security review in no time.': "Manage your vendors’ security assessment in one place and allow them to use Komcrest A.I. powered solution to answers your questions promptly and qualitatively."}>
      <div className="w-[50%]">
          <p className="text-[30px] font-semibold">
            {isNew ? "You have been invited to join your team in Komcrest" : "Create a new password"}
          </p>
          <Input
            isRequired
            value={formData.password}
            onChange={handleChange}
            name="password"
            size="md"
            type={isPassowrdVisible ? "text" : "password"}
            placeholder="Create a password"
            className="mt-8"
            classNames={{ inputWrapper: "h-[50px]" }}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {isPassowrdVisible ? <EyeOff /> : <Eye />}
              </button>
            }
          />
          <Input
            isRequired
            value={formData.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            size="md"
            type={isConfirmPassowrdVisible ? "text" : "password"}
            placeholder="confirm password"
            className="mt-5"
            classNames={{ inputWrapper: "h-[50px]" }}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleConfirmPasswordVisibility}
              >
                {isConfirmPassowrdVisible ? <EyeOff /> : <Eye />}
              </button>
            }

          />
          {isNew &&
            <Checkbox size="md" className="mt-2" classNames={{ label: "mt-5" }}>
              {" "}
              I agree to Komcrest’s <a className="underline">
                Terms of Services
              </a>{" "}
              including the <a className="underline">Privacy Policy</a>{" "}
            </Checkbox>
          }
          <Button
            radius="sm"
            size="sm"
            className={`${isNew ? "mt-2" :"mt-7"} text-white px-8 text-sm bg-[#4fa82e]`}
            isDisabled={!formData?.password || !formData?.confirmPassword || isLoading || !formData.isPasswordStrong}
            isLoading={isLoading}
            onPress={handleSubmit}
          >
            {isNew ? "Register": "Update password"}
          </Button>
          {(!formData.isPasswordStrong && formData?.password.length > 0) && (
            <p className="text-red-500 text-sm mt-2">
                Password must be at least 8 characters long and include at least one letter, one number, and one special character.
            </p>
          )}
      </div>
    </AuthLayout>
  );
};

export default CreatePassword;
