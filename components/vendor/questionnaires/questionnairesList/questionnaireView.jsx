import React, { useState, useEffect, useRef } from "react";
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
import ResizableHeader from "../../shared/ResizeTbaleHeader";

const deleteModalContent = "Are you sure to delete Questions";

const QuestionnairesView = () => {
  const router = useRouter();
  const { setQuestionnaireUpdated ,  dataUpdate,  setDataUpdate} = useMyContext();
  let id;
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  // const [dataUpdate, setDataUpdate] = useState(false);
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
  const [historyVisible, setHistoryVisible] = useState(false);
  const [allCollaborators, setAllCollaborators] = useState([]);
  const [selectedOption, setSelectedOption] = useState("references");
  const divRef = useRef(null);
  const [textAreaSize, setTextAreaSize] = useState("");
  const [selectedTextAreaId, setSelectedTextAreaId] = useState();
  const [getFilterData, setFilterData] = useState("");
  const [referenceToggle, setReferenceToggle] = useState({
    isKnowledgeOpen: true,
    isDocumentOpen: true,
    isOnlineOpen: true,
  });
  const [seletedQuestionnaireReference, setSeletedQuestionnaireReference] =
    useState();

  const [selectedQuestionnaireReference, setSelectedQuestionnaireReference] =
    useState();

  useEffect(() => {
    const storedHistoryPreference = JSON.parse(
      localStorage.getItem("showHistory")
    );
    const isVisible =
      storedHistoryPreference && storedHistoryPreference.historyVisible
        ? storedHistoryPreference.historyVisible
        : false;
    setHistoryVisible(isVisible);
    const selectId =
      storedHistoryPreference && storedHistoryPreference.selectedId;
    setSelectedId(selectId);
    const historySelectedoption =
      storedHistoryPreference && storedHistoryPreference.selectedOption
        ? "history"
        : "references";
    setSelectedOption(historySelectedoption);
  }, []);

  useEffect(() => {
    console.log("<<<<<<<<", selectedOption);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "showHistory",
        JSON.stringify({ historyVisible, selectedId, selectedOption })
      );
    }
  }, [historyVisible, selectedId, selectedOption]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("showHistory");
    };
  }, []);

  // filter data after notification
  useEffect(() => {
    if (router.isReady) {
      // Ensure that the router is fully ready
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
        sessionStorage.setItem("QuestionnaireId", Questionnair);
        setFilters([
          {
            name: "id",
            value: notifyQuestions,
          },
        ]);

        setFilterData("filtered");
      } else {
        setFilterData("all");
      }
    }
  }, [router.isReady, router.query]);

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
        const transformCollaborator = data?.questionnaire.collaborators.map(
          (item) => ({
            value: item?.id,
            label: item?.firstName,
          })
        );
        setAllCollaborators(transformCollaborator);
        console.log("::::::::::", data);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching Questionnaire:", error);
      router.push("/vendor/questionnaires")
    } finally{
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    id = sessionStorage.getItem("QuestionnaireId");
    if (id && getFilterData == "filtered") {
      fetchQuestionnaire();
    }
    if (id && getFilterData == "all") {
      fetchQuestionnaire();
    }
  }, [id, dataUpdate, filters, getFilterData]);

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
      if(bulkSelected.length === 1){
        setIsHeaderChecked(false)
      }
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

      const result = await response.json(); // parse response as JSON

      if (response.ok) {
        if (
          result.message ===
          "Record and associated Questionnaire deleted successfully"
        ) {
          toast.success(result.message);
          router.push("/vendor/questionnaires");
          setQuestionnaireUpdated((prev) => !prev);
       
        } else {
          toast.success(result.message);
          setDataUpdate((prev) => !prev);
          setSelectedId("");
        }
      } else {
        toast.error("Failed to delete the question");
      }
    } catch (error) {
      console.error("Error deleting the question:", error);
      toast.error("An error occurred while deleting the question");
    }
  };

  const handleBulkDelete = async () => {
    const token = cookiesData.token;
    const payLoad = JSON.stringify({
      questionnaireId: sessionStorage.getItem("QuestionnaireId"),
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
      const result = await response.json();

      if (response.ok) {
        if (
          result.message ===
          "QuestionnaireRecord and its associated Questionnaire were deleted successfully"
        ) {
          toast.success(result.message);
          setQuestionnaireUpdated((prev) => !prev);
          router.push("/vendor/questionnaires");
          setIsHeaderChecked(false)
        } else {
          toast.success(result.message);
          setBulkSelected([]);
          setDataUpdate(!dataUpdate);
          setSelectedId("");
          setIsHeaderChecked(false)
        }
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

    // immediatlty state change
    setQuestionnaireData({
      ...questionnaireData,
      questionnaireRecords: questionnaireData.questionnaireRecords.map(
        (record) => {
          if (record.id === id[0]) {
            let complianceStatus = record.complianceGeneratedBy;
            let answerStatus = record.generatedBy;
            if (
              record.complianceGeneratedBy == "AI" &&
              property == "compliance"
            ) {
              complianceStatus = "manual";
            }
            if (record.generatedBy == "AI" && property == "answer") {
              answerStatus = "manual";
            }
            return {
              ...record,
              [property]: value,
              complianceGeneratedBy: complianceStatus,
              generatedBy: answerStatus,
            };
          }
          return record;
        }
      ),
    });

    const updatedData = {
      ids: id,
      field: property,
      value: value,
      eventType: `${property}Changed`,
      questionnairId: sessionStorage.getItem("QuestionnaireId"),
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
            toast.warning(
              `Selected Question${
                id.length > 1 ? "(s) are" : " is"
              } move to "Require Attention"`
            );
          } else if (statusValue == "approved") {
            toast.success(
              `The selected question${
                id.length > 1 ? "(s) are" : " is"
              } validated by the user`
            );
          } else {
            toast.success(data.message);
          }
          setDataUpdate(!dataUpdate);
          setQuestionnaireUpdated((prev) => !prev);
          if (property == "answer") {
            let newArr = bulkSelected.filter((item) => item !== id[0]);
            setBulkSelected(newArr);
            // setSelectedId("");
            setDataUpdate(!dataUpdate);
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

  const reRunForAnswer = (ids , eventType = "" ) => {
    toast.loading("It will take some time, please wait...");
    const token = cookiesData.token;
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids , historyMessage : eventType }),
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
          toast.dismiss();
          toast.success(data.message);
          setDataUpdate(!dataUpdate);
        } else {
          toast.error(data?.error || "Answer not Updated");
          console.error("Error:", data);
        }
      })
      .catch((error) => {
        console.log("errorerrorerror", error);
        if (error) {
          toast.dismiss();
          console.error("API Error:", error.response);
          toast.error(
            error.response?.data?.error ||
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

  const [editId, setEditId] = useState(null); // State to track edit mode

  // Function to toggle edit mode
  const toggleEdit = (id) => {
    if (selectedTextAreaId === id) {
      setSelectedTextAreaId(null); // Exit edit mode
    } else {
      setSelectedTextAreaId(id); // Enter edit mode for clicked item
    }
  };

  // fetch selected questionnire after page reload base on seleted id store in localstorage
  useEffect(() => {
    const filetrSingleQuestionnisre =
      questionnaireData?.questionnaireRecords?.find((item) => {
        return item.id === selectedId;
      });
    console.log(
      "questionnaireData?.questionnaireRecords:",
      questionnaireData?.questionnaireRecords
    );
    console.log("Found item:", filetrSingleQuestionnisre);
    setSelectedQuestionnaireReference(filetrSingleQuestionnisre?.references);
  }, [selectedId, questionnaireData]);

  const [columnWidths, setColumnWidths] = useState({
    status: 50,
    question: 500, 
    compliance: 130, 
    answer: 500, 
  });

  useEffect(() => {
    const storedWidths = localStorage.getItem("questionnaircolumnWidths");
    if (storedWidths) {
      setColumnWidths(JSON.parse(storedWidths));
    }
  }, []);

  // Function to handle resizing columns and updating local storage
  const handleResize = (columnName, deltaX) => {
    setColumnWidths((prevWidths) => {
      const newWidths = {
        ...prevWidths,
        [columnName]: Math.max(50, prevWidths[columnName] + deltaX), // Ensure minimum width of 50px
      };
      localStorage.setItem("questionnaircolumnWidths", JSON.stringify(newWidths));
      return newWidths;
    });
  };

  return (
    <>
      {dataLoaded ? (
        <div className="flex flex-col h-full">
          <QuestionnairsListHeader
            currentStatus={currentStatus}
            questionnaireData={questionnaireData}
            setDataUpdate={setDataUpdate}
            showDropdown={true}
          />
          <div className="w-[86%] mx-auto flex flex-col  min-h-[0vh]">
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
                    input: "text-standard",
                  }}
                  className=""
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
                      onClick={() => {
                        setFilters([]);
                        router.push("/vendor/questionnaires/view");
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
                      setIsHeaderChecked(false)
                    }}
                  >
                    Clear Selection
                  </h1>
                  <Check
                    size={20}
                    className="cursor-pointer"
                    onClick={() =>
                      UpdateRecord(bulkSelected, "status", "approved")
                    }
                  />
                  <TriangleAlert
                    size={20}
                    className="cursor-pointer"
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
                        className="cursor-pointer"
                        onClick={() => setDropDownOpen(true)}
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="px-3 py-2  space-y-1.5 text-[16px]">
                        <div
                          className="text-standard cursor-pointer "
                          // onClick={() => {
                          //   setAnswerIsUpdate("multiple");
                          //   setDropDownOpen(false);
                          // }}
                          onClick={() => {
                            reRunForAnswer(bulkSelected ,"improveAnswer");
                            setDropDownOpen(false);
                          }}
                        >
                          Improve answer
                        </div>
                        <div
                          className="cursor-pointer text-standard"
                          onClick={() => {
                            reRunForAnswer(bulkSelected);
                            setDropDownOpen(false);
                          }}
                        >
                          Re-run AI for compliance & answer
                        </div>
                        <div
                          className="text-standard cursor-pointer "
                          onClick={() => {
                            notifyDisclosure.onOpen();
                            setOpenPopoverIndex(null);
                            setDropDownOpen(false);
                          }}
                        >
                          Notify for help
                        </div>
                        <div
                          className="text-standard text-red-600 cursor-pointer 2"
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
            <div className="flex gap-4 flex-1 h-[0vh]">
              {showFilter && (
                <div className="w-[22%]">
                  <QuestionnairFilter
                    setShowFilter={setShowFilter}
                    setFilters={setFilters}
                    filters={filters}
                  />
                </div>
              )}
              <div className="overflow-auto w-[100%] flex-1 bg-white">
                <table className="min-w-[100%] border-2  ">
                  <thead className="border  sticky -top-1 bg-[#E5E7EB] z-50">
                    <tr className="text-standard">
                      <th className="px-4 py-2 text-center ">
                        <Checkbox
                          isSelected={isHeaderChecked && bulkSelected.length > 0}
                          onChange={handleHeaderCheckboxChange}
                          className="2xl:text-[20px] !text-[50px]"
                          radius="none"
                          size="lg"
                          classNames={{ wrapper: "!rounded-[3px]" }}
                        />
                      </th>
                      {/* <th
                      className="  px-4 py-2 text-left text-gray-600 ">
                        Status
                      </th> */}
                      <ResizableHeader
                        columnName="status"
                        columnWidth={columnWidths.status}
                        onResize={handleResize}
                      >
                        Status
                      </ResizableHeader>
                      <ResizableHeader
                        columnName="question"
                        columnWidth={columnWidths.question}
                        onResize={handleResize}
                      >
                         Question
                      </ResizableHeader>
                      <ResizableHeader
                        columnName="compliance"
                        columnWidth={columnWidths.compliance}
                        onResize={handleResize}
                      >
                         Compliance
                      </ResizableHeader>
                      <ResizableHeader
                        columnName="answer"
                        columnWidth={columnWidths.answer}
                        onResize={handleResize}
                      >
                         Answer
                      </ResizableHeader>
                      <th className="px-4 py-2   bg-[#E5E7EB] pr-7  text-left sticky -right-[1px]">
                        Actions
                      </th>
                      <th className="px-[2.5px]  sticky -right-[1px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionnaireData?.questionnaireRecords?.length > 0 ? (
                      questionnaireData?.questionnaireRecords
                        ?.sort((a, b) => a.id - b.id)
                        ?.map((item, index) => (
                          <tr
                            key={index}
                            className={`border-b text-standard ${
                              index % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }`}
                          >
                            <td className="px-4 py-2 text-center border w-[70px]">
                              <Checkbox
                                isSelected={bulkSelected.includes(item.id)}
                                onChange={() => handleCheckboxChange(item.id)}
                                className="2xl:text-[20px] !text-[50px]"
                                radius="none"
                                size="lg"
                                classNames={{ wrapper: "!rounded-[3px]" }}
                              />
                            </td>
                            <td className="px-4 py-2 text-center border ">
                              <div
                                className={`h-5 w-5 mx-auto rounded-full cursor-pointer border ${
                                  item.status === "approved"
                                    ? "bg-green-600"
                                    : item.status === "Flagged" ||
                                      item.confidence < 7
                                    ? "bg-yellow-500"
                                    : "bg-blue-600"
                                }`}
                              ></div>
                            </td>
                            <td className="px-4 py-2 border  ">
                              {item.question}
                            </td>
                            <td
                              className={`py-2 items-center  ${
                                item.confidence == 0
                                  ? "outline outline-[#FFC001] text-[#FFC001]  shadow-inner"
                                  : ""
                              }`}
                            >
                              <div className="w-[100%] mx-auto">
                                <div className={`text-[12px] flex  my-2 px-1 `}>
                                  {item.complianceGeneratedBy == "AI" ? (
                                    <p className=" italic text-left">A.I.</p>
                                  ) : (
                                    <p className=" italic text-left">Updated</p>
                                  )}
                                </div>
                                <select
                                  value={item.compliance || ""}
                                  onChange={(e) =>
                                    UpdateRecord(
                                      [item.id],
                                      "compliance",
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-standard rounded-lg bg-transparent"
                                >
                                  {/* Placeholder for "Select" */}
                                  <option disabled value="">
                                    {item.compliance ? "Select" : ""}
                                  </option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                  <option value="non-applicable">
                                    Not applicable
                                  </option>
                                  {!item.compliance && (
                                    <option value="">Empty</option>
                                  )}
                                </select>
                              </div>
                            </td>
                            <td
                              onClick={(e) => {
                                setSelectedTextAreaId(item.id);
                                setAnswerIsUpdate("single");
                              }}
                              className={`px-4 py-2 !text-wrap border ${
                                item.status === "approved"
                                  ? "" 
                                  : item.confidence < 7
                                  ? "outline outline-[#FFC001] text-[#FFC001] shadow-inner" // Confidence condition ke liye styling
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

                              {selectedTextAreaId === item.id ? (
                                <textarea
                                  // disabled={answerIsUpdate === "multiple" ? !updateMultipleAnswer(item.id) : false}
                                  value={item.answer}
                                  onChange={(e) => {
                                    handleChange(index, e.target.value);
                                    // Reset the height to auto to adjust downwards if needed
                                    // e.target.style.height = `${e.target.scrollHeight}px`;
                                  }}
                                  style={{ height: `${textAreaSize}px` }}
                                  className={`w-full text-wrap !h-[${textAreaSize}px] rounded-md focus:outline-none ring-2 px-2  ${
                                    item.status == "approved" &&
                                    selectedTextAreaId
                                      ? "ring-green-700"
                                      : item.status == "Flagged"
                                      ? "ring-yellow-500"
                                      : "ring-blue-500"
                                  } ${
                                    (updateMultipleAnswer(item.id) &&
                                      answerIsUpdate) ||
                                    (selectedTextAreaId === item.id &&
                                      answerIsUpdate)
                                      ? ""
                                      : "bg-transparent"
                                  } `}
                                ></textarea>
                              ) : (
                                <div
                                  ref={divRef}
                                  className="w-full break-words overflow-hidden !h-auto !text-wrap"
                                  onClick={(e) => {
                                    toggleEdit(item.id);
                                    setTextAreaSize(e.target.scrollHeight);
                                    setAnswerIsUpdate("single");
                                  }}
                                >
                                  {item.answer}
                                </div>
                              )}

                              <div
                                className={`text-[12px] flex justify-end my-2`}
                              >
                                {selectedTextAreaId === item.id &&
                                answerIsUpdate == "single" ? (
                                  <>
                                    <p
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setAnswerIsUpdate("");
                                        setSelectedTextAreaId("");
                                      }}
                                      className={` mx-2 text-standard bg-red-400   cursor-pointer rounded-sm px-2   text-white`}
                                    >
                                      Cancel
                                    </p>
                                    <p
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        UpdateRecord(
                                          [item.id],
                                          "answer",
                                          index
                                        );
                                        setAnswerIsUpdate("");
                                        setSelectedTextAreaId("");
                                      }}
                                      className={`text-standard rounded-lg ${
                                        item.status == "approved"
                                          ? "bg-green-700"
                                          : item.status == "Flagged"
                                          ? "bg-yellow-500"
                                          : "bg-blue-500"
                                      }  cursor-pointer rounded-sm px-2 text-white`}
                                    >
                                      Update
                                    </p>
                                  </>
                                ) : null}
                              </div>
                            </td>
                            <td
                              className={`px-4 py-2  border w-[100px] border-b-0 outline outline-[#E5E7EB] text-left sticky -right-[1px] ${
                                index % 2 === 0 ? "bg-gray-100" : "bg-white"
                              }`}
                            >
                              <div className="inline-flex space-x-2 text-[#A5A5A5]">
                                <Check
                                  size={17}
                                  style={{ strokeWidth: 3 }}
                                  className={` cursor-pointer ${
                                    item.status == "approved"
                                      ? "text-green-700"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    UpdateRecord(
                                      [item.id],
                                      "status",
                                      "approved"
                                    );
                                  }}
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
                                    {
                                      UpdateRecord(
                                        [item.id],
                                        "status",
                                        "Flagged"
                                      );
                                    }
                                  }}
                                />
                                <Eye
                                  size={17}
                                  className={`cursor-pointer ${
                                    selectedId == item.id && historyVisible
                                      ? "text-blue-600"
                                      : ""
                                  }`}
                                  style={{ strokeWidth: 3 }}
                                  onClick={() => {
                                    setSelectedId(item.id);

                                    if (selectedId == item.id) {
                                      setHistoryVisible((prev) => !prev);
                                    } else if (!selectedId) {
                                      setHistoryVisible((prev) => !prev);
                                    }
                                    // Toggle visibility
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
                                    <div className="px-3 py-2  space-y-1.5 text-standard cursor-pointer">
                                      <div
                                        // onClick={() => {
                                        //   setSelectedId(item.id);
                                        //   setAnswerIsUpdate(true);
                                        // }}
                                        onClick={() => {
                                          setOpenPopoverIndex(null);
                                          reRunForAnswer([item.id] ,"improveAnswer");
                                        }}
                                        className="text-standard cursor-pointer "
                                      >
                                        Improve answer
                                      </div>
                                      <div
                                        className="text-standard cursor-pointer"
                                        onClick={() => {
                                          setOpenPopoverIndex(null);
                                          reRunForAnswer([item.id]);
                                        }}
                                      >
                                        Re-run AI for compliance & answer
                                      </div>
                                      <div
                                        className="text-standard cursor-pointer"
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
                                        className="text-standard text-red-600 cursor-pointer"
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
                              className={`my-2 text-left sticky -right-[1px] ${
                                item.status === "approved"
                                  ? "bg-green-600"
                                  : item.status === "Flagged" ||
                                    item.confidence < 7
                                  ? "bg-yellow-500"
                                  : "bg-blue-600"
                              }`}
                            ></td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-5  px-4 text-center text-18px"
                        >
                          No question found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {historyVisible && (
                <div className="w-[25%] h-full flex flex-col overflow-auto">
                  <History
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    dataUpdate={dataUpdate}
                    setHistoryVisible={setHistoryVisible}
                    setSelectedOption={setSelectedOption}
                    selectedOption={selectedOption}
                    selectedQuestionnaireReference={
                      selectedQuestionnaireReference
                    }
                    referenceToggle={referenceToggle}
                    setReferenceToggle={setReferenceToggle}
                    reRunForAnswer={reRunForAnswer}
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
