import React, { useState } from 'react';

const ValidateData = ({ excelFile, columnMapping }) => {
  const [selectedRows, setSelectedRows] = useState({});
  const [removedRows, setRemovedRows] = useState({});
  const [visibleTable, setVisibleTable] = useState(Object.keys(excelFile)[0]); // Initially show the first table

  // Function to get the header and row data based on the mapping
  const getMappedData = (sheetName) => {
    const headers = [];
    const rows = [];

    const mapping = columnMapping[sheetName];
    if (!mapping) return { headers, rows };

    const mappedHeaders = Object.entries(mapping).sort((a, b) => a[0] - b[0]);
    mappedHeaders.forEach(([index, mappedHeader]) => {
      headers.push(mappedHeader);
    });

    excelFile[sheetName].slice(1).forEach((row, rowIndex) => {
      if (!isRowRemoved(sheetName, rowIndex + 1)) {
        const mappedRow = mappedHeaders.map(([index]) => row[index]);
        rows.push(mappedRow);
      }
    });

    return { headers, rows };
  };

  const handleRowSelect = (sheetName, rowIndex) => {
    setSelectedRows((prevSelectedRows) => {
      const updated = { ...prevSelectedRows };
      if (!updated[sheetName]) {
        updated[sheetName] = new Set();
      }
      if (updated[sheetName].has(rowIndex)) {
        updated[sheetName].delete(rowIndex);
      } else {
        updated[sheetName].add(rowIndex);
      }
      return updated;
    });
  };

  const removeSelectedRows = () => {
    setRemovedRows((prevRemovedRows) => {
      const updated = { ...prevRemovedRows };
      for (const [sheetName, rowIndexes] of Object.entries(selectedRows)) {
        if (!updated[sheetName]) {
          updated[sheetName] = [];
        }
        updated[sheetName].push(...Array.from(rowIndexes));
      }
      return updated;
    });

    setSelectedRows({});
  };

  const restoreRemovedRows = () => {
    setRemovedRows({});
  };

  const isRowRemoved = (sheetName, rowIndex) => {
    return removedRows[sheetName] && removedRows[sheetName].includes(rowIndex);
  };

  return (
    <div className="p-4">
      {/* Buttons to switch between tables */}
      <div className="flex space-x-2 mb-4">
        {Object.keys(excelFile).map((sheetName) => (
          <button
            key={sheetName}
            onClick={() => setVisibleTable(sheetName)}
            className={`px-4 py-1 rounded-full border-2 ${
              visibleTable === sheetName ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white'
            }`}
          >
            {sheetName}
          </button>
        ))}
      </div>

      {/* Only show the selected table */}
      {visibleTable && (
        <div key={visibleTable} className="mb-8 overflow-auto  h-[50vh]">
          <table className="min-w-full border-collapse border mb-4">
            <thead className="bg-gray-200 sticky -top-1 z-10">
              <tr className='text-[16px] 2xl:text-[20px]'>
                <th className="border p-2 text-left">Select rows to remove</th>
                {getMappedData(visibleTable).headers.map((header, index) => (
                  <th key={index} className="border p-2 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getMappedData(visibleTable).rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={`${selectedRows[visibleTable]?.has(rowIndex + 1) ? 'bg-red-100' : 'even:bg-gray-100'} text-[16px] 2xl:text-[20px]`}>
                  <td className="border p-2 text-left">
                    <input
                      type="radio"
                      className={`w-4 h-4 ${isRowRemoved(visibleTable, rowIndex + 1) ? 'text-red-500' : ''}`}
                      checked={selectedRows[visibleTable]?.has(rowIndex + 1) || false}
                      onChange={() => handleRowSelect(visibleTable, rowIndex + 1)}
                      disabled={isRowRemoved(visibleTable, rowIndex + 1)}
                    />
                  </td>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border p-2 text-left">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={removeSelectedRows}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-red-300"
          disabled={!Object.keys(selectedRows).length}
        >
          Remove {Object.values(selectedRows).reduce((acc, set) => acc + set.size, 0)} rows
        </button>
        <button
          onClick={restoreRemovedRows}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
          disabled={!Object.keys(removedRows).length}
        >
          Restore {Object.values(removedRows).reduce((acc, arr) => acc + arr.length, 0)} rows
        </button>
      </div>
    </div>
  );
};

export default ValidateData;
