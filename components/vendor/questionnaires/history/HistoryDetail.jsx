import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "@/helper";
import { formatDateWithTime } from "@/helper";

const HistoryDetail = ({ selectedId }) => {
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
      }
    } catch (error) {
      console.error("Error fetching Questionnaire:", error);
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchQuestionnaireRecordHistory();
    }
  }, [selectedId]);

  const getHistoryStructure = (record) => {
    switch (record.eventType) {
      case "complianceChanged":
        return (
          <div>
            <h1>Modified the compliance.</h1>
            <div>
              <h1>Compliance {record.currentValue}</h1>
            </div>
          </div>
        );

      case "statusChanged":
        return (
          <div>
            <h1>{record.currentValue} the question</h1>
          </div>
        );

        case "answerChanged":
        return (
          <div className="">
            
            <div className="flex gap-3">
            <h1>Modify the answer</h1>     
            </div>
            <h1>Answer: {record.currentValue}</h1>
            <h1></h1>
           
          </div>
        );

        case "answerUpdatedByAI":
          return (
            <div className="">
              
              <div className="flex gap-3">
              <h1>Improved the answered using Komcrest AI.</h1>          
              </div>
              {/* <h1>Answer: {record.currentValue}</h1>
              <h1></h1> */}
             
            </div>
          );

          case "Notification Sent":
          return (
            <div className="">
              
              <div className="flex gap-3">
              <h1>Notified <span className="font-bold">{record.user.firstName}</span> for help</h1>             
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
        historyRecord.map((record, index) => (
          <div key={index} className="my-4 bg-white p-3">
            <div className="flex gap-2">
              <p className="font-bold">{record.user.firstName}</p>
              <p>-</p>
              <p>{formatDateWithTime(record.updatedAt)}</p>
            </div>
            {getHistoryStructure(record)}
          </div>
        ))
      ) : (
        <p>No records found.</p>
      )}
    </div>
  );
};

export default HistoryDetail;
