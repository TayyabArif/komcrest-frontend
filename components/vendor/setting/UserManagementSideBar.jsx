import React from 'react'

const UserManagementSideBar = () => {
  return (
    <div className="bg-[#F6F7F9] w-[18%] h-full">
    <div
      className={`flex gap-1 items-center px-4 my-2 cursor-pointer ${
        true
          ? "bg-[#2457d7] text-white shadow-md rounded"
          : "hover:bg-gray-200 hover:shadow-md"
      }`}
      onClick={() => {
        router.push("/vendor/user-management");
      }}
    >
      <h1 className="text-[16px] 2xl:text-[20px] py-2">
        User Management
      </h1>
    </div>
  </div>
  )
}

export default UserManagementSideBar