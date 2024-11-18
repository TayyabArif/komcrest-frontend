import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

const ValidateData = forwardRef(
  ({ excelFile, columnMapping, setExcelFile, setReamingData,selectedHeaderRow }, ref) => {
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
        const mappedRow = mappedHeaders.map(([index]) => row[index]);
        rows.push(mappedRow);
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
          updated[sheetName].delete(rowIndex); // Allow deselection
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
            updated[sheetName] = new Set();
          }
          rowIndexes.forEach((rowIndex) => updated[sheetName].add(rowIndex));
        }
        return updated;
      });

      setSelectedRows({}); // Clear selected rows after removal
    };

    const restoreRemovedRows = (sheetName) => {
      setRemovedRows((prevRemovedRows) => {
        const updated = { ...prevRemovedRows };
        if (updated[sheetName]) {
          updated[sheetName] = new Set(); // Only restore rows for the specific sheet
        }
        return updated;
      });
    };

    const isRowRemoved = (sheetName, rowIndex) => {
      return removedRows[sheetName] && removedRows[sheetName].has(rowIndex);
    };

    const sendDataBackToParentComponent = () => {
      const remainingData = {};

      Object.keys(excelFile).forEach((sheetName) => {
        const rows = excelFile[sheetName].slice(selectedHeaderRow[sheetName] + 1).filter((row, rowIndex) => {
          return !isRowRemoved(sheetName, rowIndex + 1); // Only send non-deleted rows
        });
        remainingData[sheetName] = rows;
      });
      setReamingData(remainingData);

      return remainingData;
    };


    const childFunction = () => {
      const remainingResult = sendDataBackToParentComponent();
      return remainingResult;
    };

    useImperativeHandle(ref, () => ({
      callChildFunction: childFunction,
    }));

    return (
      <div className="py-1 flex-1 flex flex-col h-[0vh]">
        {/* Buttons to switch between tables */}
        <div className="flex space-x-2 mb-2">
          {Object.keys(excelFile).map((sheetName) => (
            <button
              key={sheetName}
              onClick={() => setVisibleTable(sheetName)}
              className={`px-3 py-[2px] mx-[2px] rounded-full border-2 ${
                visibleTable === sheetName
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300 bg-white"
              }`}
            >
              {sheetName}
            </button>
          ))}
        </div>
        {/* Only show the selected table */}
        {visibleTable && (
          <div key={visibleTable} className=" overflow-auto flex-1 h-[0vh]">
            <table className="min-w-full border-collapse border mb-4">
              <thead className="bg-gray-200 sticky -top-1 z-10">
                <tr className="text-[16px] 2xl:text-[20px]">
                  <th className="border p-2 text-left w-[100px] ">
                    Rows to remove
                  </th>
                  {getMappedData(visibleTable).headers.map((header, index) => (
                    <th key={index} className="border p-2 text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getMappedData(visibleTable).rows.slice(selectedHeaderRow[visibleTable]).map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`${
                      isRowRemoved(visibleTable, rowIndex + 1)
                        ? "bg-red-100"
                        : "bg-white"
                    } text-[16px] 2xl:text-[20px]`}
                  >
                    <td className="border p-2 text-left w-[100px]">
                      <input
                        type="checkbox"
                        className={`w-4 h-4 rounded-full appearance-none border-2 ${
                          selectedRows[visibleTable]?.has(rowIndex + 1)
                            ? "bg-red-500 border-red-500" // Red color when selected
                            : "bg-white border-gray-300" // Default state (unselected)
                        }`}
                        checked={
                          selectedRows[visibleTable]?.has(rowIndex + 1) || false
                        }
                        onChange={() =>
                          handleRowSelect(visibleTable, rowIndex + 1)
                        }
                        disabled={isRowRemoved(visibleTable, rowIndex + 1)} // Disable if marked as removed
                      />
                    </td>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border p-2 text-left min-w-[200px]">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={removeSelectedRows}
            className="px-4 py-2 text-[15px] 2xl:text-[20px] bg-red-500 text-white rounded disabled:bg-red-300"
            disabled={!Object.keys(selectedRows).length}
          >
            Mark{" "}
            {Object.values(selectedRows).reduce(
              (acc, set) => acc + set.size,
              0
            )}{" "}
            rows as removed
          </button>
          <button
            onClick={() => restoreRemovedRows(visibleTable)} // Restore only for the visible table
            className="px-4 py-2  text-[15px] 2xl:text-[20px] bg-gray-500 text-white rounded disabled:bg-gray-300"
            disabled={!removedRows[visibleTable]?.size}
          >
            Restore {removedRows[visibleTable]?.size || 0} rows
          </button>
        </div>
      </div>
    );
  }
);
ValidateData.displayName = "ValidateData";
export default ValidateData;
