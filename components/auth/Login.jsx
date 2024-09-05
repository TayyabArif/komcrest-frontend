import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import AuthLayout from "./AuthLayout";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useCookies } from 'react-cookie';
import { useMyContext } from "@/context";



const Login = ({ type }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['myCookie']);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const { setDataUpdated ,dataUpdated ,setQuestionnaireUpdated } = useMyContext();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: formData?.email,
      password: formData?.password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // fetch("http://localhost:3001/api/users/login", requestOptions)
    //   .then((response) => response.text())
    //   .then((result) => {
    //     // toast.success("Reset password email sent successfully")
    //     console.log("tayyab",result)
    //   })
    //   .catch((error) => console.error(error))
    //   .finally(setIsLoading(false));
    fetch(`${baseUrl}/users/login`, requestOptions)
      .then((response) => {
        return response.json().then((data) => ({
          status: response.status,
          ok: response.ok,
          data,
        }));
      })
      .then(({ status, ok, data }) => {
        if (ok) {
          const userData = {
            token: data.token,
            role: data.user.role,
            companyType: data.user?.Company?.companyType,
            companyId : data.user.companyId,
            userName : data.user.firstName,
            userId :  data.user.id
          };
         
          setCookie('myCookie',  userData, { path: '/' });
          setDataUpdated(!dataUpdated)
          setQuestionnaireUpdated((prev)=>!prev)
          console.log("Success:", data);
          if (data?.user?.Company?.companyType === "vendor") {
            router.push("/vendor/document");
          } else {
            router.push("/");
          }
        } else {
          toast.error(data?.error || "Email or password is incorrect");
          console.error("Error:", data);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // router.push(`/`)
  };
  return (
    <AuthLayout
      Class={type === "vendor" ? "bg-primary" : "bg-secondry"}
      sideBarDesc={
        type === "vendor"
          ? "Eliminate Security Questionnaire complexity thanks to our A.I. powered solution that helps you get customers the exact answers for their security review in no time."
          : "Manage your vendors’ security assessment in one place and allow them to use Komcrest A.I. powered solution to answers your questions promptly and qualitatively."
      }
    >
      <div className="flex flex-col w-[50%]">
        <p className="text-[30px] font-semibold">Log in to Komcrest</p>
        <Input
          isRequired
          value={formData.email}
          onChange={handleChange}
          name="email"
          size="md"
          type="email"
          placeholder="Email"
          className="mt-6 -ml-1"
          classNames={{ inputWrapper: "h-[50px]", input: "text-base 2xl:text-[20px]", errorMessage: "text-base 2xl:text-[20px]" }}
        />
        <Input
          isRequired
          value={formData.password}
          onChange={handleChange}
          name="password"
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
          classNames={{ inputWrapper: "h-[50px]", input: "text-base 2xl:text-[20px]" }}
          className="mt-4 -ml-1"
        />
        <p
          className="underline mt-1 cursor-pointer text-base 2xl:text-[20px]"
          onClick={() =>
            router.push(`/${type}/login/password-recovery/request`)
          }
        >
          Forget password
        </p>
        <Button
          radius="none"
          size="sm"
          className="mt-4 text-white px-[45px] text-base 2xl:text-[20px] bg-[#4fa82e] w-max rounded-[4px] -ml-1"
          isDisabled={!formData.email || !formData.password || isLoading}
          isLoading={isLoading}
          onPress={handleSubmit}
        >
          Login
        </Button>
      </div>
    </AuthLayout>
  );
};

export default Login;
