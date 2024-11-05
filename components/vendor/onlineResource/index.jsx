import React, { useState, useEffect } from "react";
import KnowledgeHeader from "../shared/KnowledgeHeader";
import ResourceHome from "./ResourceHome";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  CircularProgress,
  Checkbox,
  Button,
} from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import { FilePenLine } from "lucide-react";
import DeleteModal from "../shared/DeleteModal";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../helper";
import { toast } from "react-toastify";
import { formatDateWithTime } from "../../../helper";
import { handleDownload } from "@/helper";

const headerData = {
  title: "Online resources",
  desc1: "Seamlessly integrate external information into your account.",
  desc2:
    "This ensures that Komcrest AI draws upon the most up-to-date and pertinent answers when addressing your questions.",
  addSingle: "Add new URLs",
  singlePath: "/vendor/onlineResource/addResources",
};

const deleteModalContent = "Are you sure to delete this online resource?";

const OnlineResourceComponent = () => {
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [onlineResourceData, setOnlineResourceData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [dataUpdate, setDataUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  const [bulkDeleted, setBulkDeleted] = useState([]);
  const [deleteAction, setDeleteAction] = useState("");

  const getAllResourceData = async () => {
    setIsLoading(true);
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/resources`, requestOptions);
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        setOnlineResourceData(data);
      } else {
        toast.error(data?.error);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching user documents:", error);
    }
  };

  useEffect(() => {
    getAllResourceData();
  }, [dataUpdate]);

  const handleSingleDelete = async () => {
    const token = cookiesData.token;
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}/resource/${selectedId}`,
        requestOptions
      );
      const result = await response.text();

      if (response.ok) {
        toast.success("Resource deleted successfully");
        setDataUpdate(!dataUpdate);
      } else {
        toast.error("Failed to delete the question");
      }

      console.log(result);
    } catch (error) {
      console.error("Error deleting the question:", error);
      toast.error("An error occurred while deleting the question");
    }
  };

  const handleBulkDelete = async () => {
    const token = cookiesData?.token;
    
    if (!token) {
      toast.error("Authorization token is missing");
      return;
    }
  
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: bulkDeleted }),
      redirect: "follow",
    };
  
    try {
      const response = await fetch(`${baseUrl}/resource/delete`, requestOptions);
      const result = await response.json();
  
      if (response.ok) {
        toast.success("Online Resources deleted successfully");
        setDataUpdate((prevState) => !prevState);
        setBulkDeleted([]);
      } else {
        const errorMessage = result?.message || "Failed to delete resources";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Bulk delete error:", error.message);
      toast.error("Error deleting resources");
    }
  };
  

  const handleDelete = () => {
    if (deleteAction == "single") {
      handleSingleDelete();
    } else {
      handleBulkDelete();
    }
  };

  const handleCheckboxChange = (id) => {
    let payload = [...bulkDeleted];
    if (bulkDeleted.includes(id)) {
      payload = bulkDeleted.filter((item) => item !== id);
    } else {
      payload = [...payload, id];
    }
    setBulkDeleted(payload);
    console.log(">>>>>>>>>>>>", payload);
  };

  const handleHeaderCheckboxChange = () => {
    if (isHeaderChecked) {
      setBulkDeleted([]);
      setIsHeaderChecked(false);
    } else {
      const allIds = onlineResourceData.map((data) => data.id);
      setBulkDeleted(allIds);
      setIsHeaderChecked(true);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col gap-2 bg-gray-200 items-center justify-center pl-20 pr-10 py-3 min-h-screen">
          <CircularProgress label="Fetching Resources..." size="lg" />
        </div>
      ) : (
        <div>
          <KnowledgeHeader
            headerData={headerData}
            buttonShow={onlineResourceData.length > 0 ? true : false}
          />
          {onlineResourceData.length > 0 ? (
            <div className=" w-[85%] mx-auto   flex flex-col h-[80vh] 2xl:h-[82vh]">
              <div className="flex justify-end h-[40px]">
                {bulkDeleted.length > 0 && (
                  <Button
                    size="md"
                    className="rounded-md 2xl:text-[20px] cursor-pointer text-red-600 bg-transparent  text-[13px] font-semibold"
                    onClick={() => {
                      onOpen();
                      setDeleteAction("bulk");
                    }}
                  >
                    Delete Selection
                  </Button>
                )}
              </div>
              <div className="w-[100%] overflow-x-auto flex-1 relative ">
                <table className="">
                  <thead className="block md:table-header-group sticky -top-1 z-30 ">
                    <tr className="border text-[16px] 2xl:text-[20px] ">
                      <th className="py-2 px-4 border  text-left bg-gray-200">
                        <Checkbox
                          isSelected={isHeaderChecked}
                          onChange={handleHeaderCheckboxChange}
                          className="2xl:text-[20px] !text-[50px]"
                          radius="none"
                          size="lg"
                          classNames={{ wrapper: "!rounded-[3px]" }}
                        />
                      </th>
                      <th className="bg-gray-200 !max-w-[100px] px-2 font-bold md:border md: text-left block md:table-cell ">
                        Title
                      </th>
                      <th className="bg-gray-200 p-1  font-bold md:border md: text-left block md:table-cell">
                        URL
                      </th>
                      <th className="bg-gray-200 p-1  font-bold md:border md: text-left block md:table-cell min-w-[200px]">
                        Indexation file
                      </th>
                      <th className="bg-gray-200 p-1  font-bold md:border md: text-left block md:table-cell min-w-[250px]">
                        Product
                      </th>
                      <th className="bg-gray-200 p-1  font-bold md:border md: text-left block md:table-cell min-w-[200px]">
                        Last indexation date
                      </th>
                      <th className="bg-gray-200 p-1  font-bold md:border md: text-left block md:table-cell">
                        Indexation method
                      </th>
                      <th
                        className="px-4    pr-9  text-left sticky -right-[1px] bg-gray-200"
                        style={{ outlineWidth: "1px" }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="block md:table-row-group overflow-none">
                    {onlineResourceData
                      ?.sort((a, b) => b.id - a.id)
                      ?.map((item, index) => (
                        <tr
                          key={index}
                          className={` ${
                            index % 2 === 0 ? "bg-gray-100" : "bg-white"
                          } border  md:border-none block md:table-row text-[16px] 2xl:text-[20px]`}
                        >
                          <td className="py-2 px-4 border ">
                            <Checkbox
                              isSelected={bulkDeleted.includes(item.id)}
                              onChange={() => handleCheckboxChange(item.id)}
                              className="2xl:text-[20px] !text-[50px]"
                              radius="none"
                              size="lg"
                              classNames={{ wrapper: "!rounded-[3px]" }}
                            />
                          </td>

                          <td className="p-2 min-w-[130px] max-w-[180px] md:border md: text-left block md:table-cell break-words">
                            {item.title}
                          </td>

                          <td className="p-2 md:border md: text-left block md:table-cell">
                            {item.url}
                          </td>

                          <td className="p-2 border md:  text-left block md:table-cell py-3">
                            {item.file ? (
                              <div className="flex flex-col">
                                <span
                                  className="text-blue-500 hover:underline cursor-pointer"
                                  onClick={() => handleDownload(item.file)}
                                >
                                  {item.file?.split("/").pop()}
                                </span>
                              </div>
                            ) : (
                              "Docx file not available"
                            )}
                          </td>

                          <td className="p-2 md:border md: text-left block md:table-cell">
                            {item.Products.map((product) => product.name).join(
                              ", "
                            )}
                          </td>
                          <td className="p-2 md:border md: text-left block md:table-cell ">
                            {formatDateWithTime(item.updatedAt)}
                          </td>
                          <td className="p-2 md:border md: text-left block md:table-cell">
                            {item.indexing}
                          </td>
                          <td
                            className={`outline border outline-[#e9e6e6] sticky -right-[1px]  pl-9 ${
                              index % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }`}
                            style={{ outlineWidth: "1px" }}
                          >
                            <Popover
                              className="rounded-[0px]"
                              isOpen={openPopoverIndex === index}
                              onOpenChange={(open) =>
                                setOpenPopoverIndex(open ? index : null)
                              }
                            >
                              <PopoverTrigger>
                                <FilePenLine
                                  size={25}
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
                                        `/vendor/onlineResource/update?id=${item.id}`
                                      )
                                    }
                                  >
                                    Update
                                  </div>
                                  <div
                                    className="text-small text-red-600 cursor-pointer 2xl:text-[20px]"
                                    onClick={() => {
                                      // setSelectedQuestion(data);
                                      setSelectedId(item.id);
                                      onOpen();
                                      setOpenPopoverIndex(null);
                                      setDeleteAction("single");
                                    }}
                                  >
                                    Delete
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <DeleteModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                handleSubmit={handleDelete}
                deleteModalContent={deleteModalContent}
              />
            </div>
          ) : (
            <ResourceHome />
          )}
        </div>
      )}
    </>
  );
};

export default OnlineResourceComponent;
