import React, { useState ,useEffect } from "react";
import { FilePenLine, Check, Eye, TriangleAlert, Filter } from "lucide-react";
import { Settings, Search } from "lucide-react";
import QuestionnairsListHeader from "./QuestionnairsListHeader";
import { Input } from "@nextui-org/react";
import History from "../history";
import useSocket from "@/customHook/useSocket";


const DummyQuestionnairesList = ({questionList ,questionnaireData}) => {

  const [allQuestionnaireList , setAllQuestionnireList] = useState(questionList)
  const socket = useSocket();
  
    const [showHistory ,setShowHistory] = useState(true)
    useEffect(() => {
      if (socket) { 
        socket.on("Question", (questionnaireRecord) => {
          console.log("questionnaireRecordquestionnaire:", questionnaireRecord);
          setAllQuestionnireList((prevState) => {
            // Map over the previous state to update it with the new incoming data
            let updatedUsers = prevState.map(data =>
              data.Question === questionnaireRecord.question
                ? { ...data, compliance: questionnaireRecord.compliance ,answer:questionnaireRecord.answer }
                : data
            );
        
            console.log("Updated Users:", updatedUsers);
            
            // Return the updated state
            return updatedUsers;
          });
        });
        
      }
    
      // Clean up on component unmount
      return () => {
        if (socket) {
          socket.off("Question");
        }
      };
    }, [socket]);
  return (
    <div>
      <QuestionnairsListHeader questionnaireData={questionnaireData}/>
      <div className="w-[86%] mx-auto">
        <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 my-2">
          <Input
            //   onChange={handleSearch}
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
          <div className="bg-white p-1 border border-gray-300 rounded-[5px] shadow-md cursor-pointer">
            <Filter size={26} className="text-gray-500" color="#2457d7" />
          </div>
         
        </div>
        <div className="flex gap-3 items-center">
        <Settings className="text-blue-600 spin-slow"/>
        <h1 className="text-blue-600">Komcrest AI is working to generate the best answers</h1>
        </div>
        </div>

        <div className="flex gap-4">
        <div className="overflow-auto w-full h-[80vh]  bg-white border">
          <table className="min-w-full border-collapse border text-gray-700">
            <thead className="border">
              <tr className="2xl:text-[20px] text-[16px]">
                <th className="px-4 py-2 text-left text-gray-600 border"></th>
                <th className="px-4 py-2 text-left text-gray-600 border">
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
              </tr>
            </thead>
            <tbody>
              {allQuestionnaireList?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b 2xl:text-[20px] text-[16px]"
                >
                  <td className="px-4 py-2 text-center border w-[70px]">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4"
                      checked={item.status}
                    />
                  </td>
                  <td className="px-4 py-2 text-center border w-[70px]">
                    {/* Status Circle */}
                    <div
                      className={`h-5 w-5 mx-auto rounded-full  ${
                        item.status ? "bg-green-500" : "bg-[#F2F2F2]"
                      }`}
                    ></div>
                  </td>
                  <td className="px-4 py-2 border  w-[500px]">
                    {item.Question}
                  </td>
                  <td className="px-4 py-2 text-center border w-[100px]">
                  {item?.compliance ? item.compliance  : <Settings className="text-blue-600 spin-slow" /> }
                    
                  </td>
                  <td className="px-4 py-2 text-center border">
                  {item?.answer ? item.answer : <Settings className="text-blue-600 spin-slow" /> }
                  </td>
                  <td className="px-4 py-2 text-center border w-[100px]">
                    <div className="inline-flex space-x-2 text-[#A5A5A5]">
                      <Check size={17} />
                      <TriangleAlert size={17} />
                      <Eye size={17} onClick={()=>setShowHistory(!showHistory)}/>
                      <FilePenLine size={17} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DummyQuestionnairesList;






// [
//   {
//       "Question": "Sodexo must own legally the user data and have the right to use the data for analyses and to create solutions (algorithms).",
//       "sheetTag": "Data Ownership"
//   },
//   {
//       "Question": "Staffbase Answer: This is covered in Online Terms (Clause 6) \"Rights in Customer Data. As between the parties, Customer retains all right, title, and interest (including any intellectual property rights) in and to the Customer Data. Customer hereby grants Staffbase a non-exclusive, worldwide, royalty-free right and license to collect, use, copy, display, perform, store, transmit, modify, and create derivative works of the Customer Data solely to the extent necessary to provide the Staffbase Service and related services to Customer.\" https://staffbase.com/en/terms/",
//       "sheetTag": "Data Ownership"
//   },
//   {
//       "Question": "Data access:",
//       "sheetTag": "Data Ownership"
//   },
//   {
//       "Question": "Partner must commit on providing access by design (eg. API or other) that are compliant with SDX Global Data Platform ingestion procedures. ",
//       "sheetTag": "Data Ownership"
//   },
//   {
//       "Question": "Access requirements must be formalized in contract, with the right Service Levels agreement (quantified), and penalties",
//       "sheetTag": "Data Ownership"
//   },
//   {
//       "Question": "Staffbase: Can you please supply the SDX Global Data Platform ingestion procedures",
//       "sheetTag": "Data Ownership"
//   },
//   {
//       "Question": "Commitment on data quality and documentation:",
//       "sheetTag": "Data Ownership"
//   },
//   {
//       "Question": "Data quality levels must be documented and included in the contract, with quantified metrics, associated SLAs and penalties and reviewed by our Data Office",
//       "sheetTag": "Data Ownership"
//   },
//   {
//       "Question": "Partners data must be well documented to enable the use of the data",
//       "sheetTag": "Data Ownership"
//   },
//   {
//       "Question": "Staffbase: Still checking with legal team for proper response - will come back to you",
//       "sheetTag": "Data Ownership"
//   }
// ]