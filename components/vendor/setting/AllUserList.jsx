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
  Button,
} from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import DeleteModal from "../shared/DeleteModal";
import { useRouter } from "next/router";

const AllUserList = () => {
  const { companyUserData } = useMyContext();
  const [selectedId, setSelectedId] = useState();
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
  console.log(">>>>>>>>>>>>>,", companyUserData);
  const deleteModalContent = "Are you sure to delete user?";


  const handleDelete = () => {
    alert("ok")
  }

  return (
    <div>
      <UserManagementHeader />

      <div className="overflow-auto flex-1 relative  ">
        <table className="w-[82%] mx-auto mt-10">
          <thead className="block md:table-header-group sticky -top-1 z-30 ">
            <tr className="border text-[16px] 2xl:text-[20px] ">
              <th className="bg-gray-200  px-2 py-2 font-bold md:border md: text-left ">
                First Name
              </th>
              <th className="bg-gray-200 p-1  font-bold md:border md: text-left ">
                Last Name
              </th>
              <th className="bg-gray-200 p-1  font-bold md:border md: text-left ">
                Email
              </th>
              <th className="bg-gray-200 p-1  font-bold md:border md: text-left ">
                Role
              </th>
              <th
                className="px-4    pr-9  text-center  bg-gray-200"
                style={{ outlineWidth: "1px" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group overflow-none">
            {companyUserData
              ?.sort((a, b) => b.id - a.id)
              ?.map((item, index) => (
                <tr
                  key={index}
                  className={` ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }  border  md:border-none block md:table-row text-[16px] 2xl:text-[20px]`}
                >
                  <td className="p-2 md:border md: text-left break-words">
                    aaa
                  </td>

                  <td className="p-2 md:border  break-words  text-left ">
                    llll
                  </td>

                  <td className="p-2 border   text-left py-3">DLWDWDLD</td>

                  <td className="p-2 md:border md: text-left ">dwdw</td>

                  <td
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                    style={{ outlineWidth: "1px" }}
                  >
                    <Popover
                      className="rounded-[0px]"
                      isOpen={openPopoverIndex === index}
                      onOpenChange={(open) =>
                        setOpenPopoverIndex(open ? index : null)
                      }
                    >
                      <PopoverTrigger>
                        <FilePenLine
                          size={25}
                          className="cursor-pointer"
                          color="#2457d7"
                          strokeWidth={2}
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="px-3 py-2 space-y-2">
                          <div
                            className="text-small cursor-pointer 2xl:text-[20px]"
                            onClick={() =>
                              router.push(
                                `/vendor/onlineResource/update?id=${item.id}`
                              )
                            }
                          >
                            Update
                          </div>
                          <div
                            className="text-small text-red-600 cursor-pointer 2xl:text-[20px]"
                            onClick={() => {
                              // setSelectedQuestion(data);
                              setSelectedId(item.id);
                              onOpen();
                              setOpenPopoverIndex(null);
                            }}
                          >
                            Delete
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
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
