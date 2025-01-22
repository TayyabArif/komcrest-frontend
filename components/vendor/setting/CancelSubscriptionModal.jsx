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

const CancelSubscriptionModal = ({ isOpen, onOpen, onOpenChange, cancelExplanation, setCancelExplanation ,cancelSubscription ,cancelIsLoading}) => {
  const router = useRouter()
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-standard">
        We&apos;re Sorry to See You Go!
        </ModalHeader>
        <ModalBody>
          <div className="text-start space-y-4 py-[2rem]">
            <h1 className="font-bold text-standard">
            If you&apos;re considering cancelling your subscription, we&apos;d love to understand why. Your feedback is incredibly important to us and helps us improve our services.
            </h1>
            <p className="w-[90%] text-standard">
            Please take a moment to share your thoughts with us. If there&apos;s anything we can do to assist you or any concerns we can address, we&apos;re here to help!
            </p>
            <textarea type="text" value={cancelExplanation} placeholder="Share your thoughts" className="w-[90%] border border-2 rounded-lg p-2" onChange={(e) => setCancelExplanation(e.target.value)}/>
            <p className="w-[90%] text-standard">
            You can continue using Komcrest until the end of your current registration period. We appreciate your support and hope to serve you better!
            </p>
            <Button
              size="md"
              className="global-success-btn"
              onClick={()=>cancelSubscription()}
              isLoading={cancelIsLoading}
              isDisabled={!cancelExplanation}
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
