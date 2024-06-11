import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from 'next/router';
import { toast } from "react-toastify";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      email: formData?.email,
      password: formData?.password
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:3001/api/users/login", requestOptions)
      .then((response) => {
        return response.json().then((data) => ({
          status: response.status,
          ok: response.ok,
          data,
        }));
      })
      .then(({ status, ok, data }) => {
        if (ok) {
          console.log("Success:", data);
        } else {
          toast.error(data?.error || "Email or password is incorrect")
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
  }
  return (
    <div className="flex flex-col w-[50%]">
    <p className="text-[30px] font-semibold">Log in to Komcrest Admin</p>
    <Input
      isRequired
      value={formData.email}
      onChange={handleChange}
      name="email"
      size="md"
      type="email"
      placeholder="Email"
      className="mt-6 -ml-1"
      classNames={{ inputWrapper: "h-[50px]" }}
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
      classNames={{ inputWrapper: "h-[50px]" }}
      className="mt-4 -ml-1"
    />
    <Button
      radius="none"
      size="sm"
      className="mt-4 text-white px-[45px] text-sm bg-[#4fa82e] w-max rounded-[4px] -ml-1"
      isDisabled={!formData.email || !formData.password || isLoading}
      isLoading={isLoading}
      onPress={handleSubmit}
    >
      Login
    </Button>
  </div>
  )
}

export default Login
