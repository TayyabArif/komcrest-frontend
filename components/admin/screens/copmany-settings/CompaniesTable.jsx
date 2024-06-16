import React, { useCallback, useEffect, useState } from 'react'
import {Input} from "@nextui-org/react";
import { Search } from 'lucide-react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import { company_columns, company_users } from '@/utlis/data';
import { EditIcon } from '@/public/icons/EditIcon';
import {useDisclosure} from "@nextui-org/react";
import ConfirmationModal from '../../shared/ConfirmationModal';
import { useRouter } from 'next/router';
import { toast } from "react-toastify";



const modalDataDeactivate = {
  heading: "Deactivate Company",
  desc: " Are you sure you want to deactivate the company? The tenant will no longer be available, and users won’t be able to access their information",
  name: "Sodexo",
  confirmText: "Confirm deactivation"
}
const modalDataActivate = {
  heading: "Reactive Company",
  desc: " Are you sure you want to Reactive the company? The tenant will again be available, and users will be able to access their information",
  name: "Sodexo",
  confirmText: "Confirm Reactivation"
}

const CompaniesTable = ({allCompanies, setAllCompanies, isDeleted, setIsDeleted}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedDecativateCompany, setSelectedDecativateCompany] = useState("")
  const [updateAction, setupdateAction] = useState("")
  const router = useRouter();
  const [filteredCompanies, setFilteredCompanies] = useState(allCompanies);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL


  useEffect(() => {
    setFilteredCompanies(allCompanies)
  }, [allCompanies])
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = allCompanies.filter(company =>
        company.name.toLowerCase().includes(value)
    );
    setFilteredCompanies(filtered);
};

const handleUpdate = async () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (updateAction === "Reactive") {
    const myHeaders = new Headers();
    myHeaders.append("Host", "tenant1.localhost");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${baseUrl}/companies/${selectedDecativateCompany?.id}/reactivate`, requestOptions)
    .then((response) => {
      return response.json().then((data) => ({
        status: response.status,
        ok: response.ok,
        data,
      }));
    })
    .then(({ status, ok, data }) => {
      if (ok) {
        toast.success("Company activated successfully")
        setIsDeleted(!isDeleted)
      } else {
        toast.error(data?.error || "Error While Activating company")
      }
    })
    .catch((error) => {
      console.error("Network error:", error);
    })
  } else {
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };
  
    fetch(`${baseUrl}/companies/${selectedDecativateCompany?.id}`, requestOptions)
      .then((response) => {
        return {
          status: response.status,
          ok: response.ok,
        }
      })
      .then(({ status, ok }) => {
        if (ok) {
          toast.success("Company deactivated successfully")
          setIsDeleted(!isDeleted)
        } else {
          toast.error("Error While deactivating company")
        }
      })
      .catch((error) => console.error(error));
  }
}

  const renderCell = useCallback((company, columnKey) => {
    const cellValue = company[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <p>{cellValue}</p>
        );
      case "subdomain":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "companyType":
        return (
          <div className="flex flex-col">
            {cellValue}
          </div>
        );
      case "Products":
        return (
          <div className='flex flex-wrap w-[100%] gap-2 font-semibold'>
            {cellValue.map((item, index) => {
              return(
                <Chip key={index}>{item.name}</Chip>
              )
            })}
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
      case "status":
        return (
          <div className="flex flex-col">
            {!company?.deletedAt ?  
            <Chip color="success" size="sm">Active</Chip> :
            <Chip color="danger" size="sm">Deactive</Chip>}
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
                   onClick={() => router.push(`/admin/company-settings/update-company?id=${company.id}`)}
                  >Update</div>
                  {!company?.deletedAt ?  
                  <div className="text-sm mt-2 text-red-500 font-bold cursor-pointer" onClick={() => {
                    setupdateAction("Deactivate")
                    setSelectedDecativateCompany(company)
                    onOpen()
                  }
                    }>Deactivate</div>
                    :
                    <div className="text-sm mt-2 text-green-500 font-bold cursor-pointer" onClick={() => {
                      setupdateAction("Reactive")
                      setSelectedDecativateCompany(company)
                      onOpen()
                    }
                      }>Reactive</div>
                  }
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
    <div className='flex flex-col gap-2 bg-gray-200 pl-20 pr-10 py-3 min-h-screen'>
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
      {allCompanies.length > 0 ?
      <Table aria-label="Example table with custom cells" isHeaderSticky={true} classNames={{
        tr: "border border-1.5 border-bray-400 border-t-0 h-[70px]",
        th: "!h-[40px]"

      }}>
      <TableHeader columns={company_columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} className={`${column.uid === "Products" ? 'w-[25%]' : 'w-[15%]'}`}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={filteredCompanies} emptyContent="No Data Found">
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
    <ConfirmationModal isOpen={isOpen} onOpenChange ={onOpenChange} data={updateAction === "Reactive" ? modalDataActivate : modalDataDeactivate} handleSubmit={handleUpdate} name={selectedDecativateCompany?.name}/>
    </div>
  )
}

export default CompaniesTable
