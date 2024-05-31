import React, { useCallback } from 'react'
import {Input} from "@nextui-org/react";
import { Search } from 'lucide-react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import { company_columns, company_users } from '@/utlis/data';
import { EditIcon } from '@/public/icons/EditIcon';
import {useDisclosure} from "@nextui-org/react";
import ConfirmationModal from './ConfirmationModal';




const CompaniesTable = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "company_name":
        return (
          <p>{cellValue}</p>
        );
      case "company_domain":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "company_type":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "products":
        return (
          <div className='flex flex-wrap w-[100%] gap-2 font-semibold'>
            {cellValue.map((item, index) => {
              return(
                <Chip key={index}>{item}</Chip>
              )
            })}
          </div>
        );
      case "creation_date":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "last_update":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            {/* <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip> */}
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
          <div className="text-sm font-bold cursor pointer">Update</div>
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
      <TableHeader columns={company_columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} className={`${column.uid === "products" ? 'w-[25%]' : 'w-[15%]'}`}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={company_users}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    <ConfirmationModal isOpen={isOpen} onOpenChange ={onOpenChange} />
    </div>
  )
}

export default CompaniesTable
