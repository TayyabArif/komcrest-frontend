import React from 'react'
import {Input, Checkbox, Select, SelectItem} from "@nextui-org/react";

const companies = [
  {key: "google", label: "Google"},
  {key: "sodexo", label: "Sodexo"},
  {key: "Staffbase", label: "staffbase"},
];
const UsersDetailsCard = () => {
  return (
    <div className='flex flex-col bg-white shadow-md w-[45%] min-h-[480px] mt-12 pb-10'>
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
      >
        {companies.map((company) => (
          <SelectItem key={company.key}>
            {company.label}
          </SelectItem>
        ))}
      </Select>
    </div>
    <div className='mt-6 px-4'>
      <Input
      isRequired
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
