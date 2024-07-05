
import React, { useEffect, useState } from 'react';
import { Select, SelectItem } from "@nextui-org/react";

const MatchColum = ({ setKnowledgeData, knowledgeData, selectedHeader, updateHeader, setMappedIndexValue, mappedIndexValue }) => {
  const [availableOptions, setAvailableOptions] = useState([]);
  
  const thStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '10px',
    height: '40px',
  };

  const tdStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '10px',
    height: '40px',
  };

  const selectOptions = [
    { key: "Category", label: "Category" },
    { key: "Question", label: "Question" },
    { key: "Coverage", label: "Coverage" },
    { key: "Answer", label: "Answer" },
    { key: "Product", label: "Product" },
    { key: "Curator", label: "Curator" },
    { key: "Roadmap", label: "Roadmap" },
    { key: "Reference link", label: "Reference Link" },
    { key: "Do no map", label: "Do no map" }
  ];

  const handleSelectChange = (value, index) => {
    const newArr = [...mappedIndexValue];
    while (newArr.length <= index) {
      newArr.push("");
    }
    newArr[index] = value;
    setMappedIndexValue(newArr);
  };

  useEffect(() => {
    const filterOptions = () => {
      return selectOptions.filter(option => !mappedIndexValue.includes(option.label) || option.key === "Do no map");
    };
    setAvailableOptions(filterOptions());
  }, [mappedIndexValue]);

  const getAvailableOptions = () => {
    const filterOption = selectOptions.filter(option => !mappedIndexValue.includes(option.key) || option.key === "Do no map");
    return filterOption;
  };

  return (
    <div className='h-full'>
      {knowledgeData.questions ? (
        <div>
          <table className='text-sm'>
            <thead>
              <tr className='bg-[#ebeef2]'>
                {selectedHeader?.map((header, index) => (
                  <th key={index} style={thStyle} className='w-[220px] h-[30px]'>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {knowledgeData.questions.slice(1, 3).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={tdStyle}>
                      {cell.length > 15 ? `${cell.substring(0, 15)}...` : cell}
                    </td>
                  ))}
                  {/* Add empty cells if the row has fewer columns than the header */}
                  {Array.from({ length: selectedHeader.length - row.length }).map((_, idx) => (
                    <td key={`empty-${idx}`} style={tdStyle}></td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className='pt-5 font-semibold'>Will be mapped with</td>
              </tr>
              <tr>
                {selectedHeader?.map((header, index) => {
                  const currentSelectedValue = mappedIndexValue[index];
                  const defaultKey = selectOptions.find(option => option.label === currentSelectedValue);

                  return (
                    <td key={index}>
                      <Select
                        variant="bordered"
                        className="w-full bg-transparent"
                        size="sm"
                        placeholder="Select"
                        value={currentSelectedValue}
                        onChange={(e) => handleSelectChange(e.target.value, index)}
                        defaultSelectedKeys={defaultKey ? [defaultKey.key] : []}
                      >
                        {getAvailableOptions().concat(currentSelectedValue ? [{ key: currentSelectedValue, label: currentSelectedValue }] : []).map((option) => (
                          <SelectItem key={option.key} value={option.label}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default MatchColum;
