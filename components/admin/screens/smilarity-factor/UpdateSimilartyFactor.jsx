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

const UpdateSimilartyFactor = ({ isOpen, onOpenChange ,similarityValues ,setDataUpdate}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [updatedSimilarityValues, setUpdatedSimilarityValues] = useState(similarityValues);

    useEffect(() => {
      if (similarityValues) {
        setUpdatedSimilarityValues(similarityValues);
      }
    }, [similarityValues]);

  const updateSimilarityFactorData = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedSimilarityValues),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}/settings/update`,
        requestOptions
      );
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        toast.success("Similarity Factor value updated successfully");
        onOpenChange(false);
        setDataUpdate((pre) => !pre);
      }
    } catch (error) {
      console.error("Error updating Similarity Factor:", error);
      toast.error("Failed to update Similarity Factor:");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedSimilarityValues((prev) => ({
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
              Update similarity factor values
            </ModalHeader>
            <ModalBody className="space-y-1">
              <div>
                <label className="text-[16px] 2xl:text-[20px]">
                  Documents Similarity factor
                </label>
                <Input
                  type="number"
                  variant="bordered"
                  placeholder=""
                  size="md"
                  name="documentThreshold"
                  value={updatedSimilarityValues?.documentThreshold}
                  onChange={handleChange}
                  classNames={{
                    input: "2xl:text-[20px] text-[16px] text-gray-500",
                  }}
                />
              </div>{" "}
              <div>
                <label className="text-[16px] 2xl:text-[20px]">
                  Online resources similarity factor
                </label>
                <Input
                  type="number"
                  variant="bordered"
                  placeholder=""
                  size="md"
                  name="resourceThreshold"
                  value={updatedSimilarityValues?.resourceThreshold}
                  onChange={handleChange}
                  classNames={{
                    input: "2xl:text-[20px] text-[16px] text-gray-500",
                  }}
                />
              </div>
              <div>
                <label className="text-[16px] 2xl:text-[20px]">
                  Knowledge Base Similarity factor
                </label>
                <Input
                  type="number"
                  variant="bordered"
                  placeholder=""
                  size="md"
                  name="questionThreshold"
                  value={updatedSimilarityValues?.questionThreshold}
                  onChange={handleChange}
                  classNames={{
                    input: "2xl:text-[20px] text-[16px] text-gray-500",
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={updateSimilarityFactorData}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UpdateSimilartyFactor;
