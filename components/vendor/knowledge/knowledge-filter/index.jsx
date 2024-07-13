import React, { useEffect, useState } from "react";
import { X, ChevronRight, ArrowBigLeft } from "lucide-react";
import Category from "./Category";
import Search from "./Search";
import { Circle } from 'lucide-react';
import { toast } from "react-toastify";
import {formatCamelCaseString} from "../../../../helper"

const filterHeader = [
  "category",
  "komcrestCategory",
  "question",
  "coverage",
  "answer",
  "products",
  "curator",
  "reference",
  "source",
];

const createInitialFilters = (headers) => {
  return headers.map(header => ({
    name: header,
    value: []
  }));
};

const KnowledgeFilter = ({ setShowFilter ,setFilters,filters}) => {
  const [selectedOne, setSelectedOne] = useState(null);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(()=>{
    setFilters(createInitialFilters(filterHeader))
  },[])

  const handleFilterChange = (_, value) => {
    setFilters((prevFilters) => {
      const isKomcrastCategory = selectedOne === "komcrestCategory";
      let updatedFilters = [...prevFilters];
      const filterIndex = updatedFilters.findIndex(filter => filter.name === selectedOne);

      if (filterIndex === -1) {
        return prevFilters;
      }

      if (isKomcrastCategory) {
        // For Komcrast category, toggle the value
        if (updatedFilters[filterIndex].value.includes(value)) {
          updatedFilters[filterIndex].value = updatedFilters[filterIndex].value.filter(item => item !== value);
        } else {
          updatedFilters[filterIndex].value.push(value);
        }
      } else {
        // For other categories, check for repetition and alert if necessary
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
      // Clear selected filter
      setFilters((prevFilters) => {
        const updatedFilters = prevFilters.map(filter => {
          if (filter.name === selectedOne) {
            return { ...filter, value: [] };
          }
          return filter;
        });
        return updatedFilters;
      });
    } else {
      // Clear all filters
      setFilters(createInitialFilters(filterHeader));
      setShowFilter(false)
    }
  };

  const removeFilterValue = (index) => {
    setFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      const filterIndex = updatedFilters.findIndex(filter => filter.name === selectedOne);

      if (filterIndex === -1) {
        return prevFilters;
      }

      updatedFilters[filterIndex].value = updatedFilters[filterIndex].value.filter((_, i) => i !== index);
      return updatedFilters;
    });
  };

  return (
    <div className="w-full h-full bg-white flex flex-col justify-between">
      <div className="text-[18px]">
        <div className="flex justify-between p-5 items-center border-b-2">
          <h1 className="text-[18px]">Filter</h1>
          <X className="size-[16px]" color="#2457d7" onClick={() => setShowFilter(false)} />
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
              <h1 className="font-bold">{selectedOne}</h1>
            </div>
          )}

          {selectedOne === "komcrestCategory" && isSelected ? (
            <Category
              selectedValues={filters.find(filter => filter.name === "komcrestCategory")?.value || []}
              handleFilterChange={(value) => handleFilterChange("komcrestCategory", value)}
            />
          ) : selectedOne !== "komcrestCategory" && isSelected ? (
            <Search
              selectedValues={filters.find(filter => filter.name === selectedOne)?.value || []}
              handleFilterChange={handleFilterChange}
              removeFilterValue={removeFilterValue}
            />
          ) : (
            <div>
              {filterHeader.map((data, index) => (
                <div
                  key={index}
                  className="flex justify-between px-5 py-3 border-b-2 items-center cursor-pointer"
                  onClick={() => {
                    setSelectedOne(data);
                    setIsSelected(true);
                  }}
                >
                  <h1 className="text-[16px]"> {data == "komcrestCategory" ? "Komcrest Domain": formatCamelCaseString(data)}</h1>
                  <div className="flex gap-3">
                    {filters.find(filter => filter.name === data)?.value.length > 0 ? (
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
      <div className="flex gap-2 p-5 items-center border-b-2">
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