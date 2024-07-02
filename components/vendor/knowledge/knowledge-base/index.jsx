import React, { useEffect, useState } from "react";
import VendorHeader from "../../shared/VendorHeader";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { Settings } from "lucide-react";
import { FilePenLine } from "lucide-react";
import KnowledgeHeader from "../../shared/KnowledgeHeader";
import { useDisclosure } from "@nextui-org/react";
import DeleteQuestionModal from "./DeleteQuestionModal";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../../helper";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const KnowledgeBase = () => {
  const [openPopoverIndex, setOpenPopoverIndex] = React.useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedQuestion, setselectedQuestion] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [questionData, setQuestionData] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [isdeleted, setIsDeleted] = useState(false);
  const router = useRouter();

  const getQuestions = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/document-files`, requestOptions);
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        setQuestionData(data);
        console.log(">>>>>>>>>>>>>>>>>>>>>", data);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching user documents:", error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, [isdeleted]);

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
        setIsDeleted(!isdeleted);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <KnowledgeHeader buttonShow={true} />
      <div className="w-[86%] mx-auto py-2">
        <div class="relative w-[22%] my-2">
          <div class="absolute inset-y-0 right-2 flex items-center  pointer-events-none">
            <svg
              class="w-3 h-3 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            id="default-search"
            class="block  w-full py-[2px] pl-2 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50"
            placeholder="Search"
          />
        </div>
        {questionData ? (
          <div class="overflow-x-auto relative">
            <table class="min-w-full bg-white border border-gray-300">
              <thead class="bg-gray-200">
                <tr>
                  <th class="py-2 px-4 border border-gray-300 text-left">
                    Category
                  </th>
                  <th class="py-2 px-4 border border-gray-300 text-left">
                    Komcrast Category
                  </th>
                  <th class="py-2 px-4 border border-gray-300 text-left">
                    Question
                  </th>
                  <th class="py-2 px-4 border border-gray-300 text-left">
                    Coverage
                  </th>
                  <th class="py-2 px-4 border border-gray-300 text-left">
                    Answer
                  </th>
                  <th class="py-2 px-4 border border-gray-300 text-left">
                    Products
                  </th>
                  <th class="py-2 px-4 border border-gray-300 text-left">
                    Roadmap
                  </th>
                  <th class="py-2 px-4 border border-gray-300 text-left">
                    Curator
                  </th>
                  <th class="py-2 px-4 border border-gray-300 text-left">
                    Source
                  </th>
                  <th class="py-2 px-4 border border-gray-300 text-left">
                    Latest Update
                  </th>
                  <th class="py-2 px-4 border border-gray-300 text-left sticky right-0 bg-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {questionData &&
                  questionData.map((document) =>
                    document.questions.map((data, index) => (
                      <tr key={data.id} className="bg-white">
                        <td className="py-2 px-4 border border-gray-300">
                          {data.category}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          komcrast Category
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          {data.question}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          {data.coverage}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          {data.answer}
                        </td>

                        <td className="py-2 px-4 border border-gray-300">
                          {data.Products.map((product) => product.name).join(
                            ", "
                          )}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          {data.roadmap}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          {data.curator}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          Source
                        </td>

                        <td className="py-2 px-4 border border-gray-300">
                          {data.updatedAt}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 sticky -right-1 bg-white">
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
                                    setselectedQuestion(data);
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
