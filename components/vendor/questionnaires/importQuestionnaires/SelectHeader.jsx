import React, { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';

const SelectHeader = ({ excelFile, setExcelFile , selectedRows, setSelectedRows}) => {
  
  const initialSheet = excelFile && Object.keys(excelFile).length > 0 ? Object.keys(excelFile)[0] : null;
  const [selectedSheet, setSelectedSheet] = useState(initialSheet);

  useEffect(() => {
    const sheetNames = excelFile ? Object.keys(excelFile) : [];
    if (sheetNames.length > 0) {
      if (!sheetNames.includes(selectedSheet)) {
        setSelectedSheet(sheetNames[0]);
      }
    } else {
      setSelectedSheet(null);
    }
  }, [excelFile, selectedSheet]);

  const handleSheetChange = (sheetName) => {
    setSelectedSheet(sheetName);
  };

  const handleRowSelect = (sheetName, rowIndex) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [sheetName]: rowIndex,
    }));
  };

  const handleRemoveSheet = (sheetName) => {
    const updatedSheetsData = { ...excelFile };
    delete updatedSheetsData[sheetName];
    setExcelFile(updatedSheetsData);

    const updatedSelectedRows = { ...selectedRows };
    delete updatedSelectedRows[sheetName];
    console.log(">>>>>>>>>>>",updatedSelectedRows)
    setSelectedRows(updatedSelectedRows)

  };

  const truncateText = (text, maxLength) => {
    if (typeof text === 'string' && text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  return (
    <div className="p-4">
      {excelFile && (
        <>
          <div className="flex space-x-2 mb-4">
            {Object.keys(excelFile).map((sheetName) => (
              <div key={sheetName} className="relative">
                <button
                  onClick={() => handleSheetChange(sheetName)}
                  className={`px-4 py-1 flex bg-[#D8D8D8] items-center gap-2 rounded-full border-2 ${
                   selectedRows[sheetName] !== undefined
                      ? 'border-green-500'
                      : 'border-red-600'
                  } bg-white`}
                >
                  {sheetName}
                  <CircleX size={20} className="text-red-600" onClick={() => handleRemoveSheet(sheetName)} />
                </button>
              </div>
            ))}
          </div>
          {selectedSheet && excelFile[selectedSheet] && (
            <div className="h-[56vh] overflow-auto">
              <table className="min-w-full border-collapse border">
                <thead className="bg-[#F6F7F9] sticky -top-1 z-10">
                  <tr className='text-[16px] 2xl:text-[20px]'>
                    <th className="border p-2 text-left">
                      <input
                        type="radio"
                        checked={selectedRows[selectedSheet] === 0}
                        onChange={() => handleRowSelect(selectedSheet, 0)}
                        className="w-4 h-4"
                      />
                    </th>
                    {excelFile[selectedSheet][0].map((header, index) => (
                      <th key={index} className="border p-2 text-left text-[16px] 2xl:text-[18px]">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelFile[selectedSheet].slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex} className="even:bg-gray-100 text-[16px] 2xl:text-[20px]">
                      <td className="border p-2">
                        <input
                          type="radio"
                          className="w-4 h-4"
                          name={`rowSelect-${selectedSheet}`}
                          checked={selectedRows[selectedSheet] === rowIndex + 1}
                          onChange={() => handleRowSelect(selectedSheet, rowIndex + 1)}
                        />
                      </td>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border p-2 text-[16px] 2xl:text-[20px]">
                          {truncateText(cell, 70)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SelectHeader;
