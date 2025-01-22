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

const FreeTrialCompletedModal = ({ isOpen, onOpen, onOpenChange ,planActivated }) => {
  const router = useRouter();
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1"></ModalHeader>
        <ModalBody>
          <div className="text-center space-y-7 py-[2rem] 2xl:text-[20px] text-[16px]">
            <h1 className="font-bold text-[20px]">
              You have reached the limits of your trial period!
            </h1>
            <div>
              <p>We hope you enjoyed Komcrest!</p>
              <p className="w-[90%] mx-auto 2xl:text-[20px] text-[16px]">
                To reactivate your account based on your selected plan please
                click on the button below:
              </p>
            </div>
            <Button
              size="md"
              color="primary"
              className="global-success-btn"
              onClick={() =>planActivated() }
            >
              Activate Plan
            </Button>
            <div className="text-[16px]  leading-5">
              <p className="2xl:text-[20px] text-[16px] w-[80%] mx-auto">
                Your data is safe with us. If you need more time to decide,
                don&apos;t worry — we’ll keep your data secure, and it will only
                be erased after 1 month if you choose not to reactivate your
                account.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FreeTrialCompletedModal;
