
import React from "react";

const Validate = ({ knowledgeData, questions , selectedRowIndex }) => {
  const thStyle = {
    border: "1px solid #dddddd",
    textAlign: "left",
    padding: "4px",
  };

  const tdStyle = {
    border: "1px solid #dddddd",
    textAlign: "left",
    padding: "4px",
  };

  const truncate = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };
  return (
    <div className="w-full overflow-x-auto">
    {questions ? (
      <div className="relative">
        <table className="min-w-max bg-white border border-gray-300 table-fixed w-full border-collapse">
          <thead className="bg-gray-50 sticky -top-1  z-50">
            <tr className="bg-[#ebeef2]  text-standard">
              {Object.keys(questions[0]).map((header) => (
                <th
                  key={header}
                  className="px-2 py-2 border text-left  text-black  uppercase  text-standard"
                >
                  {header == "coverage" ? "Compliance" : header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((item, index) => (
              <tr
                key={index}
                className={`text-standard break-words ${index % 2 === 0 ? "bg-gray-100" : ""}`}
              >
                {Object.keys(item).map((key) => (
                  <td
                    key={key}
                    className="px-2 py-2 border  text-gray-900 text-standard text-wrap"
                  >
                    {truncate(item[key], 30)} 
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="w-full justify-center text-standard shadow-md rounded-lg">No data to display</p>
    )}
  </div>
  );
};

export default Validate;
