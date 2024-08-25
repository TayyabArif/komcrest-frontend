import React ,{useEffect, useState} from 'react'
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse  } from '@/helper'; 
import { formatDateWithTime } from '@/helper';

const HistoryDetail = ({selectedId}) => {
    const router = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
    const cookiesData = cookies.myCookie;
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [historyRecord ,setHistoryRecord] = useState([])


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
            console.log("data::::::",data)
            setHistoryRecord(data)
            // setQuestionnaireData(transformData);
          } else {
            toast.error(data?.error);
          }
        } catch (error) {
          console.error("Error fetching Questionnaire:", error);
        }
      };
    
      useEffect(() => {
        if(selectedId){
        fetchQuestionnaireRecordHistory();
        }
      }, [selectedId]);

  return (

    <div>
            {historyRecord.length > 0 ? (
                historyRecord.map((record, index) => (
                    <div key={index} className='my-4 bg-white p-3'>
                        <div className='flex gap-2'>
                            <p className='font-bold'>{record.user.firstName}</p>
                            <p>-</p>
                            <p>{formatDateWithTime(record.updatedAt)}</p>
                        </div>
                        {/* <p>Notified Mohammed Tayyab for help.</p> */}
                        <p>{record.currentValue}</p> the question
                    </div>
                ))
            ) : (
                <p>No records found.</p>
            )}
        </div>
   
  )
}

export default HistoryDetail