import React from "react";
import VendorLayout from "../../../components/vendor/shared/vendorLayout";
import AllUserList from "@/components/vendor/setting/AllUserList";
import UserManagementSideBar from "@/components/vendor/setting/UserManagementSideBar";

const UserManagementUserList = () => {
  return (
    <VendorLayout>
      <div className="flex h-full ">
        <UserManagementSideBar />
        <div className="flex-1">
        <AllUserList />
        </div>
      </div>
    </VendorLayout>
  );
};

export default UserManagementUserList;
