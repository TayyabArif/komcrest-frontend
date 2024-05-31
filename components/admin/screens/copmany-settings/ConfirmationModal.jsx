import React from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button} from "@nextui-org/react";

const ConfirmationModal = ({isOpen, onOpenChange}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className='py-16 gap-0'>
                <p className='font-bold'>
                Deactivate Company
                </p>
                <p>
                Are you sure you want to deactivate the company?
The tenant will no longer be available, and users
won’t be able to access their information
                </p>
                <p className='mt-7 mb-5 font-bold'>
                Sodexo
                </p>
                <div className='flex items-center gap-3'>
          <Button
            radius="none"
            size="sm"
            className="text-[#c51317] px-4 h-[30px] text-base bg-[#f5c8d1] font-bold w-max rounded-[4px]"
            onPress={onOpenChange}
          >
            Cancel
          </Button>
          <Button
            radius="none"
            size="sm"
            className="text-white px-4 h-[30px] text-base bg-[#4fa82e] w-max rounded-[4px]"
          >
           Confirm deactivation
          </Button>
          </div>
              </ModalBody>
              {/* <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
  )
}

export default ConfirmationModal
