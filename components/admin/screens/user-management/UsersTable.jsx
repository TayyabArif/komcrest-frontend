import React, { useCallback, useEffect, useState } from 'react'
import {Input} from "@nextui-org/react";
import { Search } from 'lucide-react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import { users_columns, users } from '@/utlis/data';
import { EditIcon } from '@/public/icons/EditIcon';
import {useDisclosure} from "@nextui-org/react";
import ConfirmationModal from '../../shared/ConfirmationModal';
import { useRouter } from 'next/router';
import { toast } from "react-toastify";


const UsersTable = ({allUsers, setAllUsers, isDeleted, setIsDeleted}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const router = useRouter();
  const [selectedDecativateUser, setSelectedDecativateUser] = useState(null)
  const [filteredUsers, setFilteredUsers] = useState(allUsers);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  let modalData = {
    heading: "Deactivate user",
    desc: " Are you sure you want to deactivate user? The user will no long be able to login to komcrest.",
    // name: `${formData?.firstName} ${formData?.lastName} `
    confirmText: "Confirm deactivation"
  }
  useEffect(() => {
    setFilteredUsers(allUsers)
  }, [allUsers])
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = allUsers?.filter(user =>
        user.firstName.toLowerCase().includes(value) ||  user.lastName.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
};

const handleDelete = async () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(`${baseUrl}/users/${selectedDecativateUser?.id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log("$$$$$$$$$", result)
      toast.success("Company deleted successfully")
      setIsDeleted(!isDeleted)
    })
    .catch((error) => console.error(error));
}

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "company":
        return (
          <p>{user?.Company?.name}</p>
        );
      case "firstName":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "lastName":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "email":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "position":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "role":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "createdAt":
        const date = new Date(cellValue);
        const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
        return (
          <div className="flex flex-col">
            {formattedDate}
          </div>
        );
      case "updatedAt":
        const update_date = new Date(cellValue);
        const update_formattedDate = `${update_date.getFullYear()}/${String(update_date.getMonth() + 1).padStart(2, '0')}/${String(update_date.getDate()).padStart(2, '0')}`;
        return (
          <div className="flex flex-col">
            {update_formattedDate}
          </div>
        );
      case "invitationStatus":
        return (
          <div className="flex flex-col">
            {cellValue || "sent"}
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Popover placement="bottom" showArrow={true} >
              <PopoverTrigger>
                <Button className='' size="sm">
                <Tooltip content="Edit user">
                      <span className="text-lg cursor-pointer">
                        <EditIcon />
                      </span>
                    </Tooltip>
                </Button>
              </PopoverTrigger>
              <PopoverContent className='rounded-sm w-[120px] items-start text-start'>
                <div className="px-2 py-2">
                  <div className="text-sm font-bold cursor-pointer"
                  onClick={() => router.push(`/admin/user-management/update-user?id=${user.id}`)}
                  >Update</div>
                  <div className="text-sm mt-2 text-red-500 font-bold cursor-pointer"
                  onClick={() => {
                    setSelectedDecativateUser(user)
                    onOpen()
                  }}
                  >Deactivate</div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className='flex flex-col gap-2 bg-gray-200 pl-20 pr-10 py-3'>
      <Input
        onChange={handleSearch}
        variant="bordered"
        placeholder="Search"
        endContent={
          <Search size={18}/>
        }
        type="text"
        classNames={{inputWrapper: "bg-white"}}
        className="max-w-xs"
      />
      {allUsers.length > 0 ?
      <Table aria-label="Example table with custom cells" isHeaderSticky={true} classNames={{
        tr: "border border-1.5 border-bray-400 border-t-0 h-[70px]",
        th: "!h-[40px]"

      }}>
      <TableHeader columns={users_columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} className={`${column.uid === "email" ? 'w-[15%]' : 'w-[9%]'}`}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={filteredUsers} emptyContent="No Data Found">
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    :
     <div className='w-full flex justify-center p-5 shadow-md rounded-lg bg-white items-center text-center gap-2 text-xl text-gray-700 mt-20'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
      <p>No Data Found</p>
    </div>
    }
    <ConfirmationModal isOpen={isOpen} onOpenChange ={onOpenChange} data={modalData} handleSubmit={handleDelete} name={`${selectedDecativateUser?.firstName} ${selectedDecativateUser?.lastName}`}/>
    </div>
  )
}

export default UsersTable
