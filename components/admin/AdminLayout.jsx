import React, { useState } from 'react'

const AdminLayout = ({children}) => {
  const [selectedItem, setSelectedItem] = useState("company")
  return (
    <div className="flex w-full min-h-screen">
      <div className={`flex flex-col gap-10 w-[15%] bg-adminPrimary px-5 py-5`}>
        <p className="text-lg text-gray-300"><span className='text-white'>Komcrest</span> Admin</p>
        <div className="flex flex-col gap-3">
          <p className={`text-lg font-normal ${selectedItem === "company" ? "text-white" : "text-gray-400"}`} onClick={() => setSelectedItem("company")}>Company setting</p>
          <p className={`text-lg font-normal ${selectedItem === "user" ? "text-white" : "text-gray-400"}`}   onClick={() => setSelectedItem("user")}>User Management</p>
        </div>
      </div>
      <div className="w-[85%] flex flex-col items-center">
        {children}
      </div>
  </div>
  )
}

export default AdminLayout
