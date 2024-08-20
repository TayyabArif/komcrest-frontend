import React, { useState } from 'react';

const SelectQuestion = ({ excelFile, selectedRows, columnMapping, setColumnMapping }) => {
  const [visibleTable, setVisibleTable] = useState(Object.keys(excelFile)[0]);

  const handleMappingChange = (sheetName, columnIndex, value) => {
    setColumnMapping((prevMapping) => {
      const updatedMapping = {
        ...prevMapping,
        [sheetName]: {
          ...prevMapping[sheetName],
          [columnIndex]: value,
        },
      };
      return updatedMapping;
    });
  };

  const renderDropdown = (sheetName, columnIndex) => {
    const usedOptions = Object.values(columnMapping[sheetName] || {});
  
    // Allow the current selection in its dropdown
    const currentSelection = columnMapping[sheetName]?.[columnIndex];
  
    // Filter out options already used by other dropdowns, but allow the current one
    let availableOptions = ['Category', 'Question'].filter(option => 
      !usedOptions.includes(option) || option === currentSelection
    );
  
    if (availableOptions.length === 0) {
      availableOptions = ["No option available"];
    }
  
    return (
      <select
        className="w-[250px] bg-transparent text-[15px] border rounded-lg pr-3 p-2"
        name={`mapping-${sheetName}-${columnIndex}`}
        value={currentSelection || ''}
        onChange={(e) => handleMappingChange(sheetName, columnIndex, e.target.value)}
      >
        <option value="" disabled>Select</option>
        {availableOptions.map((option) => (
          <option key={option} value={option} disabled={option === "No option available"}>
            {option}
          </option>
        ))}
      </select>
    );
  };
  

  const toggleTableVisibility = (sheetName) => {
    setVisibleTable(sheetName);
  };

  const truncateText = (text, maxLength) => {
    if (typeof text === 'string' && text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  const allOptionsSelected = (sheetName) => {
    const usedOptions = Object.values(columnMapping[sheetName] || {});
    return ['Category', 'Question'].every(option => usedOptions.includes(option));
  };

  return (
    <div className="p-4">
      {/* Buttons for each sheet */}
      <div className="flex space-x-2 mb-4">
        {Object.keys(excelFile).map((sheetName) => (
          <button
            key={sheetName}
            onClick={() => toggleTableVisibility(sheetName)}
            className={`px-4 py-1 flex items-center gap-2 rounded-full border-2 ${
              allOptionsSelected(sheetName) ? 'border-green-500 bg-green-100' : 
           'border-red-600 bg-white'
            }`}
          >
            {sheetName}
          </button>
        ))}
      </div>

      {/* Table for the selected sheet */}
      {visibleTable && excelFile[visibleTable] && (
        <div>
          <table className="min-w-full mb-4">
            <thead className="bg-gray-200">
              <tr className='text-[16px] 2xl:text-[20px]'>
                {excelFile[visibleTable][selectedRows[visibleTable]]?.map((header, index) => (
                  <th key={index} className="border p-2 text-left">
                    {truncateText(header, 70)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[excelFile[visibleTable][selectedRows[visibleTable]], ...excelFile[visibleTable].slice(1, 3)]
                .filter((row) => Array.isArray(row)) // Ensure that each row is an array
                .map((row, rowIndex) => (
                  <tr key={rowIndex} className="even:bg-gray-100 text-[16px] 2xl:text-[20px]">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border p-2 text-left">
                        {truncateText(cell, 70)}
                      </td>
                    ))}
                  </tr>
                ))}
              {/* Last two rows */}
              <tr className='font-bold  border-0 text-[16px] 2xl:text-[20px]'>
                <td className=' pt-3 text-left'>Will be mapped with:</td>
              </tr>
              <tr className="border-0">
                {excelFile[visibleTable][selectedRows[visibleTable]]?.map((_, index) => (
                  <td key={index} className="border-0 text-left">
                    {renderDropdown(visibleTable, index)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SelectQuestion;
