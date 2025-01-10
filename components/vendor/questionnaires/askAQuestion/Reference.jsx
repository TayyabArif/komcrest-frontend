import React, { useEffect, useState } from "react";

import { Textarea, Input } from "@nextui-org/react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useCookies } from "react-cookie";
import { handleResponse } from '@/helper';
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import KnowledgeHistory from "../history/KnowledgeHistory";
import DocumentHistory from "../history/DocumentHistory";
import OnlineResourceHistory from "../history/OnlineResourceHistory";

const Reference = ({reference}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

    // reference ids
    const [onlineResourceIds, setOnlineResourceIds] = useState([]);
    const [questionIds, setQuestionIds] = useState([]);
    const [documentIds, setDocumentIds] = useState([]);
  
    // reference data
    const [questionReferenceData, setQuestionReferenceData] = useState([]);
    const [onlineResourceReferenceData, setOnlineResourceReferenceData] =
      useState([]);
    const [documentReferenceData, setDocumentReferenceData] = useState([]);

  const [referenceToggle, setReferenceToggle] = useState({
    isKnowledgeOpen: true,
    isDocumentOpen: true,
    isOnlineOpen: true,
  });
  const iconProps = {
    size: 18,
    strokeWidth: 6,
    className: "text-[#2457D7]",
  };


  useEffect(() => {
    const updatedQuestionIds = reference?.questions?.map((item) => item.id) || [];
    const updatedOnlineResourceIds = reference?.onlineResources?.map((item) => item.id) || [];
    const updatedDocumentIds = reference?.documents?.map((item) => item.id) || [];
    
    // Set state


    // console.log("updatedQuestionIdsupdatedQuestionIds",updatedQuestionIds)
    setQuestionIds(updatedQuestionIds);
    setOnlineResourceIds(updatedOnlineResourceIds);
    setDocumentIds(updatedDocumentIds);
  }, [reference]);
 
  
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


  const fetchReferenceQuestion = async () => {
    const token = cookiesData && cookiesData.token;
    // const referenceIds = questionIds.map((item) => item.referenceId);
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

        const updatedArray = data.map((item) => {
          const match = questionIds.find((ref) => ref.referenceId === item.id);
          if (match) {
            return {
              ...item,
              referenceStatus: match.referenceStatus[0]?.likeType,
              referenceRecordId: match.referenceRecordId,
              referenceString : match.referenceString
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
              referenceString : match.referenceString
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
        console.log(">>>>>>>>>>", data);

        const updatedArray = data.map((item) => {
          const match = documentIds.find((ref) => ref.referenceId === item.id);
          if (match) {
            return {
              ...item,
              pageNumber: match.pageNumber,
              referenceStatus: match.referenceStatus[0]?.likeType,
              referenceRecordId: match.referenceRecordId,
              referenceString : match.referenceString
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

  return (
    <div className="w-[23%] bg-[#F2F2F2] h-[500px] px-5 pb-3 overflow-auto rounded">
      <div className="sticky top-0 bg-[#F2F2F2]  z-50"> 
      <h1 className="pb-2 py-5 font-bold ">Reference</h1>
      <hr
        style={{ height: "2px", backgroundColor: "#E4E4E7", border: "none" }}
      />
      </div>

      <div className="space-y-4 mt-5">
        <div
          className="flex justify-between items-center text-standard cursor-pointer w-[60%]"
          onClick={() =>
            setReferenceToggle((prevState) => ({
              ...prevState,
              isDocumentOpen: !prevState.isDocumentOpen,
            }))
          }
        >
          <h1 className="text-standard font-bold">Documents</h1>
          {referenceToggle.isDocumentOpen ? (
            <ChevronDown {...iconProps} />
          ) : (
            <ChevronRight {...iconProps} />
          )}
        </div>
        {referenceToggle.isDocumentOpen && (
          <DocumentHistory
            documentReferenceData={documentReferenceData}
          />
        )}

        <div
          className="flex justify-between items-center text-standard cursor-pointer w-[60%]"
          onClick={() =>
            setReferenceToggle((prevState) => ({
              ...prevState,
              isKnowledgeOpen: !prevState.isKnowledgeOpen,
            }))
          }
        >
          {" "}
          <h1 className="text-standard font-bold">
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
          
          />
        )}

        <div
          className="flex justify-between items-center text-standard cursor-pointer w-[60%]"
          onClick={() =>
            setReferenceToggle((prevState) => ({
              ...prevState,
              isOnlineOpen: !prevState.isOnlineOpen,
            }))
          }
        >
          <h1 className="text-standard font-bold">
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
        
          />
        )}
      </div>
    </div>
  );
};

export default Reference;
