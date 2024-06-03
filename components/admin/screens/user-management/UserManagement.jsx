import React from 'react'
import { Button } from "@nextui-org/react";
import UsersTable from './UsersTable';
import { useRouter } from 'next/router';

const UserManagement = () => {
  const router = useRouter();
  return (
    <div className='flex flex-col w-full bg-white'>
      <div className='flex justify-end font-bold pl-20 pr-10 py-2'>Logout</div>
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
      <UsersTable />
  </div>
  )
}

export default UserManagement
