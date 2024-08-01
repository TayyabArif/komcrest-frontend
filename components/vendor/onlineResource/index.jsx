import React, { useState, useEffect } from "react";
import KnowledgeHeader from "../shared/KnowledgeHeader";
import ResourceHome from "./ResourceHome";
import { Popover, PopoverTrigger, PopoverContent, CircularProgress } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import { FilePenLine } from "lucide-react";
import DeleteModal from "../shared/DeleteModal";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../helper";
import { toast } from "react-toastify";
import { formatDateWithTime } from "../../../helper";

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

  const getAllResourceData = async () => {
    setIsLoading(true)
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
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error("Error fetching user documents:", error);
    }
  };

  useEffect(() => {
    getAllResourceData();
  }, [dataUpdate]);

  const handleDelete = async () => {
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

  return (
    <>
    {isLoading ? 
     <div className='flex flex-col gap-2 bg-gray-200 items-center justify-center pl-20 pr-10 py-3 min-h-screen'>
        <CircularProgress label="Fetching Resources..." size="lg"/>
      </div>
    :
    <div>
      <KnowledgeHeader headerData={headerData} buttonShow={onlineResourceData.length > 0 ? true : false} />
      {onlineResourceData.length > 0 ? (
        <div className=" w-[85%] mx-auto overflow-x-auto mt-10">
          <table className="min-w-full border-collapse block md:table">
            <thead className="block md:table-header-group">
              <tr className="border text-[16px] 2xl:text-[20px] border-gray-300 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
                <th className="bg-gray-200  px-2 font-bold md:border md:border-gray-300 text-left block md:table-cell min-w-[250px]">
                  Title
                </th>
                <th className="bg-gray-200 p-1  font-bold md:border md:border-gray-300 text-left block md:table-cell">
                  URL
                </th>
                <th className="bg-gray-200 p-1  font-bold md:border md:border-gray-300 text-left block md:table-cell min-w-[200px]">
                  Txt file
                </th>
                <th className="bg-gray-200 p-1  font-bold md:border md:border-gray-300 text-left block md:table-cell min-w-[250px]">
                  Product
                </th>
                <th className="bg-gray-200 p-1  font-bold md:border md:border-gray-300 text-left block md:table-cell min-w-[200px]">
                  Last indexation date
                </th>
                <th className="bg-gray-200 p-1  font-bold md:border md:border-gray-300 text-left block md:table-cell">
                  Indexation method
                </th>
                <th className="bg-gray-200 p-2  font-bold md:border md:border-gray-300 text-left block md:table-cell">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {onlineResourceData.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border border-gray-300 md:border-none block md:table-row text-[16px] 2xl:text-[20px]"
                >
                  <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                    {item.title}
                  </td>
                  <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                    {item.url}
                  </td>

                  <td className="p-2 border md:border-gray-300  text-left block md:table-cell py-3">
                    {item.file ? (
                      <div className="flex flex-col">
                        <span className="text-blue-500 hover:underline cursor-pointer">
                          {item.file?.split("/").pop()}
                        </span>
                      </div>
                    ) : (
                      "Docx file not available"
                    )}
                  </td>

                  <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                  {item.Products.map((product) => product.name).join(
                            ", "
                          )}
                  </td>
                  <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell ">
                    {formatDateWithTime(item.updatedAt)}
                  </td>
                  <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                    {item.indexing}
                  </td>
                  <td className="p-2 md:border md:border-gray-300 text-left pl-4 block md:table-cell">
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
    }
    </>
  );
};

export default OnlineResourceComponent;
