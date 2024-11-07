import React, { useState ,useEffect  } from "react";
import { FilePenLine, Check, Eye, TriangleAlert, Filter } from "lucide-react";
import { Settings, Search } from "lucide-react";
import QuestionnairsListHeader from "./QuestionnairsListHeader";
import { Input } from "@nextui-org/react";
import History from "../history";
import useSocket from "@/customHook/useSocket";
import { useMyContext } from "@/context";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../../helper/index";



const SocketQuestionnairesList = () => {
  const { questionnaireData ,allQuestionnaireList } = useMyContext();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const token = cookiesData?.token;

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
        <div className="overflow-auto w-full h-[75vh]  bg-white border">
          <table className="min-w-full border-collapse border  text-gray-700">
            <thead className="border sticky -top-1 bg-[#E5E7EB] z-50">
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
                <th className="px-4 py-2 text-left text-gray-600 border min-w-[400px]">
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
                  <td className="px-4 py-2  border">
                  {item?.answer ? item.answer : <Settings className="text-blue-600 spin-slow" /> }
                  </td>
                  <td className="px-4 py-2 text-center border w-[100px]">
                    <div className="inline-flex space-x-2 text-[#A5A5A5]">
                      <Check size={17} />
                      <TriangleAlert size={17} />
                      <Eye size={17} />
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

export default SocketQuestionnairesList;
