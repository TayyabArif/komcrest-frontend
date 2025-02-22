import React, { useEffect, useState } from 'react';
import { Select, SelectItem } from "@nextui-org/react";

const MatchColum = ({ knowledgeData, selectedHeader, setMappedIndexValue, mappedIndexValue , selectedRowIndex }) => {
  const [availableOptions, setAvailableOptions] = useState([]);
  const thStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '10px',
    height: '40px',
    width: '200px'
  };

  const tdStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '10px',
    height: '40px',
    width: '200px'
  };

  const selectOptions = [
    { key: "Category", label: "Category" },
    { key: "Question", label: "Question" },
    { key: "Compliance", label: "Compliance" },
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


  const truncate = (str, maxLength) => {
    if (str?.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  };
  return (
    <div className='pb-2 overflow-auto w-[100%]'>
      {knowledgeData.questions ? (
        <div className='w-[100%]'>
          <table className='text-sm w-[100%]'>
            <thead className=''>
              <tr className='bg-[#ebeef2]'>
                {selectedHeader?.map((header, index) => (
                  <th key={index} style={thStyle} className='h-[30px] text-standard min-w-[150px]'>{truncate(header, 20)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {knowledgeData.questions.slice(selectedRowIndex).slice(1, 3).map((row, rowIndex) => (
                <tr key={rowIndex} className='text-standard'>
                  {selectedHeader.map((_, cellIndex) => (
                    <td key={cellIndex} style={tdStyle} className='h-[30px] min-w-[150px]'>
                      {row[cellIndex] ? (row[cellIndex].length > 15 ? `${row[cellIndex].substring(0, 15)}...` : row[cellIndex]) : ''}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={selectedHeader.length} className='pt-5 pb-2 font-semibold text-standard h-[30px]'>Will be mapped with</td>
              </tr>
              <tr className=''>
                {selectedHeader?.map((header, index) => {
                  const currentSelectedValue = mappedIndexValue[index];
                  const defaultKey = selectOptions.find(option => option.label === currentSelectedValue);

                  return (
                    <td key={index} className='h-[30px] min-w-[150px]'>
                      <Select
                        variant="bordered"
                        className="w-full bg-transparent text-standard"
                        size="md"
                        placeholder="Select"
                        value={currentSelectedValue}
                        onChange={(e) => handleSelectChange(e.target.value, index)}
                        defaultSelectedKeys={defaultKey ? [defaultKey.key] : []}
                        classNames={{value: "text-standard"}}
                      >
                        {getAvailableOptions().concat(currentSelectedValue ? [{ key: currentSelectedValue, label: currentSelectedValue }] : []).map((option) => (
                          <SelectItem key={option.key} value={option.label} classNames={{title: "text-standard"}}>
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
        <p className='w-full justify-center text-standard shadow-md rounded-lg'>No data to display</p>
      )}
    </div>
  );
};

export default MatchColum;
