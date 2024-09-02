import React, { useEffect, useState } from "react";
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
import { formatDateWithTime } from "@/helper";
import { useDrag } from "react-dnd";
import { useMyContext } from "@/context";
import { handleExport } from "@/helper";



const deleteModalContent = "Are you sure to delete this Questionnaires?";

const QuestionnairCard = ({ data, index, setDataUpdate, id }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const cookiesData = cookies.myCookie;
  const router = useRouter();
  const [questionnaireProgressBar, setQuestionnaireProgressBar] = useState({});


  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  useEffect(() => {
    let totalQuestion = data?.questionnaireRecords.length;

    // Check if there are any questionnaire records to avoid division by zero
    if (totalQuestion === 0) return;

    const statusCounts = data?.questionnaireRecords.reduce((acc, record) => {
      // Increment count for each status
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {});

    // Calculate percentage for each status and update the object
    const statusPercentages = Object.keys(statusCounts).reduce((acc, key) => {
      acc[key] = {
        count: statusCounts[key],
        percentage: ((statusCounts[key] / totalQuestion) * 100).toFixed(2),
      };
      return acc;
    }, {});

    // Set the calculated counts and percentages in the state
    setQuestionnaireProgressBar(statusPercentages);
  }, [data]);

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
        setDataUpdate((prev) => !prev);
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
      <div
       
        onClick={() =>{
          router.push(`/vendor/questionnaires/view?name=${data.customerName}`)
          localStorage.setItem('QuestionnaireId',(data.id));
        }}
        className=" bg-white shadow-lg rounded-lg cursor-pointer"
      >
        <div  ref={drag} className="p-4">
        <div className="font-bold text-lg text-black mb-2 ">
          <h6>{data?.customerName} &nbsp;</h6>
          <h6>{data?.fileName}</h6>
        </div>

        <div className="">
          <div>
            <span className="font-bold  text-black"> Creation date </span>
            {formatDateWithTime(data?.createdAt)}
          </div>
          <div>By {data?.customerName}</div>
        </div>

        <div className="">
          <span className="font-bold  text-black"> Last Update </span>{" "}
          {formatDateWithTime(data?.updatedAt)}
        </div>
        <div>By {data?.customerName}</div>

        <div className=" font-bold mt-4">
          Due date{" "}
          <span>
          {formatDateWithTime(data?.returnDate)}
          </span>
        </div>
        </div>
      <div className="flex  items-center justify-end gap-4 p-2">
        {data?.status !== "Completed" && (
          <div className="relative h-[9px] w-full">
          {[
            { key: 'processed', color: '!bg-[#3b82f6]', value: questionnaireProgressBar?.processed?.percentage, zIndex: 5 },
            { key: 'Flagged', color: 'bg-[#eab308]', value: questionnaireProgressBar?.Flagged?.percentage, zIndex: 20 },
            { key: 'approved', color: 'bg-[#00B050]', value: questionnaireProgressBar?.approved?.percentage, zIndex: 10 },
          ]
            .sort((a, b) => b.value - a.value) // Sort by value in descending order
            .map((bar, index) => (
              <Progress
                key={bar.key}
                aria-label="Loading..."
                value={bar.value}
                classNames={{
                  indicator: bar.color,
                }}
                className={`h-[9px] absolute z-${10 + index * 10}`} // Adjust z-index dynamically
                style={{ width: "100%" }}
              />
            ))}
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
            <div className="px-3 py-2 space-y-1.5 text-[16px]">
              <div className="text-small cursor-pointer"
              onClick={(e)=>{
                e.stopPropagation();
                handleExport(data.questionnaireRecords)
                setOpenPopoverIndex(null);
              }}
              
              >
                Download original questionnaire
              </div>

              <div
                className="text-small cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/vendor/questionnaires/update?id=${data.id}`);
                }}
              >
                Update info
              </div>

              <div
                className="text-small text-red-600 cursor-pointer "
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                  setOpenPopoverIndex(null);
                }}
              >
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
  );
};

export default QuestionnairCard;
