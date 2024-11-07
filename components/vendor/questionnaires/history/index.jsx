import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import KnowledgeHistory from "./KnowledgeHistory";
import DocumentHistory from "./DocumentHistory";
import OnlineResourceHistory from "./OnlineResourceHistory";
import HistoryDetail from "./HistoryDetail";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../../helper";
import { useRouter } from "next/router";
import { json } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

const History = ({
  selectedId,
  setSelectedId,
  dataUpdate,
  setHistoryVisible,
  selectedOption,
  setSelectedOption,
  selectedQuestionnaireReference,
  setReferenceToggle,
  referenceToggle,
  reRunForAnswer,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const router = useRouter();
  const [referenceSelect, setReferenceSelect] = useState("knowledge");
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // reference ids
  const [onlineResourceIds, setOnlineResourceIds] = useState([]);
  const [questionIds, setQuestionIds] = useState([]);
  const [documentIds, setDocumentIds] = useState([]);

  // reference data
  const [questionReferenceData, setQuestionReferenceData] = useState([]);
  const [onlineResourceReferenceData, setOnlineResourceReferenceData] =
    useState([]);
  const [documentReferenceData, setDocumentReferenceData] = useState([]);

  const [referenceHaveDislike, setReferenceHaveDislike] = useState(false);

  useEffect(() => {
    setOnlineResourceIds(
      selectedQuestionnaireReference
        ?.filter((item) => item.referenceType === "OnlineResource")
        .map((item) => ({
          referenceId: item.referenceId,
          pageNumber: item.pageNumber,
          referenceStatus: item.likes,
          referenceRecordId: item.id,
        }))
    );
    setQuestionIds(
      selectedQuestionnaireReference
        ?.filter((item) => item.referenceType === "Question")
        .map((item) => ({
          referenceId: item.referenceId,
          referenceStatus: item.likes,
          referenceRecordId: item.id,
        }))
    );
    setDocumentIds(
      selectedQuestionnaireReference
        ?.filter((item) => item.referenceType === "Document")
        .map((item) => ({
          referenceId: item.referenceId,
          pageNumber: item.pageNumber,
          referenceStatus: item.likes,
          referenceRecordId: item.id,
        }))
    );
  }, [selectedQuestionnaireReference]);

  const fetchReferenceQuestion = async () => {
    const token = cookiesData && cookiesData.token;
    const referenceIds = questionIds.map((item) => item.referenceId);
    const paylaod = { ids: referenceIds };
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paylaod),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}/getQuestionsOnIds`,
        requestOptions
      );
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        console.log("::::::::::", data);

        const updatedArray = data.map((item) => {
          const match = questionIds.find((ref) => ref.referenceId === item.id);
          if (match) {
            return {
              ...item,
              referenceStatus: match.referenceStatus[0]?.likeType,
              referenceRecordId: match.referenceRecordId,
            };
          }
          return item;
        });

        setQuestionReferenceData(updatedArray);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching reference:", error);
    }
  };
  const fetchReferenceOnlineResource = async () => {
    const token = cookiesData && cookiesData.token;
    const referenceIds = onlineResourceIds.map((item) => item.referenceId);
    const paylaod = { ids: referenceIds };
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paylaod),
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/getResources`, requestOptions);
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        console.log("::::::::::", data);

        const updatedArray = data.map((item) => {
          const match = onlineResourceIds.find(
            (ref) => ref.referenceId === item.id
          );
          if (match) {
            return {
              ...item,
              pageNumber: match.pageNumber,
              referenceStatus: match.referenceStatus[0]?.likeType,
              referenceRecordId: match.referenceRecordId,
            };
          }
          return item;
        });
        setOnlineResourceReferenceData(updatedArray);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching reference:", error);
    }
  };
  const fetchReferenceDocument = async () => {
    const token = cookiesData && cookiesData.token;
    const referenceIds = documentIds.map((item) => item.referenceId);
    const paylaod = { ids: referenceIds };
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paylaod),
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/getDocuments`, requestOptions);
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        console.log(">>>>>>>>>>", data);

        const updatedArray = data.map((item) => {
          const match = documentIds.find((ref) => ref.referenceId === item.id);
          if (match) {
            return {
              ...item,
              pageNumber: match.pageNumber,
              referenceStatus: match.referenceStatus[0]?.likeType,
              referenceRecordId: match.referenceRecordId,
            };
          }
          return item;
        });

        setDocumentReferenceData(updatedArray);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching reference:", error);
    }
  };

  useEffect(() => {
    if (questionIds?.length > 0) {
      fetchReferenceQuestion();
    } else {
      setQuestionReferenceData([]);
    }
    if (onlineResourceIds?.length > 0) {
      fetchReferenceOnlineResource();
    } else {
      setOnlineResourceReferenceData([]);
    }
    if (documentIds?.length > 0) {
      fetchReferenceDocument();
    } else {
      setDocumentReferenceData([]);
    }
  }, [questionIds, onlineResourceIds, documentIds]);

  const handleChange = (event) => {
    setReferenceSelect(event.target.value);
  };

  const iconProps = {
    size: 18,
    strokeWidth: 6,
    className: "text-[#2457D7]",
  };

  // like unlike

  const statusUpdate = async (referenceRecordId, statusType) => {
    const token = cookiesData && cookiesData.token;
      let checkStatusType ;
      
      if (statusType === "like" || statusType === "removeLike") {
        checkStatusType = "like";
      } else if (statusType === "dislike" || statusType === "removeDislike") {
        checkStatusType = "dislike";
      }
    
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: checkStatusType == "dislike" ? JSON.stringify({questionnaireRecordId : selectedId}) : "",
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}/reference/${referenceRecordId}/${checkStatusType}`,
        requestOptions
      );
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        console.log(":>>>>>>>>>>>>>>>>>", data);
        toast.success(data.message);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching reference:", error);
    }
  };

  // check some one have dislike or not

  useEffect(() => {
    function checkDislikeStatusHave() {
      const allArrays = [
        ...questionReferenceData,
        ...onlineResourceReferenceData,
        ...documentReferenceData,
      ];

      const result = allArrays.some(
        (item) => item.referenceStatus === "dislike"
      );
      setReferenceHaveDislike((prev) => {
        return result;
      });
    }

    checkDislikeStatusHave();
  }, [
    questionReferenceData,
    onlineResourceReferenceData,
    documentReferenceData,
  ]);

  return (
    <div className="bg-[#F2F2F2] px-5 flex-1 overflow-scroll">
      <div className="sticky top-0 py-[7px]  z-50 bg-[#F2F2F2] space-y-3 ">
        <div className="flex justify-between  items-center ">
          <div className="flex items-center justify-between gap-10">
            <h1
              onClick={() => {
                setSelectedOption("references");
                setReferenceSelect("document");
              }}
              className={`text-xl font-bold cursor-pointer 2xl:text-[20px] text-[16px]  ${
                selectedOption === "references" ? "text-blue-600" : "text-gray-700"
              } `}
            >
              References 
            </h1>
            <h1
              onClick={() => setSelectedOption("history")}
              className={`text-xl font-bold  cursor-pointer 2xl:text-[20px] text-[16px]  ${
                selectedOption === "history" ? "text-blue-600" : "text-gray-700"
              } `}
            >
              History
            </h1>
          </div>
          <X
            className="cursor-pointer"
            onClick={() => {
              setSelectedId(null);
              setHistoryVisible(false);
            }}
          />
        </div>
      </div>
      { selectedOption === "references" && referenceHaveDislike && (
        <h1 onClick={()=>reRunForAnswer([selectedId])} className="underline text-blue-600 cursor-pointer 2xl:text-[20px] text-[16px]">
          Re run AI for compliance & answer by excluding non relevant references
        </h1>
      )}

      {selectedOption === "references" && (
        <div className="space-y-4 mt-5">
          <div
            className="flex justify-between items-center 2xl:text-[20px] text-[16px] cursor-pointer w-[60%]"
            onClick={() =>
              setReferenceToggle((prevState) => ({
                ...prevState,
                isDocumentOpen: !prevState.isDocumentOpen,
              }))
            }
          >
            <h1 className="2xl:text-[20px] text-[16px] font-bold">Documents</h1>
            {referenceToggle.isDocumentOpen ? (
              <ChevronDown {...iconProps} />
            ) : (
              <ChevronRight {...iconProps} />
            )}
          </div>
          {referenceToggle.isDocumentOpen && (
            <DocumentHistory
              documentReferenceData={documentReferenceData}
              statusUpdate={statusUpdate}
              setDocumentReferenceData={setDocumentReferenceData}
            />
          )}

          <div
            className="flex justify-between items-center 2xl:text-[20px] text-[16px] cursor-pointer w-[60%]"
            onClick={() =>
              setReferenceToggle((prevState) => ({
                ...prevState,
                isKnowledgeOpen: !prevState.isKnowledgeOpen,
              }))
            }
          >
            {" "}
            <h1 className="2xl:text-[20px] text-[16px] font-bold">
              Knowledge Base
            </h1>
            {referenceToggle.isKnowledgeOpen ? (
              <ChevronDown {...iconProps} />
            ) : (
              <ChevronRight {...iconProps} />
            )}
          </div>
          {referenceToggle.isKnowledgeOpen && (
            <KnowledgeHistory
              questionReferenceData={questionReferenceData}
              statusUpdate={statusUpdate}
              setQuestionReferenceData={setQuestionReferenceData}
            />
          )}

          <div
            className="flex justify-between items-center 2xl:text-[20px] text-[16px] cursor-pointer w-[60%]"
            onClick={() =>
              setReferenceToggle((prevState) => ({
                ...prevState,
                isOnlineOpen: !prevState.isOnlineOpen,
              }))
            }
          >
            <h1 className="2xl:text-[20px] text-[16px] font-bold">
              Online Reference
            </h1>
            {referenceToggle.isOnlineOpen ? (
              <ChevronDown {...iconProps} />
            ) : (
              <ChevronRight {...iconProps} />
            )}
          </div>
          {referenceToggle.isOnlineOpen && (
            <OnlineResourceHistory
              onlineResourceReferenceData={onlineResourceReferenceData}
              statusUpdate={statusUpdate}
              setOnlineResourceReferenceData={setOnlineResourceReferenceData}
            />
          )}
        </div>
      )}

      {selectedOption === "history" && (
        <HistoryDetail selectedId={selectedId} dataUpdate={dataUpdate} />
      )}
    </div>
  );
};

export default History;
