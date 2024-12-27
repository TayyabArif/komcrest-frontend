import React from "react";
import UserManagementSideBar from "@/components/vendor/setting/UserManagementSideBar";
import VendorLayout from "@/components/vendor/shared/vendorLayout";
import ChangeSubscription from "@/components/vendor/setting/ChangeSubscription"; 
const ChangePlan = () => {
  return (
    <VendorLayout>
      <div className="flex h-full ">
        <UserManagementSideBar />
        <ChangeSubscription />
      </div>
    </VendorLayout>
  );
};

export default ChangePlan;
