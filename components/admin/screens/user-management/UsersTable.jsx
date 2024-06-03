import React, { useCallback } from 'react'
import {Input} from "@nextui-org/react";
import { Search } from 'lucide-react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import { users_columns, users } from '@/utlis/data';
import { EditIcon } from '@/public/icons/EditIcon';
import {useDisclosure} from "@nextui-org/react";
import ConfirmationModal from '../../shared/ConfirmationModal';
import { useRouter } from 'next/router';


const modalData = {
  heading: "Deactivate user",
  desc: " Are you sure you want to deactivate user? The user will no long be able to login to komcrest.",
  name: "Richard Branco",
  confirmText: "Confirm deactivation"
}

const UsersTable = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const router = useRouter();

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "company":
        return (
          <p>{cellValue}</p>
        );
      case "f_name":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "l_name":
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
      case "c_date":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "l_update":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "i_status":
        return (
          <div className="flex flex-col">
            {cellValue}
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
                  onClick={() => router.push("/admin/user-management/update-user")}
                  >Update</div>
                  <div className="text-sm mt-2 text-red-500 font-bold cursor-pointer" onClick={onOpen}>Deactivate</div>
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
        variant="bordered"
        placeholder="Search"
        endContent={
          <Search size={18}/>
        }
        type="text"
        classNames={{inputWrapper: "bg-white"}}
        className="max-w-xs"
      />
      <Table aria-label="Example table with custom cells" isHeaderSticky={true} classNames={{
        tr: "border border-1.5 border-bray-400 border-t-0 h-[70px]",
        th: "!h-[40px]"

      }}>
      <TableHeader columns={users_columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} className={`${column.email === "products" ? 'w-[15%]' : 'w-[9%]'}`}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    <ConfirmationModal isOpen={isOpen} onOpenChange ={onOpenChange} data={modalData}/>
    </div>
  )
}

export default UsersTable
