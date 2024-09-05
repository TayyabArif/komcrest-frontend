import React, { useState, useEffect } from "react";
import { FilePenLine, Check, Eye, TriangleAlert, Filter } from "lucide-react";
import { Settings, Search } from "lucide-react";
import QuestionnairsListHeader from "./QuestionnairsListHeader";
import {
  Input,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  CircularProgress,
} from "@nextui-org/react";
import History from "../history";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../../helper";
import NotifyModal from "../notifyModal";
import DeleteModal from "../../shared/DeleteModal";
import { toast } from "react-toastify";
import QuestionnairFilter from "./Questionnire-filter";
import { useMyContext } from "@/context";

const deleteModalContent = "Are you sure to delete Questions";

const QuestionnairesView = () => {
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);
  const { setQuestionnaireUpdated  } = useMyContext();
  let id;
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataUpdate, setDataUpdate] = useState(false);
  const notifyDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [bulkSelected, setBulkSelected] = useState([]);
  const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  const [deleteAction, setDeleteAction] = useState("");
  const [questionnaireData, setQuestionnaireData] = useState({});
  const [answerIsUpdate, setAnswerIsUpdate] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState([]);
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const [allCollaborators , setAllCollaborators] = useState([])

  // filter data after notification
  useEffect(() => {
    const { Questionnair } = router.query;
    const params = new URLSearchParams(router.asPath);
    const notifyQuestions = [];
    params.forEach((value, key) => {
      if (key.startsWith("notifyQuestions")) {
        notifyQuestions.push(parseInt(value, 10));
      }
    });

    console.log("Questionnair:", Questionnair);
    console.log("Notify Questions:", notifyQuestions);

    if (Questionnair) {
      localStorage.setItem('QuestionnaireId',(Questionnair));
      setFilters([
        {
          name: "id",
          value: notifyQuestions,
        },
      ]);
    }
  }, [router.query]);

  const fetchQuestionnaire = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}/questionnaire-records/${id}`,
        requestOptions
      );
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        setCurrentStatus(data.questionnaire.status);
        setQuestionnaireData(data?.questionnaire);
        setDataLoaded(true);

        const transformCollaborator = data?.questionnaire.collaborators.map((item) => ({
          value: item?.id,
          label: item?.firstName,
      }));
      setAllCollaborators(transformCollaborator)
        console.log("::::::::::", data);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching Questionnaire:", error);
    }
  };

  useEffect(() => {
    id = localStorage.getItem("QuestionnaireId");
    if (id) {
      fetchQuestionnaire();
    }
  }, [id, dataUpdate, filters]);

  const handleChange = (index, newAnswer) => {
    setQuestionnaireData((prevData) => {
      const updatedRecords = [...prevData.questionnaireRecords];
      updatedRecords[index].answer = newAnswer; // Update only the answer field

      return { ...prevData, questionnaireRecords: updatedRecords };
    });
  };
  const handleCheckboxChange = (id) => {
    let payload = [...bulkSelected];
    if (bulkSelected.includes(id)) {
      payload = bulkSelected.filter((item) => item !== id);
    } else {
      payload = [...payload, id];
    }
    setBulkSelected(payload);
  };
  const handleHeaderCheckboxChange = () => {
    if (isHeaderChecked) {
      setBulkSelected([]);
      setIsHeaderChecked(false);
    } else {
      const allIds = questionnaireData?.questionnaireRecords?.map(
        (data) => data.id
      );
      setBulkSelected(allIds);
      setIsHeaderChecked(true);
    }
  };

  const handleSingleDelete = async () => {
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
        `${baseUrl}/questionnairerecord/${selectedId}`,
        requestOptions
      );
      const result = await response.text();

      if (response.ok) {
        toast.success("Question deleted successfully");
        setDataUpdate(!dataUpdate);
        setSelectedId("");
      } else {
        toast.error("Failed to delete the question");
      }

      console.log(result);
    } catch (error) {
      console.error("Error deleting the question:", error);
      toast.error("An error occurred while deleting the question");
    }
  };

  const handleBulkDelete = async () => {
    const token = cookiesData.token;
    const payLoad = JSON.stringify({
      questionnaireId: localStorage.getItem("QuestionnaireId"),
      ids: bulkSelected,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payLoad,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}/questionnaire/delete`,
        requestOptions
      );

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        setBulkSelected([]);
        setDataUpdate(!dataUpdate);
        setSelectedId("");
      } else {
        toast.error("Failed to delete questions");
      }
    } catch (error) {
      console.error("Error during bulk delete:", error);
      toast.error("An error occurred during deletion");
    }
  };

  const handleDelete = () => {
    if (deleteAction == "single") {
      handleSingleDelete();
    } else {
      handleBulkDelete();
    }
  };

  const updateMultipleAnswer = (id) => {
    const isAnyRecordSelected = bulkSelected.includes(id);
    return isAnyRecordSelected;
  };

  const UpdateRecord = (id, property, data) => {
    let statusValue = data;
    let value;
    if (property == "answer") {
      value = questionnaireData?.questionnaireRecords[data].answer;
    } else if (property == "status") {
      value = data;
    } else if (property == "compliance") {
      value = data;
    }

    const updatedData = {
      ids: id,
      field: property,
      value: value,
      eventType: `${property}Changed`,
    };

    const jsonPayload = JSON.stringify(updatedData);
    const token = cookiesData.token;

    let requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: jsonPayload,
      redirect: "follow",
    };

    fetch(`${baseUrl}/questionnairerecord/update`, requestOptions)
      .then(async (response) => {
        const data = await handleResponse(
          response,
          router,
          cookies,
          removeCookie
        );
        return {
          status: response.status,
          ok: response.ok,
          data,
        };
      })
      .then(({ status, ok, data }) => {
        if (ok) {
          if (statusValue == "Flagged") {
            toast.warning(`Selected Question/s move to "Require Attention"`);
          } else if (statusValue == "approved") {
            toast.success(`Selected Question/s Validated by user`);
          } else {
            toast.success(data.message);
          }
          setDataUpdate(!dataUpdate);
          setQuestionnaireUpdated ((prev)=>!prev)
          if (property == "answer") {
            let newArr = bulkSelected.filter((item) => item !== id[0]);
            setBulkSelected(newArr);
            setSelectedId("");
          } else {
            setBulkSelected([]);
          }
        } else {
          toast.error(data?.error || "Question not Updated");
          console.error("Error:", data);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error("API Error:", error.response);
          toast.error(
            error.response.data?.error ||
              "An error occurred while Updated Questionn"
          );
        }
      });
  };

  const reRunForAnswer = (ids) => {
    const token = cookiesData.token;
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
      redirect: "follow",
    };

    fetch(`${baseUrl}/questionnaires/regenerate-answer`, requestOptions)
      .then(async (response) => {
        const data = await handleResponse(
          response,
          router,
          cookies,
          removeCookie
        );
        return {
          status: response.status,
          ok: response.ok,
          data,
        };
      })
      .then(({ status, ok, data }) => {
        if (ok) {
          toast.success(data.message);
          setDataUpdate(!dataUpdate);
        } else {
          toast.error(data?.error || "Answer not Updated");
          console.error("Error:", data);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error("API Error:", error.response);
          toast.error(
            error.response.data?.error ||
              "An error occurred while Re run AI answer"
          );
        }
      });
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    if (value.length > 0) {
      const filteredRecords = questionnaireData.questionnaireRecords.filter(
        (record) =>
          record.question?.toLowerCase().includes(value) ||
          record.answer?.toLowerCase().includes(value)
      );

      const filteredObject = {
        ...questionnaireData,
        questionnaireRecords: filteredRecords,
      };

      setQuestionnaireData(filteredObject);
    } else {
      setDataUpdate(!dataUpdate);
    }
  };

  return (
    <>
      {dataLoaded ? (
        <div>
          <QuestionnairsListHeader
            currentStatus={currentStatus}
            questionnaireData={questionnaireData}
            setDataUpdate={setDataUpdate}
          />
          <div className="w-[86%] mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 my-2">
                <Input
                  onChange={handleSearch}
                  variant="bordered"
                  placeholder="Search"
                  endContent={<Search size={18} />}
                  type="text"
                  classNames={{
                    inputWrapper: "bg-white rounded-md",
                    input: "2xl:text-[20px] text-[16px]",
                  }}
                  className="max-w-xs"
                />
                <div
                  className="bg-white p-1 border border-gray-300 rounded-[5px] shadow-md cursor-pointer"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <Filter size={26} className="text-gray-500" color="#2457d7" />
                </div>
                {filters.some((filter) => filter.value.length > 0) &&
                  !showFilter && (
                    <button
                      onClick={()=>{
                        setFilters([])
                        router.push("/vendor/questionnaires/view")
                      }}
                      className="px-2 py-1 rounded-full border text-blue-700 border-blue-700 border-dashed text-nowrap"
                    >
                      Clear filter
                    </button>
                  )}
              </div>
              {bulkSelected.length !== 0 && (
                <div className="flex gap-3 items-center pr-3">
                  <h1>{bulkSelected.length} questions selected</h1>
                  <h1
                    className="text-red-600 cursor-pointer"
                    onClick={() => {
                      setBulkSelected([]);
                    }}
                  >
                    Clear Selection
                  </h1>
                  <Check
                    size={20}
                    onClick={() =>
                      UpdateRecord(bulkSelected, "status", "approved")
                    }
                  />
                  <TriangleAlert
                    size={20}
                    onClick={() =>
                      UpdateRecord(bulkSelected, "status", "Flagged")
                    }
                  />
                  <Popover
                    isOpen={dropDownOpen}
                    onOpenChange={(open) => {
                      setDropDownOpen(false);
                    }}
                    className="rounded-[0px]"
                  >
                    <PopoverTrigger>
                      <FilePenLine
                        size={17}
                        onClick={() => setDropDownOpen(true)}
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="px-3 py-2  space-y-1.5 text-[16px]">
                        <div
                          className="text-md cursor-pointer"
                          onClick={() => {
                            setAnswerIsUpdate("multiple");
                            setDropDownOpen(false);
                          }}
                        >
                          Improve answer
                        </div>
                        <div
                          className="text-md cursor-pointer"
                          onClick={() => {
                            reRunForAnswer(bulkSelected);
                            setDropDownOpen(false);
                          }}
                        >
                          Re-run AI for compliance & answer
                        </div>
                        <div
                          className="text-md cursor-pointer"
                          onClick={() => {
                            notifyDisclosure.onOpen();
                            setOpenPopoverIndex(null);
                            setDropDownOpen(false);
                          }}
                        >
                          Notify for help
                        </div>
                        <div
                          className="text-md text-red-600 cursor-pointer"
                          onClick={() => {
                            deleteDisclosure.onOpen();
                            setDeleteAction("bulk");
                            setDropDownOpen(false);
                          }}
                        >
                          Delete
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              {showFilter && (
                <div className="w-[25%]">
                  <QuestionnairFilter
                    setShowFilter={setShowFilter}
                    setFilters={setFilters}
                    filters={filters}
                  />
                </div>
              )}
              <div className="overflow-auto w-[100%]  h-[80vh]  bg-white border">
                <table className=" min-w-[100%] border-2 text-gray-700 ">
                  <thead className="border  sticky -top-1 bg-[#E5E7EB] z-50">
                    <tr className="2xl:text-[20px] text-[16px]">
                      <th className="px-4 py-2 text-center text-gray-600 border">
                        <Checkbox
                          isSelected={isHeaderChecked}
                          onChange={handleHeaderCheckboxChange}
                          className="2xl:text-[20px] !text-[50px]"
                          radius="none"
                          size="md"
                          classNames={{ wrapper: "!rounded-[3px]" }}
                        />
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 border">
                        {/* Status {selectedId} */}
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 border">
                        Question
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 border">
                        Compliance
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 border">
                        Answer
                      </th>
                      <th className="px-4 py-2 text-center text-gray-600 border">
                        Actions
                      </th>
                      <th className="px-[2.5px] text-center text-gray-600 border"></th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {questionnaireData?.questionnaireRecords.length > 0 ?
                    questionnaireData?.questionnaireRecords
                      ?.sort((a, b) => a.id - b.id)
                      ?.map((item, index) => (
                        <tr
                          key={index}
                          className={`border-b 2xl:text-[20px] text-[16px] ${
                            index % 2 === 0 ? "bg-gray-100" : "bg-white"
                          }`}
                        >
                          <td className="px-4 py-2 text-center border w-[70px]">
                            <Checkbox
                              isSelected={bulkSelected.includes(item.id)}
                              onChange={() => handleCheckboxChange(item.id)}
                              className="2xl:text-[20px] !text-[50px]"
                              radius="none"
                              size="md"
                              classNames={{ wrapper: "!rounded-[3px]" }}
                            />
                          </td>
                          <td className="px-4 py-2 text-center border w-[70px]">
                            <div
                              className={`h-5 w-5 mx-auto rounded-full cursor-pointer border ${
                                item.status === "Flagged"
                                  ? "bg-yellow-500"
                                  : item.status === "approved"
                                  ? "bg-green-600"
                                  : "bg-blue-600"
                              }`}
                            ></div>
                          </td>
                          <td className="px-4 py-2 border  w-[600px]">
                            {item.question}
                          </td>
                          <td className=" py-2 items-center ">
                            <div className="w-[90%] mx-auto">
                            <div className={`text-[12px] flex  my-2`}>
                              {item.complianceGeneratedBy ? (
                                <p className=" italic text-left">Updated</p>
                              ) : (
                                <p className=" italic text-left">A.I.</p>
                              )}
                            </div>
                              <select
                                value={item.compliance}
                                onChange={(e) =>
                                  UpdateRecord(
                                    [item.id],
                                    "compliance",
                                    e.target.value
                                  )
                                }
                                className="w-full  text-[16px] 2xl:text-[20px] rounded-lg bg-transparent"
                              >
                                <option value="" disabled>
                                  Select
                                </option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Partial">Partial</option>
                              </select>
                            </div>
                          </td>
                          <td
                            className={`px-4 py-2 w-[600px]  border ${
                              item.confidence < 7
                                ? "outline outline-[#FFC001] text-[#FFC001] shadow-inner"
                                : ""
                            }`}
                          >
                            <div className={`text-[12px] flex  my-2`}>
                              {item.generatedBy == "AI" ? (
                                <p className=" italic text-left">A.I.</p>
                              ) : (
                                <p className=" italic text-left">Updated</p>
                              )}
                            </div>
                            <textarea
                               disabled={answerIsUpdate === "multiple" ? !updateMultipleAnswer(item.id) : false}
                              onChange={(e) => {
                                handleChange(index, e.target.value);
                              }}
                              onClick={(e) => {
                                if (bulkSelected.length == 0) {
                                  setSelectedId(item.id);
                                  setAnswerIsUpdate("single");
                                }

                                e.target.style.height = 'auto'; // Reset the height
                                e.target.style.height = `${e.target.scrollHeight}px`; 

                              }}
                              value={item.answer}
                              className={`w-full  rounded-md focus:outline-none focus:ring-2 focus:px-2  ${
                                item.status == "approved"
                                  ? "focus:ring-green-700"
                                  : item.status == "Flagged"
                                  ? "focus:ring-yellow-500"
                                  : "focus-blue-500"
                              } ${
                                (updateMultipleAnswer(item.id) &&
                                  answerIsUpdate) ||
                                (selectedId === item.id && answerIsUpdate)
                                  ? ""
                                  : "bg-transparent"
                              } `}
                            />

                            <div
                              className={`text-[12px] flex justify-end my-2`}
                            >
                              {(updateMultipleAnswer(item.id) &&
                                answerIsUpdate) ||
                              (selectedId === item.id && answerIsUpdate) ? (
                                <p
                                  onClick={() => {
                                    UpdateRecord([item.id], "answer", index);
                                  }}
                                  className={` text-[16px] 2xl:text-[20px] rounded-lg ${
                                    item.status == "approved"
                                      ? "bg-green-700"
                                      : item.status == "Flagged"
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                                  }  cursor-pointer rounded-sm px-2   text-white`}
                                >
                                  Update
                                </p>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-center border w-[100px]">
                            <div className="inline-flex space-x-2 text-[#A5A5A5]">
                              <Check
                                size={17}
                                style={{ strokeWidth: 3 }}
                                className={` cursor-pointer ${
                                  item.status == "approved"
                                    ? "text-green-700"
                                    : ""
                                }`}
                                onClick={() =>
                                  UpdateRecord([item.id], "status", "approved")
                                }
                              />
                              <TriangleAlert
                                size={17}
                                style={{ strokeWidth: 3 }}
                                className={` cursor-pointer  ${
                                  item.status == "Flagged"
                                    ? "text-yellow-500"
                                    : ""
                                }`}
                                onClick={() => {
                                  UpdateRecord([item.id], "status", "Flagged");
                                }}
                              />
                              <Eye
                                size={17}
                                className={`cursor-pointer ${
                                  selectedId == item.id && showHistory
                                    ? "text-blue-600"
                                    : ""
                                }`}
                                style={{ strokeWidth: 3 }}
                                onClick={() => {
                                  setSelectedId(item.id);
                                  setShowHistory(!showHistory);
                                }}
                              />

                              <Popover
                                className="rounded-[0px] "
                                isOpen={openPopoverIndex === index}
                                onOpenChange={(open) =>
                                  setOpenPopoverIndex(open ? index : null)
                                }
                              >
                                <PopoverTrigger>
                                  <FilePenLine
                                    size={17}
                                    style={{ strokeWidth: 3 }}
                                    className="cursor-pointer "
                                  />
                                </PopoverTrigger>
                                <PopoverContent>
                                  <div className="px-3 py-2  space-y-1.5 text-[16px] cursor-pointer">
                                    <div
                                      onClick={() => {
                                        setSelectedId(item.id);
                                        setAnswerIsUpdate(true);
                                      }}
                                      className="text-md cursor-pointer "
                                    >
                                      Improve answer
                                    </div>
                                    <div
                                      className="text-md cursor-pointer"
                                      onClick={() => {
                                        setOpenPopoverIndex(null);
                                        reRunForAnswer([item.id]);
                                      }}
                                    >
                                      Re-run AI for compliance & answer
                                    </div>
                                    <div
                                      className="text-md cursor-pointer"
                                      onClick={() => {
                                        setBulkSelected([
                                          ...bulkSelected,
                                          item.id,
                                        ]);
                                        notifyDisclosure.onOpen();
                                        setOpenPopoverIndex(null);
                                      }}
                                    >
                                      Notify for help
                                    </div>
                                    <div
                                      className="text-md text-red-600 cursor-pointer"
                                      onClick={() => {
                                        setSelectedId(item.id);
                                        deleteDisclosure.onOpen();
                                        setDeleteAction("single");
                                        setOpenPopoverIndex(null);
                                      }}
                                    >
                                      Delete
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </td>
                          <td
                            className={`my-2 ${
                              item.status === "Flagged"
                                ? "bg-yellow-500"
                                : item.status === "approved"
                                ? "bg-green-600"
                                : "bg-blue-600"
                            }`}
                          >
                            <div></div>
                          </td>
                        </tr>
                      )
                      
                      ): <tr>
                      <td
                        colSpan={6}
                        className="py-5  px-4 text-center text-gray-500 text-18px"
                      >
                         No Question found 
                      </td>
                    </tr>
                      
                      }
                  </tbody>
                </table>
              </div>
              {showHistory && (
                <div className="w-[35%] h-[80vh] overflow-auto">
                  <History
                    selectedId={selectedId}
                    setShowHistory={setShowHistory}
                    setSelectedId={setSelectedId}
                  />
                </div>
              )}
            </div>
          </div>
          <NotifyModal
            isOpen={notifyDisclosure.isOpen}
            onOpenChange={notifyDisclosure.onOpenChange}
            bulkSelected={bulkSelected}
            setBulkSelected={setBulkSelected}
            allCollaborators={allCollaborators}
          />

          <DeleteModal
            isOpen={deleteDisclosure.isOpen}
            onOpenChange={deleteDisclosure.onOpenChange}
            handleSubmit={handleDelete}
            deleteModalContent={deleteModalContent}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2 bg-gray-200 items-center justify-center pl-20 pr-10 py-3 min-h-screen">
          <CircularProgress label="Fetching Questions..." size="lg" />
        </div>
      )}
    </>
  );
};

export default QuestionnairesView;
