import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "@/helper";
import { formatDateWithTime } from "@/helper";
import { ArrowRight } from "lucide-react";

const HistoryDetail = ({ selectedId, dataUpdate }) => {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [historyRecord, setHistoryRecord] = useState([]);
  const fetchQuestionnaireRecordHistory = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}/questionnairerecord-history/${selectedId}`,
        requestOptions
      );
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        console.log("data::::::", data);
        setHistoryRecord(data);
        // setQuestionnaireData(transformData);
      } else {
        toast.error(data?.error);
        setHistoryRecord([]);
      }
    } catch (error) {
      console.error("Error fetching Questionnaire:", error);
      setHistoryRecord([]);
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchQuestionnaireRecordHistory();
    }
  }, [selectedId, dataUpdate]);



  function capitalizeFirstLetter(string) {
    if (!string) return ''; 
    return string.charAt(0).toUpperCase() + string.slice(1);
  }




  const getHistoryStructure = (record) => {
    switch (record.eventType) {
      case "complianceChanged":
        return (
          <div>
            <h1>Modified the compliance.</h1>
            <div>
              <h1 className="flex items-center gap-1">
                Compliance : {capitalizeFirstLetter(record?.previousValue)} <ArrowRight size={15} />{" "}
                {record.currentValue}
              </h1>
            </div>
          </div>
        );

      case "statusChanged":
        return (
          <div>
            <h1>{capitalizeFirstLetter(record.currentValue)} the question</h1>
          </div>
        );

      case "answerChanged":
        return (
          <div className="">
            <div className="flex gap-3">
            {/* "Improved the answer" is only when improve from AI */}
              <h1>Updated the answer.</h1>
            </div>
            <h1>Answer: {record.currentValue}</h1>
            <h1></h1>
          </div>
        );

      case "answerUpdatedByAI":
        return (
          <div className="">
            <div className="flex gap-3">
              {/* <h1>Improved the answered using Komcrest AI.</h1>           */}
              <h1>Re-ran AI for compliance & answer.</h1>
            </div>
          </div>
        );

      case "Notification Sent":
        return (
          <div className="">
            <div className="flex gap-3">
              <h1>
                Notified{" "}
                <span className="font-bold">
                  {record?.recipients?.map((recipient, index) => (
                    <span className="text-bold" key={index}>{recipient.firstName} {index+1 == record?.recipients.length ? "" : ","} </span>
                  ))}
                </span>{" "}
                for help
              </h1>
            </div>
          </div>
        );
      default:
        return <h1>Default case</h1>;
    }
  };

  return (
    <div>
      {historyRecord.length > 0 ? (
        historyRecord
          ?.sort((a, b) => b.id - a.id)
          ?.map((record, index) => (
            <div key={index} className="my-4 bg-white p-3  break-words">
              <div className="flex gap-2">
                <p className="font-bold text-wrap">
                  {record.user.firstName} -{" "}
                  {formatDateWithTime(record.updatedAt)}{" "}
                </p>
              </div>
              {getHistoryStructure(record)}
            </div>
          ))
      ) : (
        <p>No history found.</p>
      )}
    </div>
  );
};

export default HistoryDetail;
