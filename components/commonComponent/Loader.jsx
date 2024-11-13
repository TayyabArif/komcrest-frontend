import React from 'react'
import {Spinner} from "@nextui-org/react";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 backdrop-blur-[1px] flex items-center justify-center z-50">
      <span className="text-2xl font-bold text-gray-800"> <Spinner /></span>
    </div>
  )
}

export default Loader