import React from "react";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/react";


const UserManagementHeader = () => {
  const router = useRouter();

  return (
    <div className="bg-gray-50">
      <div className=" py-2 w-[82%] mx-auto">
        <div className="flex justify-between w-[100%] mx-auto">
          <div className="flex flex-col justify-center ">
            <p className="font-semibold text-[16px] 2xl:text-[25px]">
              Users 
            </p>
            <p className="text-[16px] 2xl:text-[20px] mt-1">
              Invite users who will contribute to Komcrest
            </p>
          </div>

          <Button
            radius="none"
            size="md"
            className="text-white text-sm  2xl:text-[20px] text-[16px]  bg-btn-primary w-max rounded-[4px] my-4"
            onClick={() => {
              router.push("/vendor/setting/user-management/invite-user");
            }}
          >
            Invite new user
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementHeader;
