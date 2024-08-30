import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
} from "@nextui-org/react";
import { X } from "lucide-react";
import Select from "react-select";
import { multipleSelectStyle } from "@/helper";
import { useMyContext } from "@/context"; 
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

const NotifyModal = ({
  isOpen,
  onOpenChange,
  isLoading,
  bulkSelected,
  setBulkSelected
}) => {
  const { companyUserData } = useMyContext();
  const [notifyPeople, setNotifyPeople] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  const handleMultipleSelect = (selectedOptions, actionMeta) => {
    setNotifyPeople(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  const handleSubmit = () => {
    console.log("Notifying:", notifyPeople);
    const token = cookiesData.token;

   const payload = {
      recipientIds: notifyPeople,
      recordIds: bulkSelected
  }
    const requestOptions = {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
    };
    fetch(`${baseUrl}/questionnaires/notify`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        toast.success("Questions notify successfully");
        setBulkSelected([])
      })
      .catch((error) => console.error(error));

  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalBody className="py-12 flex flex-col justify-center items-center gap-5">
          <p className="text-base font-semibold">
            Who do you want to notify to review this question?
          </p>
          <div className="w-full">
            <Select
              isMulti
              options={companyUserData} // Ensure this array has {value, label} format
              name="assignees"
              onChange={handleMultipleSelect}
              styles={multipleSelectStyle}
            />
          </div>
          <div className="space-x-10">
            <Button
              className="bg-[#f5c8d1] text-[#c51317]  font-bold w-max"
              onPress={onOpenChange}
              size="sm"
              onClick={()=>setBulkSelected([])}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-white w-max"
              size="sm"
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
      </ModalContent>
    </Modal>
  );
};

export default NotifyModal;
