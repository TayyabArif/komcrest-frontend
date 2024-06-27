import React, { useEffect, useState } from 'react';
import { Select, SelectItem ,Checkbox } from "@nextui-org/react";


const MatchColum = ({ excelData, setExcelData }) => {
  const [selectedValues, setSelectedValues] = useState(excelData ? Array(excelData[0].length).fill('') : []);
 


  const thStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '4px',
  };

  const tdStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '4px',
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
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = value;
    setSelectedValues(newSelectedValues);

    let updateData = [...excelData];
    const header = updateData[0];
    header[index] = value;
    updateData[0] = header;
    setExcelData(updateData);
  };

  const getAvailableOptions = (index) => {
    const selected = selectedValues.filter((value, i) => i !== index);
    return selectOptions.filter(option => !selected.includes(option.label));
  };

  return (
    <div className='  h-full'>
      <h1 className='my-2 font-semibold'>Your table - 2021 CAIQ Questionnaire 20210914</h1>
      {excelData ? (
        <div>
          <table className='text-sm'>
            <thead>
              <tr>
                {excelData[0].map((header, index) => (
                  <th key={index} style={{ ...thStyle }} className='w-[220px] h-[30px] '>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.slice(1, 3).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={{ ...tdStyle }}>
                      {cell.length > 15 ? `${cell.substring(0, 15)}...` : cell}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className='pt-5 font-semibold'>Will mapped with</td>
              </tr>
              <tr>
                {excelData[0].map((header, index) => (
                  <td key={index}>
                    <Select
                      variant="bordered"
                      className="w-full bg-transparent"
                      size="sm"
                      placeholder="Select"
                      value={selectedValues[index]}
                      onChange={(e) => handleSelectChange(e.target.value, index)}
                    >
                      {getAvailableOptions(index).map((option) => (
                        <SelectItem key={option.key} value={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </td>
                ))}
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

