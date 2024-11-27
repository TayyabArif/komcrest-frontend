
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
      <div className=" relative">
        <table className="min-w-max bg-white border border-gray-300 table-fixed text-sm w-full border-collapse">
          <thead className="bg-gray-50 sticky -top-1  z-50">
            <tr className="bg-[#ebeef2]  ">
              {Object.keys(questions[0]).map((header) => (
                <th
                  key={header}
                  className="px-2 py-3 border text-left text-xs text-black font-semibold uppercase tracking-wider text-[16px] 2xl:text-[20px]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((item, index) => (
              <tr
                key={index}
                className={` break-words ${index % 2 === 0 ? "bg-gray-100" : ""}`}
              >
                {Object.keys(item).map((key) => (
                  <td
                    key={key}
                    className="px-2 py-2 border text-sm font-medium  text-gray-900 text-[16px] 2xl:text-[20px] text-wrap"
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
      <p className="w-full justify-center text-[16px] 2xl:text-[20px] shadow-md rounded-lg">No data to display</p>
    )}
  </div>
  );
};

export default Validate;
