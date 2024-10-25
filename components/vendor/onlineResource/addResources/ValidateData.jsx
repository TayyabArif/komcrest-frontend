import React from "react";

const ValidateData = ({ resourceData, companyProducts }) => {
  console.log("resourceDataresourceDataresourceData", resourceData);
  const getNameById = (id) => {
    const product = companyProducts.find((item) => item.id === id);
    return product ? product.name : "Unknown";
  };

  return (
    <div className="overflow-x-auto ">
      <table className="min-w-full block md:table">
        <thead className="block md:table-header-group bg-[#EBEEF2]">
          <tr className="border text-[16px]  2xl:text-[20px] md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
            <th className="p-2 font-bold py-3 border  text-left block md:table-cell">
              Title
            </th>
            <th className="p-2 py-3 font-bold border  text-left block md:table-cell">
              URL
            </th>
            <th className="p-2 py-3 font-bold border  text-left block md:table-cell">
              Download
            </th>
            <th className="p-2 py-3 font-bold border  text-left block md:table-cell">
              Products
            </th>
            <th className="p-2 py-3 font-bold border  text-left block md:table-cell">
              Indexation method
            </th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {resourceData?.resources?.map((item, index) => (
            <tr key={index} className="bg-white text-[16px] 2xl:text-[20px]">
              <td className="p-2 border  text-left block md:table-cell py-3">
                {item.title}
              </td>
              <td className="p-2 border  text-left block md:table-cell py-3">
                {item.url}
              </td>
              <td className="p-2 border  text-left block md:table-cell py-3">
                {item.file ? (
                  <div className="flex flex-col">
                    <span>Click to download Docx file</span>
                    <span
                      className="text-blue-500 hover:underline cursor-pointer"
                      onClick={() => handleDownload(item.file)}
                    >
                      {typeof item.file === "object" && item.file !== null
                        ? item.file.name
                        : item.file?.split("/").pop() || "No file"}
                    </span>
                  </div>
                ) : (
                  "Docx file not available"
                )}
              </td>

              <td className="p-2 border  text-left md:table-cell py-3 flex">
                {resourceData.productIds?.map((id, index) => {
                  return (
                    <span key={id} className="px-1">
                      {getNameById(id)}
                      {index < resourceData.productIds.length - 1 && ","}
                    </span>
                  );
                })}
              </td>
              <td className="p-2 border  text-left block md:table-cell py-3">
                {item.indexing}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ValidateData;
