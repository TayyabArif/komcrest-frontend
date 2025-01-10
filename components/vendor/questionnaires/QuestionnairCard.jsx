import React, { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import KnowledgeHeader from "../shared/KnowledgeHeader";
import NotifyModal from "./notifyModal";
import { useDisclosure, Progress, Button } from "@nextui-org/react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useRouter } from "next/router";
import FilterStatus from "./FilterStatus";
import DeleteModal from "../shared/DeleteModal";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { formatDateWithTime, getOnlyDate } from "@/helper";
import { useDrag } from "react-dnd";
import { useMyContext } from "@/context";
import { handleExport, handleDownload } from "@/helper";


const deleteModalContent = "Are you sure to delete this Questionnaires?";

const QuestionnairCard = ({ data, index, setDataUpdate, id }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const cookiesData = cookies.myCookie;
  const router = useRouter();
  const [questionnaireProgressBar, setQuestionnaireProgressBar] = useState({});
  const { setQuestionnaireUpdated, setOverAllLoading ,setKnowledgeBasePayloadData ,setIsKnowledgeBaseOpenDirect,questionnaireStatusUpdated} = useMyContext();
  const [{ isDragging }, dragRef] = useDrag({
    type: "QUESTIONNAIRE_CARD",
    item: { id, status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    let totalQuestion = data?.questionnaireRecords.length;
    if (totalQuestion === 0) return;

    const statusCounts = data?.questionnaireRecords.reduce((acc, record) => {
      if (record.confidence < 7 && record.status !== "approved") {
        acc["Flagged"] = (acc["Flagged"] || 0) + 1;
      } else {
        // Increment count for each status
        acc[record.status] = (acc[record.status] || 0) + 1;
      }
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
    setOverAllLoading(true);
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
        setQuestionnaireUpdated((prev) => !prev);
      } else {
        toast.error("Failed to delete questionnaires");
      }
    } catch (error) {
      console.error("Error during bulk delete:", error);
      toast.error("An error occurred during deletion");
    } finally {
      setOverAllLoading(false);
    }
  };


  // Add Questionnaire to knowledge base

  const QuestionnaireAddKnowledgeBase = () =>{

    // convert Questionnaire data structure according to knowledge base payload structure
    const transformedData = {
      name:data.fileName,
      language:data.language,
      productIds : data.products.map((item)=>item.id),
      questions : data.questionnaireRecords?.map((item)=>{
        return (
          {
            question : item.question,
            coverage : item.compliance,
            answer : item.answer,
            curator : cookiesData?.userName
          }
        )
      })
    }


    setKnowledgeBasePayloadData (transformedData)
    setIsKnowledgeBaseOpenDirect(false)
    router.push("/vendor/knowledge/Import")
  }


  return (
    <div>
      <div
        onClick={() => {
          router.push(`/vendor/questionnaires/view?name=${data.customerName}`);
          localStorage.setItem("QuestionnaireId", data.id);
        }}
        className=" bg-white rounded-lg cursor-pointer"
      >
        <div ref={dragRef} className="p-4 ">
          <div className="font-semibold  text-black mb-2 ">
            <div>{data?.customerName} &nbsp;</div>
            <div>{data?.fileName}</div>
          </div>
          <div className="">
            <div className="font-semibold  text-black"> Creation date </div>
            {formatDateWithTime(data?.createdAt)} - {data?.creator?.firstName}
            {/* <div>By {data?.creator?.firstName}</div> */}
          </div>

          <div className="my-1">
            <div className="font-semibold  text-black"> Last Update </div>{" "}
            {formatDateWithTime(data?.updatedAt)} -{" "}
            {data?.updater?.firstName ? data?.updater?.firstName : "N/A"}
            {/* <div>By {data?.updater?.firstName}</div> */}
          </div>

          <div className="font-semibold">
            Due date: <span>{getOnlyDate(data?.returnDate)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 pb-2">
          {data?.status !== "Completed" ? (
            <div className="relative h-[9px] w-full">
              {/* Default blue progress bar */}
              <Progress
                aria-label="Loading..."
                value={100} // Full width
                radius="none"
                classNames={{
                  indicator: "bg-[#2358d3]", // Blue color
                }}
                className="h-[9px] absolute z-10"
                style={{ width: "100%" }}
              />

              {/* Dynamically sorted progress bars */}
              {
                [
                  {
                    key: "Flagged",
                    color: "bg-[#ffc001]",
                    value: questionnaireProgressBar?.Flagged?.percentage || 0,
                  },
                  {
                    key: "approved",
                    color: "bg-[#00B050]",
                    value: questionnaireProgressBar?.approved?.percentage || 0,
                  },
                ]
                  .sort((a, b) => a.value - b.value) // Sort by value in ascending order
                  .reduce(
                    (acc, bar, index) => {
                      const cumulativeWidth = acc.cumulative + bar.value; // Calculate the cumulative width for positioning
                      acc.bars.push(
                        <>
                          {/* <h1>{index} {bar.color}</h1> */}
                          <Progress
                            key={bar.key}
                            aria-label="Loading..."
                            value={100}
                            radius="none"
                            classNames={{
                              indicator: bar.color,
                            }}
                            className={`h-[9px] absolute`}
                            style={{
                              width: `${bar.value}%`,
                              left: `${acc.cumulative}%`, // Position it immediately after the previous bar
                              zIndex: 30 - index * 10,
                              borderRadius: "0px !important", // Adjust z-index dynamically: lower value, higher z-index
                            }}
                          />
                        </>
                      );
                      acc.cumulative = cumulativeWidth; // Update cumulative width for the next bar
                      return acc;
                    },
                    { cumulative: 0, bars: [] }
                  ).bars
              }
            </div>
          ) : (
            <Button
              size="sm"
              color="primary"
              className="rounded-md 2xl:text-[20px] cursor-pointer text-[16px] font-semibold"
              onClick={(e)=>{
                e.stopPropagation()
                QuestionnaireAddKnowledgeBase()}}
            >
              Add to knowledge base
            </Button>
          )}

          <Popover
            className="rounded-[0px] "
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
                {data?.status == "Approved" && (
                  <>
                    <div
                    onClick={(e)=>{
                      e.stopPropagation()
                      questionnaireStatusUpdated("Completed" , data?.id)}}
                    className="text-standard cursor-pointer  ">
                      Mark as completed
                    </div>
                    <div 
                     onClick={(e)=>{
                      e.stopPropagation()
                      QuestionnaireAddKnowledgeBase(e)}}
                     className="text-standard cursor-pointer">
                      Add to knowledge base
                    </div>
                  </>
                )}
                {(data?.status == "Approved" ||
                  data?.status == "Completed") && (
                  <>
                    <div className="text-standard cursor-pointer"
                    onClick={(e) =>{
                      e.stopPropagation()
                      handleExport(data?.questionnaireRecords  , data.filePath)
                    }}
                    >
                      Export questionnaire with answers
                    </div>
                  </>
                )}
                <div
                  className="text-standard cursor-pointer"
                  onClick={(e) => {
                    console.log("data?.filePath", data);
                    e.stopPropagation();
                    handleDownload(data?.filePath);
                    setOpenPopoverIndex(null);
                  }}
                >
                  Download original questionnaire
                </div>

                <div
                  className="text-standard cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/vendor/questionnaires/update?id=${data.id}`);
                  }}
                >
                  Update info
                </div>

                <div
                  className=" text-red-600 cursor-pointer text-standard"
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
