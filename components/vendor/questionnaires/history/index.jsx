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

const History = ({
  selectedId,
  setSelectedId,
  dataUpdate,
  setHistoryVisible,
  selectedOption,
  setSelectedOption,
  selectedQuestionnaireReference,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const router = useRouter();
  const [referenceSelect, setReferenceSelect] = useState("knowledge");
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(true);
  const [isDocumentOpen, setIsDocumentOpen] = useState(true);
  const [isOnlineOpen, setIsOnlineOpen] = useState(true);

  // reference ids
  const [onlineResourceIds, setOnlineResourceIds] = useState([]);
  const [questionIds, setQuestionIds] = useState([]);
  const [documentIds, setDocumentIds] = useState([]);

  // reference data
  const [questionReferenceData, setQuestionReferenceData] = useState([]);
  const [onlineResourceReferenceData, setOnlineResourceReferenceData] =
    useState([]);
  const [documentReferenceData, setDocumentReferenceData] = useState([]);

  useEffect(() => {
    setOnlineResourceIds(
      selectedQuestionnaireReference
        ?.filter((item) => item.referenceType === "OnlineResource")
        .map((item) => item.referenceId)
    );
    setQuestionIds(
      selectedQuestionnaireReference
        ?.filter((item) => item.referenceType === "Question")
        .map((item) => item.referenceId)
    );
    setDocumentIds(
      selectedQuestionnaireReference
        ?.filter((item) => item.referenceType === "Document")
        .map((item) => item.referenceId)
    );
  }, [selectedQuestionnaireReference]);

  const fetchReferenceQuestion = async () => {
    const token = cookiesData && cookiesData.token;
    const paylaod = { ids: questionIds };
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
        setQuestionReferenceData(data);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching reference:", error);
    }
  };
  const fetchReferenceOnlineResource = async () => {
    const token = cookiesData && cookiesData.token;
    const paylaod = { ids: onlineResourceIds };
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
        setOnlineResourceReferenceData(data);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching reference:", error);
    }
  };
  const fetchReferenceDocument = async () => {
    const token = cookiesData && cookiesData.token;
    const paylaod = { ids: documentIds };
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
        console.log("::::::::::", data);
        setDocumentReferenceData(data);
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

  // useEffect(()=>{
  //   if(onlineResourceIds?.length > 0 ){
  //     fetchReferenceOnlineResource()
  //   }
  // },[onlineResourceIds])

  // useEffect(()=>{
  //   if(documentIds?.length > 0 ){
  //     fetchReferenceDocument()
  //   }
  // },[documentIds])

  const handleChange = (event) => {
    setReferenceSelect(event.target.value);
  };

  const iconProps = {
    size: 18,
    strokeWidth: 6,
    className: "text-[#2457D7]",
  };

  return (
    <div className="bg-[#F2F2F2] px-5 h-[75vh] overflow-scroll">
      <div className="sticky top-0 py-5  z-50 bg-[#F2F2F2] space-y-3 ">
        <div className="flex justify-between  items-center ">
          <div className="flex items-center justify-between gap-10">
            <h1
              onClick={() => {
                setSelectedOption("references");
                setReferenceSelect("document");
              }}
              className={`text-xl font-bold cursor-pointer 2xl:text-[20px] text-[16px]  ${
                selectedOption === "references" ? "text-blue-600" : ""
              } `}
            >
              References
            </h1>
            <h1
              onClick={() => setSelectedOption("history")}
              className={`text-xl font-bold cursor-pointer 2xl:text-[20px] text-[16px]  ${
                selectedOption === "history" ? "text-blue-600" : ""
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

        {/* {selectedOption === "references" && (
          <div className="flex items-center">
            <select
              className="w-[150px] text-[15px] border rounded-lg pr-3 p-2"
              value={referenceSelect}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="document">Document</option>
              <option value="online">Online Resource</option>
              <option value="knowledge">Knowledge</option>
            </select>
          </div>
        )} */}
      </div>

      {/* Conditionally render components based on selected option */}
      {/* {referenceSelect === "knowledge" && selectedOption === "references" && (
        <KnowledgeHistory questionReferenceData={questionReferenceData} />
      )}
      {referenceSelect === "document" && selectedOption === "references" && (
        <DocumentHistory documentReferenceData={documentReferenceData} />
      )}
      {referenceSelect === "online" && selectedOption === "references" && (
        <OnlineResourceHistory
          onlineResourceReferenceData={onlineResourceReferenceData}
        />
      )} */}

      {selectedOption === "references" && (
        <div className="space-y-4 mt-5">
          <div
            className="flex justify-between items-center 2xl:text-[20px] text-[16px] cursor-pointer w-[60%]"
            onClick={() => setIsDocumentOpen(!isDocumentOpen)}
          >
            <h1>Documents</h1>
            {isDocumentOpen ? (
              <ChevronDown {...iconProps} />
            ) : (
              <ChevronRight {...iconProps} />
            )}
          </div>
          {isDocumentOpen && (
            <DocumentHistory documentReferenceData={documentReferenceData} />
          )}

          <div
            className="flex justify-between items-center 2xl:text-[20px] text-[16px] cursor-pointer w-[60%]"
            onClick={() => setIsKnowledgeOpen(!isKnowledgeOpen)}
          >
            {" "}
            <h1>Knowledge Base</h1>
            {isKnowledgeOpen ? (
              <ChevronDown {...iconProps} />
            ) : (
              <ChevronRight {...iconProps} />
            )}
          </div>
          {isKnowledgeOpen && (
            <KnowledgeHistory questionReferenceData={questionReferenceData} />
          )}

          <div
            className="flex justify-between items-center 2xl:text-[20px] text-[16px] cursor-pointer w-[60%]"
            onClick={() => setIsOnlineOpen(!isOnlineOpen)}
          >
            <h1>Online Reference</h1>
            {isOnlineOpen ? (
              <ChevronDown {...iconProps} />
            ) : (
              <ChevronRight {...iconProps} />
            )}
          </div>
          {isOnlineOpen && (
            <OnlineResourceHistory
              onlineResourceReferenceData={onlineResourceReferenceData}
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
