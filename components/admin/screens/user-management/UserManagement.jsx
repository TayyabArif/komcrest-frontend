import React, { useEffect, useState } from 'react'
import { Button, CircularProgress } from "@nextui-org/react";
import UsersTable from './UsersTable';
import { useRouter } from 'next/router';
import { useCookies } from "react-cookie";

const UserManagement = () => {
  const [cookies] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [allUsers, setAllUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  useEffect(() => {
    getAllUsers();
  }, [isDeleted]);
  const getAllUsers = async () => {
    const token = cookiesData.token;
    setIsLoading(true)
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow"
    };

    fetch(`${baseUrl}/users`, requestOptions)
    .then((response) => {
      return response.json().then((data) => ({
        status: response.status,
        ok: response.ok,
        data,
      }));
    })
      .then(({ status, ok, data }) => {
        if (ok) {
          setAllUsers(data)
        } else {
          toast.error("Error while fetching users, please contact support team")
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className='flex flex-col w-full bg-white'>
      <div className='flex justify-between items-start bg-gray-50 pl-20 pr-10 py-6'>
        <div>
          <p className='font-semibold'>
            Manage Komcrestusers
          </p>
          <p>
            Invite and revoke access to users
          </p>
        </div>
        <Button
          radius="none"
          size="sm"
          className="text-white px-[25px] text-sm bg-btn-primary w-max rounded-[4px] -ml-1"
          onClick={() => router.push("/admin/user-management/create-user")}
        >
          Invite Users
        </Button>
      </div>
      {isLoading ?
        <div className='flex flex-col gap-2 bg-gray-200 items-center justify-center pl-20 pr-10 py-3 min-h-screen'>
          <CircularProgress label="Fetching Users..." size="lg"/>
        </div>
      :
        <UsersTable  allUsers={allUsers} setAllUsers={setAllUsers} isDeleted={isDeleted} setIsDeleted ={setIsDeleted}/>
      }
  </div>
  )
}

export default UserManagement
