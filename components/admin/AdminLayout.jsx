import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import { toast } from "react-toastify";

const AdminLayout = ({children}) => {
  const [cookies, setCookie, removeCookie] = useCookies(['myCookie']); 
  const [selectedItem, setSelectedItem] = useState("company")
  useEffect(() => {
    const item = localStorage.getItem("selectedSideBar")
    if (item) setSelectedItem(item)
  }, [])
 
  function handleLogout(){
    removeCookie('myCookie', { path: '/' }); 
    router.push("/admin/login")
    toast.success("Logout Successfully")
  }
  const router = useRouter();
  return (
    <div className="flex w-full min-h-screen">
      <div className={`flex flex-col gap-10 w-[15%] bg-adminPrimary px-5 py-5`}>
        <p className="text-lg text-gray-300"><span className='text-white'>Komcrest</span> Admin</p>
        <div className="flex flex-col gap-3">
          <p className={`text-lg font-normal ${selectedItem === "company" ? "text-white" : "text-gray-400"} cursor-pointer`} onClick={() => {
            router.push("/admin/company-settings")
            localStorage.setItem("selectedSideBar", "company")
            }}>Company setting</p>
          <p className={`text-lg font-normal ${selectedItem === "user" ? "text-white" : "text-gray-400"} cursor-pointer`}   onClick={() =>{
            localStorage.setItem("selectedSideBar", "user")
            router.push("/admin/user-management")
            }}>User Management</p>
              <p className={`text-lg font-normal ${selectedItem === "prompts" ? "text-white" : "text-gray-400"} cursor-pointer`}   onClick={() =>{
            localStorage.setItem("selectedSideBar", "prompts")
            router.push("/admin/prompts")
            }}>Prompts</p>

        <p className={`text-lg font-normal ${selectedItem === "Questionnaire" ? "text-white" : "text-gray-400"} cursor-pointer`}   onClick={() =>{
            localStorage.setItem("selectedSideBar", "Questionnaire")
            router.push("/admin/similarity-factor")
            }}>Questionnaire</p>
        </div>
      </div>
      <div className="w-[85%]">
        <div className=" py-3 text-right px-10 font-bold cursor-pointer"onClick={handleLogout} ><h1>Logout</h1></div>
         <div className="flex flex-col  bg-slate-100 ">
           {children}
         </div>
      </div>
  </div>
  )
}

export default AdminLayout
