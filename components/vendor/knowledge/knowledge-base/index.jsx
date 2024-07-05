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

const KnowledgeBase = ({ questionData, setQuestionData, setDataIsLoaded ,setIsDeleted ,isDeleted }) => {
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

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
        setIsDeleted(!isDeleted);
      })
      .catch((error) => console.error(error));
  };

  const handleKomcrastCategoryChange = (id, value) => {
    // Your logic to handle Komcrast category change
  };

  return (
    <div>
      <KnowledgeHeader buttonShow={true} />
      <div className="w-[86%] mx-auto py-2">
        <div className="relative w-[22%] my-2">
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <svg
              className="w-3 h-3 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            id="default-search"
            className="block w-full py-[2px] pl-2 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50"
            placeholder="Search"
          />
        </div>
        {questionData && questionData.length > 0 ? (
          <div className="overflow-x-auto relative h-[72vh]">
            <table style={{ width: "100%" }} className="min-w-full bg-white border border-gray-300 ">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border border-gray-300 text-left">
                    <input type="checkbox" />
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
                    <tr key={data.id} className="bg-white">
                      <td className="py-2 px-4 border border-gray-300">
                        <input type="checkbox" />
                      </td>
                      <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">
                        {data.category}
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        <select
                          value={data.komcrastCategory}
                          onChange={(e) =>
                            handleKomcrastCategoryChange(data.id, e.target.value)
                          }
                          className="py-1 px-2"
                        >
                          <option value="Overview">Overview</option>
                          <option value="Access Management">
                            Access Management
                          </option>
                          <option value="Application & Data Security">
                            Application & Data Security
                          </option>
                          <option value="Cloud Security">Cloud Security</option>
                          <option value="Device Management">
                            Device Management
                          </option>
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
                        Source
                      </td>
                      <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">
                        {formatDate(data.updatedAt)}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 sticky right-0 bg-white">
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
                            <div className="px-3 py-2 space-y-1.5">
                              <div
                                className="text-small cursor-pointer 2xl:text-[18px]"
                                onClick={() =>
                                  router.push(
                                    `/vendor/knowledge/AddQuestion?id=${data.id}`
                                  )
                                }
                              >
                                Update
                              </div>
                              <div
                                className="text-small text-red-600 cursor-pointer 2xl:text-[18px]"
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
