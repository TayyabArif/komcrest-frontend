import React, { useEffect, useState } from 'react'
import {Input, Checkbox, Select, SelectItem} from "@nextui-org/react";

// const companies = [
//   {key: "google", label: "Google"},
//   {key: "sodexo", label: "Sodexo"},
//   {key: "Staffbase", label: "staffbase"},
// ];

const companies = [
  {id: "1", label: "Google"},
  {id: "2", label: "Sodexo"},
  {id: "3", label: "staffbase"},
];
const UsersDetailsCard = ({handleChange, formData, allCompanies ,isDisabled , role , isEdit}) => {

const id = 50
  return (
    <div className='flex flex-col bg-white rounded w-[45%] min-h-[550px] mt-12 pb-10'>
    <p className='px-4 py-4 border border-1.5 border-b-gray-200 text-standard  border-r-0 border-l-0 border-t-0 font-semibold'> {`${isEdit ? "Update" : "Invite new"} user`}</p>
    <div className='mt-7 px-4'>
      <Select
        label="Company"
        isDisabled={isDisabled}
        placeholder="Select company"
        className="max-w-sm"
        labelPlacement='outside'
        variant="bordered"
        radius='sm'
        size='md'
        scrollShadowProps={{
          isEnabled: false
        }}
        classNames={{label: "text-standard ml-0.5",input: "text-standard",value: "text-[16px] 2xl:text-[20px] text-black"}}
        onChange={handleChange}
        name="companyId"
        defaultSelectedKeys={formData.companyId ? [formData.companyId] : []}
      >
        {allCompanies.length > 0 && allCompanies.map((company) => (
          <SelectItem key={company.id} value={company.id}   >
            {company.name}
          </SelectItem>
        ))}
      </Select>
    </div>
    <div className='mt-6 px-4'>
      <Input
      isRequired
      value={formData.firstName}
      onChange={handleChange}
      name="firstName"
      type="text"
      radius='sm'
      size='md'
      label="First name"
      labelPlacement="outside"
      placeholder='Enter first name'
      variant="bordered"
      className="max-w-sm"
      classNames={{label: "text-standard ml-0.5",input: "text-standard",}}
     
    />
    </div>
    <div className='mt-6 px-4'>
      <Input
      isRequired
      value={formData.lastName}
      onChange={handleChange}
      name="lastName"
      type="text"
      label="Last name"
      radius='sm'
      size='md'
      labelPlacement="outside"
      placeholder='Enter last name'
      variant="bordered"
      className="max-w-sm"
      classNames={{label: "text-standard ml-0.5" ,input: "text-standard",}}
    />
    </div>
    <div className='mt-6 px-4'>
      <Input
      isRequired
      isDisabled={role ? true : false}
      value={formData.email}
      onChange={handleChange}
      name="email"
      type="email"
      label="Email"
      size='md'
      labelPlacement="outside"
      placeholder='Enter email'
      variant="bordered"
      className="max-w-sm"
      radius='sm'
      classNames={{label: "text-standard ml-0.5" ,input: "text-standard",}}
    />
    </div>
    <div className='mt-6 px-4'>
      <Input
      isRequired
      value={formData.position}
      onChange={handleChange}
      isDisabled={role ? true : false}
      name="position"
      type="text"
      label="Position"
      size='md'
      labelPlacement="outside"
      placeholder='Enter user position in the company email'
      variant="bordered"
      className="max-w-sm"
      radius='sm'
      classNames={{label: "text-standard ml-0.5",input: "text-standard", }}
      
    />
    </div>
  </div>
  )
}

export default UsersDetailsCard
