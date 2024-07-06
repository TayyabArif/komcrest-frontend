import React, { useEffect, useState } from "react";
import VendorHeader from "../../shared/VendorHeader";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { FilePenLine } from "lucide-react";
import KnowledgeHeader from "../../shared/KnowledgeHeader";
import { useDisclosure } from "@nextui-org/react";
import DeleteQuestionModal from "./DeleteQuestionModal";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../../helper";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import {formatDate} from "../../../../helper"
import { Filter } from 'lucide-react';
import {Input} from "@nextui-org/react";
import { Search } from 'lucide-react';

const komcrestCategories = [
  {value: "Overview", text: "Overview"},
  {value: "Access Management", text: "Access Management"},
  {value: "Application & Data Security", text: "Application & Data Security"},
  {value: "Artificial Intelligence", text: "Artificial Intelligence"},
  {value: "Cloud Security", text: "Cloud Security"},
  {value: "Device Management", text: "Device Management"},
  {value: "Disaster Recovery", text: "Disaster Recovery"},
  {value: "ESG", text: "ESG"},
  {value: "Incident Management", text: "Incident Management"},
  {value: "Legal", text: "Legal"},
  {value: "Privacy", text: "Privacy"},
  {value: "Risk and Vulnerability Management", text: "Risk and Vulnerability Management"},
  {value: "Security Governance", text: "Security Governance"},
  {value: "Vendor Management", text: "Vendor Management"}
]
const KnowledgeBase = ({ questionData, setQuestionData, setDataIsLoaded ,setDataUpdate ,dataUpdate, isLoading }) => {
  console.log("+++++++",  questionData)
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const [filterData , setFilterData] = useState([])

  const handleSearch = (event) => {
  
    // const query = event.target.value.toLowerCase();
    // // setSearchQuery(query);
    // const filterData = questionData.map((document) =>
    //   document.questions.filter(item => {
    //     // Start with match on category or question
    //     const categoryStartsWith = item.category?.toLowerCase().startsWith(query);
    //     const questionStartsWith = item.questions?.some(question => question.question.toLowerCase().startsWith(query));
  
    //     return categoryStartsWith || questionStartsWith;
    //   })
    // )


    // // setQuestionData({
    // //   ...questionData,
    // //   questions:filterData
    // // })



    // console.log(">>>>>>>>>>",filterData)
  };
  


  const handleDelete = async () => {
    const token = cookiesData.token;
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };
    fetch(`${baseUrl}/questions/${selectedQuestion?.id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log("$$$$$$$$$", result);
        toast.success("Question deleted successfully");
        setDataUpdate(!dataUpdate);
      })
      .catch((error) => console.error(error));
  };

  const handleKomcrastCategoryChange = (id, value) => {
    const jsonPayload = JSON.stringify({ komcrestCategory : value});
    let requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${cookiesData?.token}`,
        "Content-Type": "application/json"
      },
      body: jsonPayload,
      redirect: "follow",
    };

    fetch(`${baseUrl}/questions/${id}`, requestOptions)
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
          toast.success("Question updated successfully");
          setDataUpdate(!dataUpdate);
        } else {
          toast.error(data?.error);
          console.error("Error:", data);
        }
      })
      .catch((error) => console.error(error));
  
  };

  return (
    <div>
      <KnowledgeHeader buttonShow={true} />
      <div className="w-[86%] mx-auto py-2">
        <div className="flex items-center gap-1 mb-2">
        <Input
        onChange={handleSearch}
        variant="bordered"
        placeholder="Search"
        endContent={
          <Search size={18}/>
        }
        type="text"
        classNames={{inputWrapper: "bg-white rounded-md"}}
        className="max-w-xs"
      />
       
        <div className="bg-white p-1 border border-gray-300 rounded-[5px] "> <Filter size={26} className="text-gray-500"/></div>
       
        </div>    
        {questionData && questionData.length > 0 ? (
          <div className="overflow-x-auto relative h-[72vh]">
            <table style={{ width: "100%" }} className="min-w-full bg-white border border-gray-300 ">
              <thead className="bg-gray-200">
                <tr className="text-[18px] 2xl:text-[20px]">
                  <th className="py-2 px-4 border border-gray-300 text-left">
                    <input type="checkbox" className=""/>
                  </th>
                  <th className="py-2 px-4 border border-gray-300 text-left">
                    Category
                  </th>
                  <th className="py-2 px-4 border border-gray-300 text-left">
                    Komcrast Category
                  </th>
                  <th className="py-2 px-4 border border-gray-300 text-left">
                    Question
                  </th>
                  <th className="py-2 px-4 border border-gray-300 text-left">
                    Coverage
                  </th>
                  <th className="py-2 px-4 border border-gray-300 text-left">
                    Answer
                  </th>
                  <th className="py-2 px-4 border border-gray-300 text-left">
                    Products
                  </th>
                  <th className="py-2 px-4 border border-gray-300 text-left">
                    Roadmap
                  </th>
                  <th className="py-2 px-4 border border-gray-300 text-left">
                    Curator
                  </th>
                  <th className="py-2 px-4 border border-gray-300 text-left">
                    Source
                  </th>
                  <th className="py-2 px-4 border border-gray-300 text-left">
                    Latest Update
                  </th>
                  <th className="py-2 px-4 border border-gray-300 text-left sticky right-0 bg-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {questionData.map((document) =>
                  document.questions.map((data, index) => (
                    <tr key={data.id} className="bg-white text-[18px] 2xl:text-[20px]">
                      <td className="py-2 px-4 border border-gray-300">
                        <input type="checkbox" />
                      </td>
                      <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">
                        {data.category}
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        <select
                          value={data.komcrestCategory}
                          onChange={(e) =>
                            handleKomcrastCategoryChange(data.id, e.target.value)
                          }
                          className="py-1 px-2"
                        >
                          {komcrestCategories?.map((item, index) => (
                              <option key={index} value={item?.value}>{item?.text}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-4 border border-gray-300 max-w-xs truncate">
                        {data.question}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">
                        {data.coverage}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 max-w-xs truncate">
                        {data.answer}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 max-w-xs truncate">
                        {data.Products.map((product) => product.name).join(", ")}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 max-w-xs truncate">
                        {data.roadmap}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">
                        {data.curator}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">
                        {document?.name}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">
                        {formatDate(data.updatedAt)}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 sticky right-0 bg-white pl-8">
                        <Popover
                          className="rounded-[0px]"
                          isOpen={openPopoverIndex === index}
                          onOpenChange={(open) =>
                            setOpenPopoverIndex(open ? index : null)
                          }
                        >
                          <PopoverTrigger>
                            <FilePenLine
                              size={20}
                              className="cursor-pointer"
                              color="#2457d7"
                              strokeWidth={2}
                            />
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="px-3 py-2 space-y-2">
                              <div
                                className="text-small cursor-pointer 2xl:text-[20px]"
                                onClick={() =>
                                  router.push(
                                    `/vendor/knowledge/AddQuestion?id=${data.id}`
                                  )
                                  // console.log("###############", data?.id)
                                }
                              >
                                Update
                              </div>
                              <div
                                className="text-small text-red-600 cursor-pointer 2xl:text-[20px]"
                                onClick={() => {
                                  setSelectedQuestion(data);
                                  onOpen();
                                  setOpenPopoverIndex(null);
                                }}
                              >
                                Delete
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <DeleteQuestionModal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              handleSubmit={handleDelete}
            />
          </div>
        ) : (
          <p>No data to display</p>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
