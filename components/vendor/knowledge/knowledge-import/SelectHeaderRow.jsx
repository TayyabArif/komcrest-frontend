import React, { useState } from 'react';

const SelectHeaderRow = ({ knowledgeData, setSelectedHeader, selectedRowIndex, setSelectedRowIndex }) => {

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

  const handleRadioChange = (row, index) => {
    setSelectedRowIndex(index);
    setSelectedHeader(row);
  };

  const truncate = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  };

  return (
    <div className='w-full flex-1 h-full flex flex-col'>
      {knowledgeData.questions ? (
        <div className='flex-1 overflow-auto'>
          <table className="text-sm w-full border-collapse">
            <thead className='sticky -top-1 bg-[#E5E7EB] z-50'>
              <tr className='bg-[#ebeef2] text-standard'>
                <th style={thStyle}>
                  <input
                    type="radio"
                    name="Selection"
                    checked={selectedRowIndex === 0}
                    onChange={() => handleRadioChange(knowledgeData.questions[0], 0)}
                  />
                </th>
                {knowledgeData.questions[0]?.map((header, index) => (
                  <th key={index} style={thStyle}>{truncate(header, 20)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {knowledgeData.questions.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex + 1} className={`text-standard ${rowIndex % 2 === 0 ? 'bg-gray-100' : ''}`}>
                  <td style={tdStyle}>
                    <input
                      type="radio"
                      name="Selection"
                      checked={selectedRowIndex === rowIndex + 1}
                      onChange={() => handleRadioChange(row, rowIndex + 1)}
                    />
                  </td>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={tdStyle} className="py-2 px-4 border">
                      {truncate(cell, 20)}
                    </td>
                  ))}
                  {/* Add empty cells if the row has fewer columns than the header */}
                  {Array.from({ length: knowledgeData.questions[0].length - row.length }).map((_, idx) => (
                    <td key={`empty-${idx}`} style={tdStyle}></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className='w-full justify-center text-[16px] 2xl:text-[20px] shadow-md rounded-lg'>No data to display</p>
      )}
    </div>
  );
};

export default SelectHeaderRow;
