import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { X } from "lucide-react";
import { CircleX } from "lucide-react";
import Select from "react-select";
import { multipleSelectStyle } from "@/helper";
import { useMyContext } from "@/context"; 



const NotifyModal = ({
  isOpen,
  onOpenChange,
  data,
  handleSubmit,
  name,
  isLoading,
  deleteModalContent,
}) => {
    const { companyUserData } = useMyContext();
    // const handleMultipleSelect = (selectedOptions, actionMeta) => {
    //     const { name } = actionMeta;
    //     setImportQuestionnaire(prevState => ({
    //       ...prevState,
    //       [name]: selectedOptions ? selectedOptions.map(option => option.value) : []
    //     }));
    
    //     if (errors[name]) {
    //       setErrors({
    //         ...errors,
    //         [name]: "",
    //       });
    //     }
    //   };
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="py-12 flex flex-col justify-center items-center gap-5">
              <X size={60} color="#e09696" strokeWidth="5" />
              <p className="text-base 2xl:text-[20px] font-semibold">
                Who do you want to notify to review this question?
              </p>
              <div className=" w-full">
                <Select
                  isMulti
                  options={companyUserData}
                  name="assignees"
                  // value={companyUserDataOptions.filter(option => importQuestionnaires.assignees.includes(option.value))}
                  // onChange={handleMultipleSelect}
                  styles={multipleSelectStyle}
                />
              </div>
              <div className="space-x-10">
                <Button
                  radius="none"
                  size="sm"
                  className="text-white px-4 h-[30px] text-base bg-primary font-bold w-max rounded-[4px] 2xl:text-[20px]"
                  onPress={onOpenChange}
                >
                  Cancel
                </Button>
                <Button
                  radius="none"
                  size="sm"
                  className=" px-4 h-[30px] text-base bg-[#f5c8d1] text-[#c51317] w-max rounded-[4px] 2xl:text-[20px]"
                  onPress={() => {
                    onOpenChange();
                    handleSubmit();
                  }}
                  isLoading={isLoading}
                >
                  Notify
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NotifyModal;