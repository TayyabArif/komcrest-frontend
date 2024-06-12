import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const TermsAndServicesModal = ({ isOpen, onOpenChange, data, handleSubmit, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="py-16 gap-0">
              <p className="font-bold">{data?.heading}</p>
              <p>{data?.desc}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Aggree
                </Button>
              </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TermsAndServicesModal;
