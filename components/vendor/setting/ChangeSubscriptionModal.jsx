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

const ChangeSubscriptionModal = ({ isOpen, onOpen, onOpenChange }) => {
  const router = useRouter()
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Change Subscription
        </ModalHeader>
        <ModalBody>
          <div className="text-center space-y-4 py-[2rem] 2xl:text-[20px] text-[16px]">
            <h1 className="font-bold text-[20px]">
              Ready to explore new possibilities?
            </h1>
            <p className="w-[90%] mx-auto">
              Switch your plan effortlessly to unlock features tailored to your
              evolving needs—because growth begins with the right tools!
            </p>
            <Button
              size="md"
              color="primary"
              className="rounded-md 2xl:text-[20px]  text-[16px]"
              onClick={()=>router.push("/vendor/setting/upgrade-subscription")}
            >
              View Plans
            </Button>
            <div className="text-[16px] font-semibold leading-5">
              <p className="2xl:text-[20px] text-[16px]">Write us to</p>
              <p className="text-blue-700 underline cursor-pointer 2xl:text-[20px] text-[16px] ">
                support@komcrest.com
              </p>
              <p className="2xl:text-[20px] text-[16px]">
                and we will take care of you.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeSubscriptionModal;
