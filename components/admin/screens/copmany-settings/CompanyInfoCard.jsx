import React from 'react'
import {Input, Checkbox} from "@nextui-org/react";

const CompanyInfoCard = () => {
  return (
    <div className='flex flex-col bg-white shadow-md w-[45%] min-h-[480px] mt-12'>
      <p className='px-4 py-4 border border-1.5 border-b-gray-200 border-r-0 border-l-0 border-t-0 font-semibold'>Company info</p>
      <div className='mt-6 px-4'>
      <Input
      isRequired
      type="email"
      label="Company name"
      labelPlacement="outside"
      defaultValue="Google"
      variant="bordered"
      className="max-w-sm"
    />
      </div>
      <div className='mt-6 px-4'>
     <Input
      isRequired
      type="email"
      label="Company domain"
      labelPlacement="outside"
      defaultValue="Google.com"
      variant="bordered"
      className="max-w-sm"
      classNames={{wrapper: "rounded-none"}}
    />
      </div>
    <div className='mt-6 px-4'>
      <p className=''>Company type<span className='text-red-500 ml-0.5'>*</span></p>
      <div className='flex itemx-center gap-12 mt-3'>
      <Checkbox radius="none" classNames={{wrapper: "!rounded-[3px]"}}>Vendor</Checkbox>
      <Checkbox defaultSelected radius="none" classNames={{wrapper: "!rounded-[3px]"}}>Purchaser</Checkbox>
      </div>
    </div>
    <div className='flex items-center mt-6 px-4'>
      <p className=''>Display Terms of Services</p>
      <div className='flex itemx-center gap-10 ml-7'>
      <Checkbox radius="none" classNames={{wrapper: "!rounded-[3px]"}}>Yes</Checkbox>
      <Checkbox defaultSelected radius="none" classNames={{wrapper: "!rounded-[3px]"}}>No</Checkbox>
      </div>
    </div>
    <div className='flex items-center mt-8 px-4'>
      <p className=''>Display Privacy Policies</p>
      <div className='flex itemx-center gap-10 ml-10'>
      <Checkbox radius="none" classNames={{wrapper: "!rounded-[3px]"}}>Yes</Checkbox>
      <Checkbox defaultSelected radius="none" classNames={{wrapper: "!rounded-[3px]"}}>No</Checkbox>
      </div>
    </div>
    </div>
  )
}

export default CompanyInfoCard
