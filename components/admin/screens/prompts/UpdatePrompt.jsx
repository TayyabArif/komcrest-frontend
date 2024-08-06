import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Textarea,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { handleResponse } from "../../../../helper/index";

const UpdatePrompt = ({ isOpen, onOpenChange, prompt ,setDataUpdate}) => {
  const [cookies, setCookie, removeCookie] = useCookies(['myCookie']);
  const cookiesData = cookies.myCookie;
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [updatedPrompt, setUpdatedPrompt] = useState({ prompt: '' });

  useEffect(() => {
    if (prompt) {
      setUpdatedPrompt(prompt);
    }
  }, [prompt]);

  const updatePrompt = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt: updatedPrompt.prompt }),
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/prompts/${prompt.id}`, requestOptions);
      const data = await handleResponse(response, router, cookies, removeCookie);
      if (response.ok) {
        toast.success("Prompt updated successfully");
        onOpenChange(false);
        setDataUpdate((pre)=>!pre)
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
      toast.error("Failed to update prompt");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPrompt((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {updatedPrompt.title}
            </ModalHeader>
            <ModalBody>
              <div>
                <label className="text-[16px] 2xl:text-[20px]">Prompt</label>
                <Textarea
                  name="prompt"
                  value={updatedPrompt?.prompt}
                  onChange={handleChange}
                  placeholder="Enter your description"
                  variant="bordered"
                  classNames={{
                    input: "resize-y min-h-[100px]",
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={updatePrompt}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UpdatePrompt;
