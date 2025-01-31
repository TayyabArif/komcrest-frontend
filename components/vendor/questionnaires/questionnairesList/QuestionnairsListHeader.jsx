import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Settings } from "lucide-react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "@/helper";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useDisclosure, Progress } from "@nextui-org/react";
import DeleteModal from "../../shared/DeleteModal";
import { ArrowRight } from "lucide-react";
import { handleExport, handleDownload } from "@/helper";
import { useMyContext } from "@/context";

const deleteModalContent = "Are you sure to delete this Questionnaires?";
const QuestionnairsListHeader = ({
  currentStatus,
  questionnaireData,
  setDataUpdate,
  showDropdown
}) => {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const { setQuestionnaireUpdated, currentQuestionnaireImportId , questionnaireStatusUpdated, s3FileDownload } =
    useMyContext();
  const [id, setId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("QuestionnaireId");
    setId(storedId);
  }, []);


  const handleDelete = async () => {
    const token = cookiesData.token;
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}/questionnaires/${id}`,
        requestOptions
      );

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        router.push("/vendor/questionnaires");
      } else {
        toast.error("Failed to delete questionnaires");
      }
    } catch (error) {
      console.error("Error during bulk delete:", error);
      toast.error("An error occurred during deletion");
    }
  };

  const questionnaireExport =async (data , filePath)=>{
    const parts = filePath.split("/")
    const fileName = parts[parts.length - 1]
   const signedURL = await s3FileDownload(filePath , "getSignedURL")
   console.log(signedURL, 'sssss')
   handleExport(data, signedURL , fileName)
  }

  return (
    <div className="bg-gray-50 py-2">
      <div className="flex justify-between items-center  w-[85%] mx-auto">
        <div className="leading-7 flex gap-2 items-center">
          <p
            onClick={() => router.push("/vendor/questionnaires")}
            className="text-standard cursor-pointer"
          >
            Questionnaires
          </p>
          <ArrowRight size={20} />
          <p className="text-standard">
            {questionnaireData?.customerName}
            {/* - {questionnaireData?.fileName.replace(".xlsx", "")} */}
          </p>
        </div>
        <div className="min-h-[70px]">
          {showDropdown && (
            <div className="flex items-center gap-3">
              <select
                onChange={(e) => questionnaireStatusUpdated(e.target.value , id)}
                value={currentStatus}
                className=" cursor-pointer  bg-[#D8D8D8] text-standard font-semibold border  rounded-[6px] h-[2.5rem]  px-2"
              >
                <option disabled>Change Status</option>
                <option value="To Process">To Process</option>
                <option value="Started">Started</option>
                <option value="For Review">For Review</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
              </select>
              <Button
                radius="none"
                size="md"
                className="text-white text-[17px] 2xl:text-[20px] bg-btn-primary w-max rounded-[4px] my-4 py-2"
                onClick={() =>
                  questionnaireExport(questionnaireData?.questionnaireRecords , questionnaireData.filePath)
                  // handleExport(questionnaireData?.questionnaireRecords  , questionnaireData.filePath)
                }
              >
                Export .XLS
              </Button>
              <div className="bg-[#D8D8D8] py-1 px-[6px] rounded-md">
                <Popover
                  isOpen={dropDownOpen}
                  onOpenChange={(open) => {
                    setDropDownOpen(false);
                  }}
                  className="rounded-[0px]"
                >
                  <PopoverTrigger>
                    <Settings
                       size={32}
                      className="text-[#252525]  cursor-pointer "
                      onClick={() => setDropDownOpen(true)}
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-3 py-2 space-y-1.5 text-[16px]">
                      <div
                        className="text-standard cursor-pointer"
                        onClick={() => {
                          s3FileDownload(questionnaireData?.filePath);
                          setDropDownOpen(false);
                        }}
                      >
                        Download original questionnaire
                      </div>

                      <div
                        className="text-standard cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/vendor/questionnaires/update?id=${id}`);
                        }}
                      >
                        Update info
                      </div>

                      <div
                        className="text-standard text-red-600 cursor-pointer "
                        onClick={(e) => {
                          onOpen();
                          setDropDownOpen(false);
                        }}
                      >
                        Delete
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>
      </div>
      <DeleteModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        handleSubmit={handleDelete}
        deleteModalContent={deleteModalContent}
      />
    </div>
  );
};

export default QuestionnairsListHeader;
