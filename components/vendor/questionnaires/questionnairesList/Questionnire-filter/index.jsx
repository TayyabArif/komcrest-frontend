import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { X, ChevronRight, ArrowBigLeft, Circle } from "lucide-react";
import Search from "./Search";
import CheckboxComponent from "./Checkbox";
import { toast } from "react-toastify";
import { formatCamelCaseString } from "@/helper";
import { useCookies } from "react-cookie";
import { handleResponse } from "@/helper";
import { useRouter } from "next/router";
import { useMyContext } from "@/context";

const filterHeader = [
  { name: "Question", value: "question" },
  { name: "Compliance", value: "compliance" },
  { name: "Answer", value: "answer" },
  { name: "Status", value: "status" },
  { name: "Notified Users", value: "notifiedUserIds" },
];

const questionnairStatus = [
  {
    value: "approved",
    text: "Approved",
  },
  {
    value: "Flagged",
    text: "Flagged",
  },
  {
    value: "processed",
    text: "Processed",
  },
];

const ComplianceOptions = [
  {
    value: "yes",
    text: "Yes",
  },
  {
    value: "no",
    text: "No",
  },
  {
    value: "",
    text: "Empty",
  },
  {
    value: "non-applicable",
    text: "Non Applicable",
  },
];

const createInitialFilters = (headers) => {
  return headers.map((header) => ({
    name: header.value,
    value: [],
  }));
};

const QuestionnairFilter = ({
  triggerFunction,
  setShowFilter,
  setFilters,
  filters,
  setShow,
  komcrestCategories,
  questionData,
  companyProducts,
  documentData,
  DocumentFile,
}) => {
  const [selectedOne, setSelectedOne] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [compnayUserList, setCompanyUserList] = useState([]);
  const { companyUserData } = useMyContext();

  const childFunction = () => {
    handleClearAll();
  };

  // React.useEffect(() => {
  //   triggerFunction.current = childFunction;
  // }, [triggerFunction]);

  useEffect(() => {
    //transform compnay userdata
    setCompanyUserList(
      companyUserData.map((data) => ({
        text: data.label,
        value: data.value,
      }))
    );

    if (filters?.length === 0) {
      setFilters(createInitialFilters(filterHeader));
    }
  }, [setFilters]);

  const handleFilterChange = (filterType, value) => {
    console.log("Current Filters:", filterType); // Add this line
    console.log("Selected Value:", value);
    setFilters((prevFilters) => {
      const isSpecialFilter = [
        "status",
        "compliance",
        "notifiedUserIds",
      ].includes(filterType);
      let updatedFilters = [...prevFilters];
      const filterIndex = updatedFilters.findIndex(
        (filter) => filter.name === filterType
      );

      if (filterIndex === -1) {
        return prevFilters;
      }

      if (isSpecialFilter) {
        if (updatedFilters[filterIndex].value.includes(value)) {
          updatedFilters[filterIndex].value = updatedFilters[
            filterIndex
          ].value.filter((item) => item !== value);
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
    }
  };

  const getEntries = () => {
    let totalEntries = 0;
    if (isSelected) {
      totalEntries = filters.filter((item) => item.name == selectedOne)[0]
        ?.value?.length;
    } else {
      console.log("filtersfilters", filters);
      filters?.forEach((obj) => {
        const valueLength = obj.value.length;
        totalEntries += valueLength;
      });
    }

    return totalEntries;
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

      updatedFilters[filterIndex].value = updatedFilters[
        filterIndex
      ].value.filter((_, i) => i !== index);
      return updatedFilters;
    });
  };

  const renderFilterComponent = () => {
    const selectedFilter = filterHeader.find(
      (header) => header.value === selectedOne
    );
    if (!selectedFilter) return null;

    switch (selectedFilter.value) {
      case "status":
        return (
          <CheckboxComponent
            selectedValues={
              filters?.find((filter) => filter.name === "status")?.value || []
            }
            handleFilterChange={(value) => handleFilterChange("status", value)}
            options={questionnairStatus}
          />
        );
      case "compliance":
        return (
          <CheckboxComponent
            selectedValues={
              filters?.find((filter) => filter.name === "compliance")?.value ||
              []
            }
            handleFilterChange={(value) =>
              handleFilterChange("compliance", value)
            }
            options={ComplianceOptions}
          />
        );
      case "notifiedUserIds":
        return (
          <CheckboxComponent
            selectedValues={
              filters?.find((filter) => filter.name === "notifiedUserIds")
                ?.value || []
            }
            handleFilterChange={(value) =>
              handleFilterChange("notifiedUserIds", value)
            }
            options={compnayUserList}
          />
        );
      default:
        return (
          <Search
            selectedValues={
              filters?.find((filter) => filter.name === selectedOne)?.value ||
              []
            }
            handleFilterChange={(value) =>
              handleFilterChange(selectedOne, value)
            }
            removeFilterValue={removeFilterValue}
          />
        );
    }
  };

  const getSelectedOneName = () => {
    const selectedHeader = filterHeader.find(
      (header) => header.value === selectedOne
    );
    return selectedHeader
      ? selectedHeader.name
      : formatCamelCaseString(selectedOne);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col justify-between">
      <div className="text-[18px]">
        <div className="flex justify-between p-5 items-center border-b-2">
          <h1 className="2xl:text-[20px] text-[16px] font-bold ">
            Filter {selectedOne}
          </h1>
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

              <h1 className="font-bold 2xl:text-[20px] text-[16px]">
                {getSelectedOneName()}
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
                  className="flex justify-between px-5 py-3 border-b-2 items-center cursor-pointer "
                  onClick={() => {
                    setSelectedOne(data.value);
                    setIsSelected(true);
                  }}
                >
                  <h1 className="2xl:text-[20px] text-[16px]">{data.name}</h1>
                  <div className="flex gap-3 ">
                    {filters?.find((filter) => filter.name === data.value)
                      ?.value.length > 0 ? (
                      <Circle
                        size={15}
                        strokeWidth={4}
                        color="#2457d7"
                        className="w-[35px]"
                      />
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
      <div className="flex flex-col gap-2 p-5  border-t-2">
        <h1>Entries {getEntries()}</h1>
        <button
          className="border rounded-md border-gray-300 px-3 py-1  2xl:text-[20px] text-[16px]"
          onClick={() => handleClearAll()}
        >
          Clear all
        </button>
      </div>
    </div>
  );
};

export default QuestionnairFilter;
