import React, { useEffect, useState } from "react";
import { X, ChevronRight, ArrowBigLeft, Circle } from "lucide-react";
import Search from "./Search";
import CheckboxComponent from "./Checkbox";
import { toast } from "react-toastify";
import { formatCamelCaseString } from "../../../../helper";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../../helper/index"
import { useRouter } from "next/router";


const filterHeader = [
    { name: "Category", value: "category" },
    { name: "komcrest Domain", value: "komcrestCategory" },
    { name: "Question", value: "question" },
    { name: "Coverage", value: "coverage" },
    { name: "Answer", value: "answer" },
    { name: "Products", value: "Products" },
    { name: "Curator", value: "curator" },
    { name: "Reference", value: "Document" },
    { name: "Source", value: "DocumentFile" },
  ];
  

  const createInitialFilters = (headers) => {
    return headers.map((header) => ({
      name: header.value,
      value: [],
    }));
  };
  

const KnowledgeFilter = ({ setShowFilter, setFilters, filters, setShow ,komcrestCategories ,questionData}) => {
  const router = useRouter();
  const [selectedOne, setSelectedOne] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [DocumentFile , setDocumentFile] = useState([])
  const [documentData, setDocumentData] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [companyProducts, setCompanyProducts] = useState([]);

  useEffect(() => {
    if(filters.length === 0 ){
        setFilters(createInitialFilters(filterHeader));
    // get source data from the all question list 
    const DocumentFileData = Array.from(new Map(questionData.map(item => [item.documentFile.id, { value: item.documentFile.id, text: item.documentFile.name }])).values());
    setDocumentFile(DocumentFileData)
    getUserDocument()
    getCompanyProducts()
    }
  }, [setFilters]);

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

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const isSpecialFilter = ["komcrestCategory", "Document", "Products", "DocumentFile"].includes(filterType);
      let updatedFilters = [...prevFilters];
      const filterIndex = updatedFilters.findIndex((filter) => filter.name === filterType);
  
      if (filterIndex === -1) {
        return prevFilters;
      }
  
      if (isSpecialFilter) {
        if (updatedFilters[filterIndex].value.includes(value)) {
          updatedFilters[filterIndex].value = updatedFilters[filterIndex].value.filter(
            (item) => item !== value
          );
        } else {
          updatedFilters[filterIndex].value.push(value);
        }
      } else {
        if (updatedFilters[filterIndex].value.includes(value)) {
          toast.error("This value is already added");
          return prevFilters;
        } else {
          updatedFilters[filterIndex].value.push(value);
        }
      }
      return updatedFilters;
    });
  };
  

  const handleClearAll = () => {
    if (isSelected) {
      setFilters((prevFilters) => {
        const updatedFilters = prevFilters.map((filter) => {
          if (filter.name === selectedOne) {
            return { ...filter, value: [] };
          }
          return filter;
        });
        return updatedFilters;
      });
    } else {
      setFilters(createInitialFilters(filterHeader));
      setShowFilter(false);
      setShow(false);
    }
  };

  const removeFilterValue = (index) => {
    setFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      const filterIndex = updatedFilters.findIndex(
        (filter) => filter.name === selectedOne
      );

      if (filterIndex === -1) {
        return prevFilters;
      }

      updatedFilters[filterIndex].value = updatedFilters[filterIndex].value.filter(
        (_, i) => i !== index
      );


      console.log(">>>>>>>>>>>>>>>>>",filters)
      return updatedFilters;
    });
  };

  const renderFilterComponent = () => {
    const selectedFilter = filterHeader.find((header) => header.value === selectedOne);
    if (!selectedFilter) return null;
  
    switch (selectedFilter.value) {
      case "komcrestCategory":
        return (
          <CheckboxComponent
            selectedValues={
              filters.find((filter) => filter.name === "komcrestCategory")?.value || []
            }
            handleFilterChange={(value) => handleFilterChange("komcrestCategory", value)}
            options={komcrestCategories.filter(category => category.value !== "")}
          />
        );
      case "Document":
        return (
          <CheckboxComponent
            selectedValues={
              filters.find((filter) => filter.name === "Document")?.value || []
            }
            handleFilterChange={(value) => handleFilterChange("Document", value)}
            options={documentData}
          />
        );
      case "DocumentFile":
        return (
          <CheckboxComponent
            selectedValues={
              filters.find((filter) => filter.name === "DocumentFile")?.value || []
            }
            handleFilterChange={(value) => handleFilterChange("DocumentFile", value)}
            options={DocumentFile}
          />
        );
      case "Products":
        return (
          <CheckboxComponent
            selectedValues={
              filters.find((filter) => filter.name === "Products")?.value || []
            }
            handleFilterChange={(value) => handleFilterChange("Products", value)}
            options={companyProducts}
          />
        );
      default:
        return (
          <Search
            selectedValues={
              filters.find((filter) => filter.name === selectedOne)?.value || []
            }
            handleFilterChange={(value) => handleFilterChange(selectedOne, value)}
            removeFilterValue={removeFilterValue}
          />
        );
    }
  };
  

  return (
    <div className="w-full h-full bg-white flex flex-col justify-between">
      <div className="text-[18px]">
        <div className="flex justify-between p-5 items-center border-b-2">
          <h1 className="text-[18px]">Filter</h1>
          <X
            className="size-[16px] cursor-pointer"
            color="#2457d7"
            onClick={() => setShowFilter(false)}
          />
        </div>
        <div
          className="overflow-y-auto flex-grow"
          style={{ maxHeight: "calc(70vh - 150px)" }}
        >
          {selectedOne && isSelected && (
            <div
              className="flex p-5 py-3 items-center border-b-2 cursor-pointer"
              onClick={() => {
                setSelectedOne(null);
                setIsSelected(false);
              }}
            >
              <ArrowBigLeft size="30" color="#2457d7" />
              <h1 className="font-bold">
                {selectedOne === "komcrestCategory"
                  ? "Komcrest Domain" 
                  : formatCamelCaseString(selectedOne)}
              </h1>
            </div>
          )}
          {selectedOne && isSelected ? (
            renderFilterComponent()
          ) : (
            <div>
            {filterHeader.map((data, index) => (
              <div
                key={index}
                className="flex justify-between px-5 py-3 border-b-2 items-center cursor-pointer"
                onClick={() => {
                  setSelectedOne(data.value);
                  setIsSelected(true);
                }}
              >
                <h1 className="text-[16px]">
                  {data.name}
                </h1>
                <div className="flex gap-3">
                  {filters.find((filter) => filter.name === data.value)?.value.length > 0 ? (
                    <Circle size={15} strokeWidth={4} color="#2457d7" />
                  ) : (
                    ""
                  )}
                  <ChevronRight className="size-[16px]" color="#2457d7" />
                </div>
              </div>
            ))}
          </div>
          
          )}
        </div>
      </div>
      <div className="flex gap-2 p-5 items-center border-t-2">
        <button
          className="border rounded-md border-gray-300 px-3 py-1 text-gray-500"
          onClick={() => handleClearAll()}
        >
          Clear all
        </button>
      </div>
    </div>
  );
};

export default KnowledgeFilter;

