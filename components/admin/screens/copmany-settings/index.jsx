import React from 'react'
import { Button } from "@nextui-org/react";
import CompaniesTable from './CompaniesTable';

const CompanySettings = () => {
  return (
    <div className='flex flex-col w-full bg-white'>
      <div className='flex justify-end font-bold pl-20 pr-10 py-2'>Logout</div>
      <div className='flex justify-between items-start bg-gray-50 pl-20 pr-10 py-6'>
        <div>
          <p className='font-semibold'>
            Setup companies in Komcrest
          </p>
          <p>
            Fill in company information to create company profile and tenant
          </p>
        </div>
        <Button
          radius="none"
          size="sm"
          className="text-white px-[25px] text-sm bg-btn-primary w-max rounded-[4px] -ml-1"
        >
          Activate company
        </Button>
      </div>
      <CompaniesTable />
  </div>
  )
}

export default CompanySettings
