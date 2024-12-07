import React from 'react'
import VendorLayout from "../../../components/vendor/shared/vendorLayout";
import UserManagement from '@/components/vendor/setting/user-management';
import UserManagementSideBar from '@/components/vendor/setting/UserManagementSideBar';

const InviteUser = () => {
  return (
     <VendorLayout>
     <div className="flex h-full ">
       <UserManagementSideBar />
       <div className="flex-1">
       <UserManagement />
       </div>
     </div>
   </VendorLayout>
  )
}

export default InviteUser