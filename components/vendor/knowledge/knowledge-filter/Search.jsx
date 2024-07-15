import React, { useState } from 'react';
import { Input } from "@nextui-org/react";
import { Search as SearchIcon, X } from "lucide-react";

const Search = ({ selectedValues, handleFilterChange, removeFilterValue }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchValue.trim() !== '') {
      handleFilterChange(e.target.value.trim());
      setSearchValue('');
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col justify-between">
      <div className="text-[18px]">
        <div className="flex items-center gap-1 mb-2 p-4">
          <Input
            variant="bordered"
            placeholder="Search"
            endContent={<SearchIcon size={18} />}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            classNames={{
              inputWrapper: "bg-white rounded-md",
              input: "2xl:text-[20px] text-[16px]",
            }}
            className="max-w-xs"
          />
        </div>
        <div>
          {selectedValues?.map((value, index) => (
            <div key={index} className="flex justify-between p-2 px-5 items-center border-b-2">
              <span>{value}</span>
              <X size={16} onClick={() => removeFilterValue(index)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
