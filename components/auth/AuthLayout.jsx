import React from 'react'
import { Input } from "@nextui-org/input";
import { Checkbox, Button } from "@nextui-org/react";

const AuthLayout = ({children, Class, sideBarDesc}) => {
  return (
    <div className="flex w-full min-h-screen">
    <div className={`flex flex-col justify-between w-[30%] ${Class} text-white px-10 py-10`}>
      <div className="flex flex-col justify-center flex-grow">
        <p className="text-[35px] font-bold">Komcrest</p>
        <p className="text-base 2xl:text-[20px] leading-7 mt-1">
          {sideBarDesc}
        </p>
      </div>
      <p className="text-base 2xl:text-[20px]">Komcrest 1.1.0.2024</p>
    </div>
    <div className="w-[70%] flex flex-col justify-center items-center px-10 py-10">
      {children}
    </div>
  </div>
  )
}

export default AuthLayout
