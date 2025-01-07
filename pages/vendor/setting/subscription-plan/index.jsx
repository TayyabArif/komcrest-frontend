import React from "react";
import UserManagementSideBar from "@/components/vendor/setting/UserManagementSideBar";
import VendorLayout from "@/components/vendor/shared/vendorLayout";
import Subscription from "@/components/vendor/setting/Subscription";
const SubscriptionPlan = () => {
  return (
    <VendorLayout>
      <div className="flex h-full ">
        <UserManagementSideBar />
        <Subscription />
      </div>
    </VendorLayout>
  );
};

export default SubscriptionPlan;
