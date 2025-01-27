import React, { useState } from "react";

const SelectQuestion = ({
  excelFile,
  selectedRows,
  columnMapping,
  setColumnMapping,
}) => {
  const [visibleTable, setVisibleTable] = useState(Object.keys(excelFile)[0]);

  const handleMappingChange = (sheetName, columnIndex, value) => {
    setColumnMapping((prevMapping) => {
      const updatedMapping = { ...prevMapping };

      // If value is empty, delete the key
      if (value === "") {
        // Delete the columnIndex key for the specified sheetName
        const { [columnIndex]: _, ...rest } = updatedMapping[sheetName] || {};
        updatedMapping[sheetName] = rest;

        // If there are no more keys for this sheetName, remove the sheetName key as well
        if (Object.keys(updatedMapping[sheetName] || {}).length === 0) {
          delete updatedMapping[sheetName];
        }
      } else {
        // Otherwise, update or add the columnIndex key with the new value
        updatedMapping[sheetName] = {
          ...updatedMapping[sheetName],
          [columnIndex]: value,
        };
      }

      return updatedMapping;
    });
  };

  const renderDropdown = (sheetName, columnIndex) => {
    const usedOptions = Object.values(columnMapping[sheetName] || {});

    // Single-column sheets should only allow "Question" selection
    if (excelFile[sheetName][0].length === 1) {
      return (
        <select
          className="w-[250px] bg-transparent text-standard border rounded-lg pr-3 p-2"
          name={`mapping-${sheetName}-${columnIndex}`}
          value={columnMapping[sheetName]?.[columnIndex] || ""} // Set the default value
          onChange={(e) => {
            const selectedValue = e.target.value;
            if (selectedValue === "Clear Selection") {
              // Clear the selection when "Clear Selection" is chosen
              handleMappingChange(sheetName, columnIndex, "");
            } else {
              // Otherwise, update the selection
              handleMappingChange(sheetName, columnIndex, selectedValue);
            }
          }}
        >
          <option value="" disabled>
            Select
          </option>
          <option value="Question">Question</option>
          {columnMapping[sheetName]?.[columnIndex] && (
            <option value="Clear Selection" className="!text-red-300">
              Clear Selection
            </option>
          )}
        </select>
      );
    }

    // For multi-column sheets
    const currentSelection = columnMapping[sheetName]?.[columnIndex];
    let availableOptions = ["Category", "Question"].filter(
      (option) => !usedOptions.includes(option) || option === currentSelection
    );

    // Add "Clear Selection" option if there's a current selection
    if (currentSelection) {
      availableOptions = [...availableOptions, "Clear Selection"];
    }

    return (
      <select
        className="w-[250px] bg-transparent text-standard border rounded-lg pr-3 p-2"
        name={`mapping-${sheetName}-${columnIndex}`}
        value={currentSelection || ""}
        onChange={(e) => {
          const selectedValue = e.target.value;
          if (selectedValue === "Clear Selection") {
            // Clear the selection when "Clear Selection" is chosen
            handleMappingChange(sheetName, columnIndex, "");
          } else {
            // Otherwise, update the selection
            handleMappingChange(sheetName, columnIndex, selectedValue);
          }
        }}
      >
        <option value="" disabled>
          Select
        </option>
        {availableOptions.map((option) => (
          <option
            key={option}
            value={option}
            className={`${option === "Clear Selection" ? "!text-red-300" : ""}`}
            disabled={option === "No option available"}
          >
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
    if (typeof text === "string" && text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  const allOptionsSelected = (sheetName) => {
    const usedOptions = Object.values(columnMapping[sheetName] || {});
    const totalColumns = excelFile[sheetName][0].length;

    // For single-column sheets, check if the one value is selected
    if (totalColumns === 1) {
      return usedOptions.includes("Question");
    }

    // For multi-column sheets, ensure both "Category" and "Question" are selected
    return ["Question"].every((option) =>
      usedOptions.includes(option)
    );
  };

  return (
    <div className="py-2 overflow-auto">
      {/* Buttons for each sheet */}
      <div className="flex  mb-2">
        {Object.keys(excelFile).map((sheetName) => (
          <button
            key={sheetName}
            onClick={() => toggleTableVisibility(sheetName)}
            className={`px-3 mx-[2px] py-[2px] flex items-center gap-2 rounded-full border-2 ${
              allOptionsSelected(sheetName)
                ? "border-green-500 bg-green-100"
                : "border-red-600 bg-white"
            }`}
          >
            {sheetName} 
          </button>
        ))}
      </div>
      {/* Table for the selected sheet */}
      {visibleTable && excelFile[visibleTable] && (
        <div className="">
          <table className="min-w-full mb-4">
            <thead className="bg-[#E5E7EB]">
              <tr className="text-standard">
                {excelFile[visibleTable][selectedRows[visibleTable]]?.map(
                  (header, index) => (
                    <th key={index} className="border p-2 text-left">
                      {truncateText(header, 70)}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {[...excelFile[visibleTable]]
                .filter(
                  (row, index) =>
                    Array.isArray(row) && index !== selectedRows[visibleTable]) // Ensure each row is an array and filter out selected row
                .slice(selectedRows[visibleTable]) // remove the data before the selected header row
                .slice(0, 3) // Slice the filtered rows to get rows between index 1 and 3
                .map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="even:bg-gray-100 text-standard"
                  >
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border p-2 text-left">
                        {truncateText(cell, 70)}
                      </td>
                    ))}
                  </tr>
                ))}

              {/* Last two rows */}
              <tr className="font-bold  border-0 text-standard">
                <td className=" pt-3 text-left">Will be mapped with:</td>
              </tr>
              <tr className="border-0">
                {excelFile[visibleTable][selectedRows[visibleTable]]?.map(
                  (_, index) => (
                    <td key={index} className="border-0 text-left">
                      {renderDropdown(visibleTable, index)}
                    </td>
                  )
                )}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SelectQuestion;
