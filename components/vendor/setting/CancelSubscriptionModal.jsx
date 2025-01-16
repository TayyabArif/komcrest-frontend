import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/router";

const CancelSubscriptionModal = ({ isOpen, onOpen, onOpenChange, cancelEplaination, setCancelEplaination }) => {
  const router = useRouter()
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
        We're Sorry to See You Go!
        </ModalHeader>
        <ModalBody>
          <div className="text-start space-y-4 py-[2rem]">
            <h1 className="font-bold text-[20px]">
            If you're considering cancelling your subscription, we’d love to understand why. Your feedback is incredibly important to us and helps us improve our services.
            </h1>
            <p className="w-[90%] text-[20px]">
            Please take a moment to share your thoughts with us. If there’s anything we can do to assist you or any concerns we can address, we're here to help!
            </p>
            <textarea type="text" value={cancelEplaination} placeholder="Share your thoughts" className="w-[90%] border border-2 rounded-lg p-2" onChange={(e) => setCancelEplaination(e.target.value)}/>
            <p className="w-[90%] text-[20px]">
            You can continue using Komcrest until the end of your current registration period. We appreciate your support and hope to serve you better!
            </p>
            <Button
              size="md"
              className="global-success-btn"
              onClick={()=>router.push("/vendor/setting/upgrade-subscription")}
            >
             Send cancellation request
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CancelSubscriptionModal;
