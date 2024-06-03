import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const ConfirmationModal = ({ isOpen, onOpenChange, data }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="py-16 gap-0">
              <p className="font-bold">{data?.heading}</p>
              <p>{data?.desc}</p>
              {data?.name && (
                <p className="mt-7 font-bold">{data?.name}</p>
              )}
              <div className="flex items-center gap-3 mt-5">
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
