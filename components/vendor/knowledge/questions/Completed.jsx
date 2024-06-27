import React from 'react'
import { Settings } from "lucide-react";

const Completed = () => {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='bg-[#ebeef2] w-[45%]  flex flex-col justify-center items-center space-y-4 py-6 rounded'> 
       <Settings size={60} className='text-blue-600'/>
       <div className='text-center'>
       <h1 className='font-semibold'>Importing questions and answers</h1>
       <p className='w-[75%] mx-auto'>It might take a little time, but we assure you it will be worthwhile.</p>
       </div>
      </div>
    </div>
  )
}

export default Completed