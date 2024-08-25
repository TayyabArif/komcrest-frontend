import React, { useState } from "react";
import { Settings } from "lucide-react";
import KnowledgeHeader from "../shared/KnowledgeHeader";
import NotifyModal from "./notifyModal";
import { useDisclosure, Progress } from "@nextui-org/react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useRouter } from "next/router";
import FilterStatus from "./FilterStatus";
import DeleteModal from "../shared/DeleteModal";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";


const deleteModalContent = "Are you sure to delete this Questionnaires?";

const QuestionnairCard = ({data ,index ,setDataUpdate , }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const cookiesData = cookies.myCookie;
    const router = useRouter(); 
    
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
          `${baseUrl}/questionnaires/${data.id}`,
          requestOptions
        );
  
        if (response.ok) {
          const result = await response.json();
          toast.success(result.message);
          setDataUpdate((prev)=>!prev)
        } else {
          toast.error("Failed to delete questionnaires");
        }
      } catch (error) {
        console.error("Error during bulk delete:", error);
        toast.error("An error occurred during deletion");
      }
    
    };
  return (
    <div>
    <div onClick={()=>router.push(`/vendor/questionnaires/view?id=${data?.id}`)} className="bg-white shadow-lg rounded-lg p-4 cursor-pointer">
      <div className="font-bold text-lg text-black mb-2 ">
        <h6>{data?.customerName}</h6>
        <h6>{data?.fileName}</h6>
      </div>

      <div className=" text-gray-500">
        <div>
          <span className="font-bold  text-black"> Creation date </span>{data?.createdAt}
        </div>
        <div>By {data?.customerName}</div>
      </div>

      <div>
        <span className="font-bold  text-black"> Last Update </span> {data?.updatedAt}
      </div>
      <div>By Richard Branco</div>

      <div className=" font-bold mt-4">
        Due date{" "}
        <span>
          31<sup>st</sup> August 2024
        </span>
      </div>
      <div className="flex  items-center justify-end gap-4 ">
        {data?.questionnaireStatus !== "Completed" && (
            <div className="relative h-[9px] w-full">
          <Progress
            aria-label="Loading..."
            value={80}
            className="h-[9px] absolute "
            classNames={{
              indicator: "bg-[#ffc001]",
            }}
            style={{ width: "100%" }}
          />

          <Progress
            aria-label="Loading..."
            value={40}
            classNames={{
              indicator: "bg-[#00B050]",
            }}
            className="h-[9px] absolute"
            style={{ width: "100%" }}
          />
        </div>
        )}
        
        <Popover
          className="rounded-[0px]"
          isOpen={openPopoverIndex === index}
          onOpenChange={(open) => setOpenPopoverIndex(open ? index : null)}
        >
          <PopoverTrigger>
            <Settings
              size={25}
              className="cursor-pointer"
              color="#2457d7"
              strokeWidth={2}
            />
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-3 py-2 space-y-1.5">
              <div className="text-small cursor-pointer ">
                Download original questionnaire
              </div>

              <div className="text-small cursor-pointer"
              onClick={(e)=>{
                e.stopPropagation()
                router.push(`/vendor/questionnaires/update?id=${data.id}`)
              }}
              >Update info</div>

              <div className="text-small text-red-600 cursor-pointer "
             onClick={(e) => {
              e.stopPropagation()
              onOpen();
              setOpenPopoverIndex(null)
            }}>
                Delete
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
    </div>
    <DeleteModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            handleSubmit={handleDelete}
            deleteModalContent={deleteModalContent}
          />
    </div>
  )
}

export default QuestionnairCard