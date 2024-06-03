import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import UsersDetailsCard from "./UsersDetailsCard";
import UsersSettingsCard from "./UsersSettingsCard";

const UpdateUser = () => {
  const [isClick, setClick] = useState(false)
  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex justify-end font-bold pl-20 pr-10 py-2">Logout</div>
      <div className="flex flex-col justify-between w-full gap-5 pl-20 pr-10 py-10 bg-gray-200 min-h-screen ">
        <div className="flex items-start justify-start w-full gap-10 pl-20">
          <UsersDetailsCard action="update"/>
          <UsersSettingsCard action="update"/>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
