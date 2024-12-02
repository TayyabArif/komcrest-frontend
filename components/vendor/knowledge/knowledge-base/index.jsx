import React, { useEffect, useState, useRef } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { FilePenLine, Filter, Search } from "lucide-react";
import { Input } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import VendorHeader from "../../shared/VendorHeader";
import KnowledgeHeader from "../../shared/KnowledgeHeader";
import {
  handleResponse,
  formatDateWithTime,
  handleFileDownload,
  handleDownload
} from "../../../../helper";
import KnowledgeFilter from "../knowledge-filter";
import { Checkbox } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import DeleteModal from "../../shared/DeleteModal";

const komcrestCategories = [
  { value: "", text: "Select a Category" },
  { value: "Overview", text: "Overview" },
  { value: "Access Management", text: "Access Management" },
  { value: "Application & Data Security", text: "Application & Data Security" },
  { value: "Artificial Intelligence", text: "Artificial Intelligence" },
  { value: "Cloud Security", text: "Cloud Security" },
  { value: "Device Management", text: "Device Management" },
  { value: "Disaster Recovery", text: "Disaster Recovery" },
  { value: "ESG", text: "ESG" },
  { value: "Incident Management", text: "Incident Management" },
  { value: "Legal", text: "Legal" },
  { value: "Privacy", text: "Privacy" },
  {
    value: "Risk and Vulnerability Management",
    text: "Risk and Vulnerability Management",
  },
  { value: "Security Governance", text: "Security Governance" },
  { value: "Vendor Management", text: "Vendor Management" },
];

const deleteModalContent = "Are you sure to delete knowledge?";

