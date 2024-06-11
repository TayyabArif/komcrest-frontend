import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Login from './Login';

const AdminLogin = () => {
  const router = useRouter();
  return (
    <div className="flex w-full min-h-screen">
    <div className={`flex flex-col justify-between w-[30%] bg-adminPrimary text-white px-10 py-10`}>
      <div className="flex flex-col justify-center flex-grow">
        <p className="text-[35px] font-bold">Komcrest</p>
        <p className="text-sm">
        Eliminate Security Questionnaire complexity thanks to our A.I. powered solution that helps you get customers the exact answers for their security review in no time.
        </p>
      </div>
      <p className="text-sm">Komcrest 1.1.0.2024</p>
    </div>
    <div className="w-[70%] flex flex-col justify-center items-center px-10 py-10">
      <Login />
    </div>
  </div>
  )
}

export default AdminLogin
