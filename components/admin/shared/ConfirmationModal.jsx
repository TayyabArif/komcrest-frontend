import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const ConfirmationModal = ({ isOpen, onOpenChange, data, handleSubmit, name, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="py-16 gap-0">
              <p className="font-bold text-base 2xl:text-[20px]">{data?.heading}</p>
              <p className="text-base 2xl:text-[20px]">{data?.desc}</p>
              {name && (
                <p className="mt-7 font-bold 2xl:text-[20px]">{name}</p>
              )}
              <div className="flex items-center gap-3 mt-5">
                <Button
                  radius="none"
                  size="sm"
                  className="text-[#c51317] px-4 h-[30px] text-base bg-[#f5c8d1] font-bold w-max rounded-[4px] 2xl:text-[20px]"
                  onPress={onOpenChange}
                >
                  Cancel
                </Button>
                <Button
                  radius="none"
                  size="sm"
                  className="text-white px-4 h-[30px] text-base bg-[#4fa82e] w-max rounded-[4px] 2xl:text-[20px]"
                  onPress={() => {
                    onOpenChange()
                    handleSubmit()
                  }}
                  isLoading={isLoading}
                >
                  {data?.confirmText}
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
