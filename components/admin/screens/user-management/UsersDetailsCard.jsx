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
const UsersDetailsCard = ({handleChange, formData, allCompanies}) => {

  console.log(">>>>>>><<<<<<<<<",formData)
const id = 50
  return (
    <div className='flex flex-col bg-white shadow-md w-[45%] min-h-[550px] mt-12 pb-10'>
    <p className='px-4 py-4 border border-1.5 border-b-gray-200 border-r-0 border-l-0 border-t-0 font-semibold'>User details</p>
    <div className='mt-7 px-4'>
      <Select
        label="Company"
        placeholder="Select company"
        className="max-w-sm"
        labelPlacement='outside'
        variant="bordered"
        scrollShadowProps={{
          isEnabled: false
        }}
        classNames={{label: "font-[550] ml-0.5 pb-1", trigger: "rounded-sm"}}
        onChange={handleChange}
        name="companyId"
        defaultSelectedKeys={[formData.companyId]}
       
      >
        {allCompanies.map((company) => (
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
      label="First name"
      labelPlacement="outside"
      placeholder='Enter first name'
      variant="bordered"
      className="max-w-sm"
      classNames={{label: "font-[550] ml-0.5", inputWrapper: "rounded-sm"}}
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
      labelPlacement="outside"
      placeholder='Enter last name'
      variant="bordered"
      className="max-w-sm"
      classNames={{label: "font-[550] ml-0.5", inputWrapper: "rounded-sm"}}
    />
    </div>
    <div className='mt-6 px-4'>
      <Input
      isRequired
      value={formData.email}
      onChange={handleChange}
      name="email"
      type="email"
      label="Email"
      labelPlacement="outside"
      placeholder='Enter email'
      variant="bordered"
      className="max-w-sm"
      classNames={{label: "font-[550] ml-0.5", inputWrapper: "rounded-sm"}}
    />
    </div>
    <div className='mt-6 px-4'>
      <Input
      isRequired
      value={formData.position}
      onChange={handleChange}
      name="position"
      type="text"
      label="Position"
      labelPlacement="outside"
      placeholder='Enter user position in the company email'
      variant="bordered"
      className="max-w-sm"
      classNames={{label: "font-[550] ml-0.5", inputWrapper: "rounded-sm"}}
    />
    </div>
  </div>
  )
}

export default UsersDetailsCard