const KnowledgeBase = ({
  questionData,
  setDataUpdate,
  dataUpdate,
  setFilters,
  filters,
  dataLoaded,
}) => {
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [filterData, setFilterData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [bulkDeleted, setBulkDeleted] = useState([]);
  const [deleteAction, setDeleteAction] = useState("");
  const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  const [show, setShow] = useState(false);
  const [companyProducts, setCompanyProducts] = useState([]);
  const [documentData, setDocumentData] = useState([]);
  const [DocumentFile, setDocumentFile] = useState([]);
  const childRef = useRef();
  const triggerFunction = useRef(null);

  const handleClearFilter = () => {
    if (triggerFunction.current) {
      triggerFunction.current();
    }
  };

  const getCompanyProducts = async () => {
    const token = cookiesData?.token;
    const companyId = cookiesData?.companyId;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };
    fetch(`${baseUrl}/companies/${companyId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const products = data?.Products.map((item) => ({
            value: item.id,
            text: item.name,
          }));
          setCompanyProducts(products);
          console.log("Products:", products);
        } else {
          toast.error(data?.error);
          console.error("Error:", data);
        }
      })
      .catch((error) => console.error(error));
  };

  const getUserDocument = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };
    try {
      const response = await fetch(`${baseUrl}/userdocuments`, requestOptions);
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        const referenceOptions = data.map((item) => ({
          value: item.id,
          text: item.title,
        }));
        setDocumentData(referenceOptions);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching user documents:", error);
    }
  };

  useEffect(() => {
    setFilterData(questionData);
    setShow(true);
    getCompanyProducts();
    getUserDocument();

    if (DocumentFile.length == 0) {
      const DocumentFileData = Array.from(
        new Map(
          questionData.map((item) => [
            item.documentFile?.id,
            { value: item.documentFile?.id, text: item.documentFile?.name },
          ])
        ).values()
      );
      setDocumentFile(DocumentFileData);
    }
  }, [dataUpdate, questionData]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = questionData?.filter(
      (question) =>
        question.category?.toLowerCase().includes(value) ||
        question.question?.toLowerCase().includes(value)
    );
    setFilterData(filtered);
  };

  const handleKomcrastCategoryChange = (id, value) => {
    const jsonPayload = JSON.stringify({ komcrestCategory: value });
    let requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${cookiesData?.token}`,
        "Content-Type": "application/json",
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
        `${baseUrl}/questions/${selectedQuestion?.id}`,
        requestOptions
      );
      const result = await response.text();

      if (response.ok) {
        toast.success("Question deleted successfully");
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
    const token = cookiesData.token;
    const requestOptions = {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questionIds: bulkDeleted }),
      redirect: "follow",
    };
    fetch(`${baseUrl}/bulk-delete`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        toast.success("Questions deleted successfully");
        setDataUpdate(!dataUpdate);
        setBulkDeleted([]);
        setFilters([]);
        setIsHeaderChecked(false)
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = () => {
    if (deleteAction == "single") {
      handleSingleDelete();
    } else {
      handleBulkDelete();
    }
  };

  const handleHeaderCheckboxChange = () => {
    if (isHeaderChecked) {
      setBulkDeleted([]);
      setIsHeaderChecked(false);
    } else {
      const allIds = filterData.map((data) => data.id);
      setBulkDeleted(allIds);
      setIsHeaderChecked(true);
    }
  };

  return (
    <div className="w-[86%] mx-auto flex-1 h-[0vh] flex flex-col">
      <div className="flex justify-between my-[6px]">
        <div className="flex items-center gap-1 w-[22%]">
          <Input
            onChange={handleSearch}
            variant="bordered"
            placeholder="Search"
            endContent={<Search size={18} />}
            type="text"
            classNames={{
              inputWrapper: "bg-white rounded-md",
              input: "2xl:text-[20px] text-[16px]",
            }}
            className=""
          />
          <div
            className="bg-white p-1 border rounded-[5px] shadow-md cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter size={26} className="text-gray-500" color="#2457d7" />
          </div>
          {filters.some((filter) => filter.value.length > 0) && !showFilter && (
            <button
              onClick={handleClearFilter}
              className="px-2 py-1 rounded-full border text-blue-700 border-blue-700 border-dashed text-nowrap"
            >
              Clear filter
            </button>
          )}
        </div>
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

      {(questionData && questionData.length > 0) || filters.length > 0 ? (
        <div className="flex  gap-2 min-h-[0vh] cursor-pointer">
          {showFilter && (
            <div className="w-[22%] h-full flex flex-col">
              <KnowledgeFilter
                setShowFilter={setShowFilter}
                setFilters={setFilters}
                filters={filters}
                setShow={setShow}
                komcrestCategories={komcrestCategories}
                questionData={questionData}
                companyProducts={companyProducts}
                documentData={documentData}
                DocumentFile={DocumentFile}
                triggerFunction={triggerFunction}
              />
            </div>
          )}
          <div className="w-[100%] flex-1 overflow-auto relative">
            <table style={{ width: "100%" }} className=" bg-white border ">
              <thead className="bg-gray-200 sticky -top-1 z-30">
                <tr className="text-[16px] 2xl:text-[20px]">
                  <th className="py-2 px-4 border text-left">
                    <Checkbox
                      isSelected={isHeaderChecked && bulkDeleted.length > 0}
                      onChange={handleHeaderCheckboxChange}
                      className="2xl:text-[20px] !text-[50px]"
                      radius="none"
                      size="lg"
                      classNames={{ wrapper: "!rounded-[3px]" }}
                    />
                  </th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left !max-w-[320px]">
                    Komcrest Domain
                  </th>
                  <th className="py-2 px-4 text-left md:min-w-[250px]  lg:min-w-[350px] xl:min-w-[500px]">
                    Question
                  </th>
                  <th className="py-2 px-4 text-left">Compliance</th>
                  <th className="py-2 px-4 text-left text-wrap md:min-w-[250px]  lg:min-w-[350px] xl:min-w-[500px]">
                    Answer
                  </th>
                  <th className="py-2 px-4 text-left !min-w-[250px]">
                    Products
                  </th>
                  <th className="py-2 px-4 text-left !min-w-[250px]">
                    Roadmap
                  </th>
                  <th className="py-2 px-4 text-left w-[50px]">Curator</th>
                  <th className="py-2 px-4 text-left">Reference</th>
                  <th className="py-2 px-4 text-left">Source</th>
                  <th className="py-2 px-4 text-left">Latest Update</th>
                  <th
                    className="px-4    pr-7  text-left sticky -right-[1px] bg-gray-200"
                    style={{ outlineWidth: "1px" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterData?.length > 0 ? (
                  filterData.map((data, index) => (
                    <tr
                      key={data.id}
                      className={` h-[100px] text-[16px] 2xl:text-[20px] ${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="py-2 px-4 border">
                        <Checkbox
                          isSelected={bulkDeleted.includes(data.id)}
                          onChange={() => handleCheckboxChange(data.id)}
                          className="2xl:text-[20px] !text-[50px]"
                          radius="none"
                          size="lg"
                          classNames={{ wrapper: "!rounded-[3px]" }}
                        />
                      </td>
                      <td className="py-2 px-4 border whitespace-nowrap text-wrap min-w-[150px] max-w-[550px]  break-words">
                        {data.category}
                      </td>
                      <td className="py-2 px-4 border bg-transparent !max-w-[320px]">
                        <select
                          value={data.komcrestCategory}
                          onChange={(e) =>
                            handleKomcrastCategoryChange(
                              data.id,
                              e.target.value
                            )
                          }
                          className="py-1 px-2 max-w-[250px] bg-transparent"
                        >
                          {komcrestCategories?.map((item, index) => (
                            <option key={index} value={item?.value}>
                              {item?.text}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-4 border  md:max-w-[250px]  lg:max-w-[350px] xl:max-w-[500px]  break-words">
                        {data.question}
                      </td>
                      <td className="py-2 px-4 border whitespace-rap">
                        {data.coverage}
                      </td>
                      <td className="py-2 px-4 border text-wrap md:max-w-[250px]  break-words  lg:max-w-[350px] xl:max-w-[500px]">
                        {data.answer}
                      </td>
                      <td className="py-2 px-4 border md:max-w-[250px]  lg:max-w-[350px] xl:max-w-[500px]  break-words">
                        {data.Products.map((product) => product.name).join(
                          ", "
                        )}
                      </td>
                      <td className="py-2 px-4 border   md:max-w-[200px]  break-words  lg:max-w-[250px] xl:max-w-[300px]">
                        {data.roadmap}
                      </td>
                      <td className="py-2 px-4 border whitespace-nowrap  break-words text-wrap min-w-[250px] max-w-[550px]">
                        {data.curator}
                      </td>
                      <td className="py-2 px-4 border whitespace-wrap break-words text-blue-600 cursor-pointer md:min-w-[200px] lg:min-w-[250px]  xl:min-w-[300px]">
                        {[
                          ...data.documents.map((item) => (
                            <h1
                              key={item.id} // Always provide a unique key when rendering lists
                              className="cursor-pointer"
                              onClick={() =>{ handleFileDownload(item?.filePath)}}
                            >
                              {item.title}
                            </h1>
                          )),
                          ...data.onlineResources.map((item) => (
                            <h1 
                            onClick={() => handleDownload(item?.file)}
                            
                            key={item.id}>{item.title}</h1>
                          )),
                        ]}
                      </td>

                      <td className="py-2 px-4 border xl:min-w-[330px] lg:min-w-[250px] md:min-w-[200px] ">
                        {data.documentFile?.name}
                      </td>
                      <td className="py-2 px-4 border whitespace-nowrap ">
                        {formatDateWithTime(data.updatedAt)}
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
                                    `/vendor/knowledge/UpdateQuestion?id=${data.id}`
                                  )
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
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={show ? "5" : "6"}
                      className="py-2 px-4 text-center text-gray-500 text-18px"
                    >
                      {!show ? "Loading...." : " No data match for this filter"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <DeleteModal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              handleSubmit={handleDelete}
              deleteModalContent={deleteModalContent}
            />
          </div>
        </div>
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default KnowledgeBase;
