import VendorLayout from "@/components/vendor/shared/vendorLayout";
import UserManagement from "@/components/vendor/setting/user-management";
import UserManagementSideBar from "@/components/vendor/setting/UserManagementSideBar";
import React from 'react'
import { useCookies } from "react-cookie";

const UserEdit = () => {
  const [cookies] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const role = cookiesData?.role;

  return (
    <VendorLayout>
    <div className="flex h-full ">
      <UserManagementSideBar />
      <div className="flex-1">
      <UserManagement role={role} myAccount/>
      </div>
    </div>
  </VendorLayout>
  )
}

export default UserEdit
