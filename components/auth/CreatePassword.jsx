import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Checkbox, Button } from "@nextui-org/react";
import AuthLayout from "./AuthLayout";
import { toast } from "react-toastify";
import { useRouter } from 'next/router';
import { Eye, EyeOff } from "lucide-react";
import TermsAndServicesModal from "../admin/shared/TermsAndServicesModal";
import {useDisclosure} from "@nextui-org/react";

const modalData ={
  privacyPolicy: {
    heading: "Komcrest Privacy Policy",
    desc: "Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur  proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam. Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur  proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam."
  },
  termsOfServices: {
    heading: "Komcrest Terms of Services",
    desc: " Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur  proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam. Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur  proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam."
  }
}
const CreatePassword = ({type, isNew}) => { 
  const [isLoading, setIsLoading] = useState(false)
  const [isTermsService, setIsTermsService] = useState(true)
  const [isPrivacyPolicy, setIsPrivacyPolicy] = useState(true)
  const [isTermsServiceClick, setIsTermsServiceClick] = useState(false)
  const [isPrivacyPolicyClick, setIsPrivacyPolicyClick] = useState(false)
  const [isTermsAggree, setIsTermsAggree] = useState(false);
  const [isPrivacyAggree, setIsPrivacyAggree] = useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
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
    if(isNew) {
      if (isTermsService) {
        if(!isTermsAggree) {
          toast.error("You need to aggree with terms and conditions to proceed ")
          return
        }
      }
      if (isPrivacyPolicy) {
        if(!isPrivacyAggree) {
          toast.error("You need to aggree with Komcrest privacy policy to proceed ")
          return
        }
      }
    }
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
  .then((response) => {
    return response.json().then((data) => ({
      status: response.status,
      ok: response.ok,
      data,
    }));
  })
  .then(({ status, ok, data }) => {
    if (ok) {
      console.log(data)
      toast.success("Your password has been reset")
      router.push(`/${type}/login/password-confimation/success`)
    } else{
      toast.error(data?.error)
    }
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

  useEffect(() => {
    if(token) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`${baseUrl}/company-from-token/${token}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const companyData = JSON.parse(result)
          setIsTermsService(companyData?.termsServices)
          setIsPrivacyPolicy(companyData?.privacyPolicy)
          console.log(companyData);
        })
        .catch((error) => console.error(error));
    }
  }, [token])
  const handleAggree = (value) => {
    if (value === "terms") {
      setIsTermsServiceClick(false)
      setIsTermsAggree(true)
    } else {
      setIsPrivacyAggree(true)
      setIsPrivacyPolicyClick(false)
    }
  }
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
            classNames={{ inputWrapper: "h-[50px]", input: "text-base 2xl:text-[20px]", errorMessage: "text-base 2xl:text-[20px]" }}
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
            name="ConfirmPassword"
            size="md"
            type={isConfirmPassowrdVisible ? "text" : "password"}
            placeholder="confirm password"
            className="mt-5"
            classNames={{ inputWrapper: "h-[50px]", input: "text-base 2xl:text-[20px]" }}
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
            <div className="flex flex-col">
              {isTermsService &&
                <Checkbox isSelected={isTermsAggree} onChange={() => setIsTermsAggree(!isTermsAggree)} size="md" className="mt-2" classNames={{ label: "mt-0 text-base 2xl:text-[20px]" }}>
                  {" "}
                  I agree to Komcrest’s <a className="underline text-base 2xl:text-[20px]" onClick={() => {
                    setIsTermsServiceClick(true)
                    onOpen()
                    }}>
                    Terms of Services
                  </a>
                </Checkbox>
              }
              {isPrivacyPolicy &&
                <Checkbox isSelected={isPrivacyAggree} onChange={() => setIsPrivacyAggree(!isPrivacyAggree)} size="md" className="mt-2" classNames={{ label: "mt-0 text-base 2xl:text-[20px]" }}>
                  {" "}
                  I agree to Komcrest’s <a className="underline" onClick={() => {
                    setIsPrivacyPolicyClick(true)
                    onOpen()
                    }}
                    >Privacy Policy</a>{" "}
                </Checkbox>
              }
            </div>
          }
          <Button
            radius="sm"
            size="sm"
            className={`${isNew ? "mt-4" :"mt-7"} text-white px-8 text-base 2xl:text-[20px] bg-[#4fa82e]`}
            isDisabled={!formData?.password || !formData?.confirmPassword || isLoading || !formData.isPasswordStrong
            }
            isLoading={isLoading}
            onPress={handleSubmit}
          >
            {isNew ? "Register": "Update password"}
          </Button>
          {(!formData.isPasswordStrong && formData?.password.length > 0) && (
            <p className="text-red-500 text-base 2xl:text-[20px] mt-2">
                Password must be at least 8 characters long and include at least one letter, one number, and one special character.
            </p>
          )}
      </div>
      {isTermsServiceClick &&
      <TermsAndServicesModal isOpen={isOpen} onOpenChange ={onOpenChange} data={modalData.termsOfServices} handleSubmit={() => handleAggree("terms")} /> }
      {isPrivacyPolicyClick &&
      <TermsAndServicesModal isOpen={isOpen} onOpenChange ={onOpenChange} data={modalData.privacyPolicy} handleSubmit={() => handleAggree("privacy")} /> }

    </AuthLayout>
  );
};

export default CreatePassword;
