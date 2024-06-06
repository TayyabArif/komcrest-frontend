import React from 'react'
import {Input, Checkbox, Button} from "@nextui-org/react";
import {useDisclosure} from "@nextui-org/react";
import ConfirmationModal from '../../shared/ConfirmationModal';


const UsersSettingsCard = ({action, handleChange, formData, products, handleProductsChange}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  // const modalData = {
  //   heading: "Create User",
  //   desc: "Verify information before confirming",
  //   confirmText: action === "create" ? "Send invitation" : "Confirm update"
  // }
  return (
    <div className='w-[45%]'>
      <div className='flex flex-col bg-white shadow-md w-full pb-20 mt-12  min-h-[550px]'>
        <p className='px-6 py-4 border border-1.5 border-b-gray-200 border-r-0 border-l-0 border-t-0 font-semibold'>User Settings</p>
        <div className='flex flex-col mt-7 px-6'>
          <p className='mb-2 font-[550]'>User role</p>
          <div className='flex flex-col gap-5'>
            {/* <Checkbox radius="none" classNames={{wrapper: "!rounded-[3px] bg-gray-100"}}>Admin</Checkbox>
            <Checkbox defaultSelected radius="none" classNames={{wrapper: "!rounded-[3px] bg-gray-100"}}>Contributor</Checkbox>
            <Checkbox radius="none" classNames={{wrapper: "!rounded-[3px] bg-gray-100"}}>Viewer</Checkbox> */}
             <Checkbox
        name='Admin'
        isSelected={formData.role === 'Admin'}
        onChange={handleChange}
        radius="none"
        classNames={{wrapper: "!rounded-[3px] bg-gray-100"}}
    >
        Admin
    </Checkbox>
    <Checkbox
        name='Contributor'
        isSelected={formData.role === 'Contributor'}
        onChange={handleChange}
        radius="none"
        classNames={{wrapper: "!rounded-[3px] bg-gray-100"}}
    >
        Contributor
    </Checkbox>
    <Checkbox
        name='Viewer'
        isSelected={formData.role === 'Viewer'}
        onChange={handleChange}
        radius="none"
        classNames={{wrapper: "!rounded-[3px] bg-gray-100"}}
    >
        Viewer
    </Checkbox>
          </div>

        </div>
        <div className='flex flex-col mt-8 px-6'>
          <p className='mb-2 font-[550]'>Associated products</p>
          <div className='flex flex-col gap-5'>
            {products?.map((item, index) => (
              <Checkbox key={index} onChange={handleProductsChange} value={item} name="products" radius="none" classNames={{wrapper: "!rounded-[3px] bg-gray-100"}}>{item}</Checkbox>
            ))}
          </div>
        </div>
      </div>
      {/* <div className="flex justify-end mb-5 mt-10">
          <div>
            <div className="flex items-center gap-5">
              <Button
                radius="none"
                size="sm"
                className="text-[#c51317] px-5 h-[28px] text-sm bg-[#f5c8d1] font-bold w-max rounded-[4px]"
              >
                Cancel
              </Button>
              <Button
                radius="none"
                size="sm"
                className="text-white px-5 h-[28px] text-sm bg-btn-primary w-max rounded-[4px]"
                onPress={onOpen}
              >
                {action === "create" ?  "Send invitation" : "Update user"}
              </Button>
            </div>
          </div>
      </div> */}
      {/* <ConfirmationModal isOpen={isOpen} onOpenChange ={onOpenChange} data={modalData}/> */}
    </div>
  )
}

export default UsersSettingsCard
