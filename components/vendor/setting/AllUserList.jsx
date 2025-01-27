import React, { useState } from "react";
import UserManagementHeader from "./UserManagementHeader";
import { useMyContext } from "@/context";
import { FilePenLine } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  CircularProgress,
  Checkbox,
  Tooltip,
  Button,
} from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import DeleteModal from "../shared/DeleteModal";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { EditIcon } from "@/public/icons/EditIcon";

const AllUserList = () => {
  const { realFormatCompanyUserData, removeCompanyUser } = useMyContext();
  const [selectedId, setSelectedId] = useState("");
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const deleteModalContent = "Are you sure to delete user?";
  const [cookies] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const userID = cookiesData?.userId;

  const handleDelete = async () => {
    removeCompanyUser(selectedId);
  };

  return (
    <div className="h-full flex flex-col">
      <UserManagementHeader />
      <div className="w-[82%] mx-auto  min-h-[0vh]  flex flex-col  mt-10">
        <div className=" flex-1 relative  overflow-auto">
          <table className="w-[100%] mx-auto">
            <thead className="block md:table-header-group sticky -top-1 z-30 ">
              <tr className="border text-standard bg-[#E5E7EB]">
                <th className="px-5 py-3 font-bold  md: text-left ">
                  First Name
                </th>
                <th className="p-1  font-bold  md:text-left ">Last Name</th>
                <th className="p-1  font-bold  md:text-left ">Email</th>
                <th className="p-1  font-bold  md:text-left ">Role</th>
                <th className=" text-center" style={{ outlineWidth: "1px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group ">
              {realFormatCompanyUserData
                ?.sort((a, b) => b.id - a.id)
                ?.map((user, index) => (
                  <tr
                    key={index}
                    className={` ${user.id == userID ? "text-gray-400" : ""} ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }  border block md:table-row text-standard`}
                  >
                    <td className="p-2 px-5 text-left break-words">
                      {user.firstName}
                    </td>

                    <td className="p-2 break-words  text-left ">
                      {user.lastName}
                    </td>

                    <td className="p-2 text-left py-4">{user.email}</td>

                    <td className="p-2  text-left ">{user.role}</td>

                    <td
                      className={`text-center flex-col flex-1 justify-center items-center`}
                    >
                      <div className="flex px-5 items-center justify-center gap-2 ">
                        {user.id !== userID && (
                          <Popover
                            placement="bottom"
                            showArrow={true}
                            isOpen={openPopoverIndex === index}
                            onOpenChange={(open) =>
                              setOpenPopoverIndex(open ? index : null)
                            }
                          >
                            <PopoverTrigger>
                              <Button className="" size="sm">
                                <Tooltip content="Edit user">
                                  <span className="text-lg cursor-pointer">
                                    <EditIcon />
                                  </span>
                                </Tooltip>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="rounded-md w-[120px] items-start text-start">
                              <div className="px-2 py-2">
                                <div
                                  className="text-standard font-bold cursor-pointer"
                                  onClick={() =>
                                    router.push(
                                      `/vendor/setting/user-management/update-user?id=${user.id}`
                                    )
                                  }
                                >
                                  Update
                                </div>
                                <div
                                  className="text-standard mt-2 text-red-500 font-bold cursor-pointer"
                                  onClick={() => {
                                    // setSelectedQuestion(data);
                                    setSelectedId(user.id);
                                    onOpen();
                                    setOpenPopoverIndex(null);
                                  }}
                                >
                                  Remove
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        handleSubmit={handleDelete}
        deleteModalContent={deleteModalContent}
      />
    </div>
  );
};

export default AllUserList;
