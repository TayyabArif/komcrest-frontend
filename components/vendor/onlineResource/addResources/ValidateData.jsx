import React from 'react'

const ValidateData = ({resourceData}) => {
  // debugger
  return (
   <div className="overflow-x-auto mt-10">
      <table className="min-w-full block md:table">
        <thead className="block md:table-header-group">
          <tr className="border md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
            <th className="p-2 font-bold py-3 border border-[#b8b6b6] text-left block md:table-cell">
              Title 
            </th>
            <th className="p-2 py-3 font-bold border border-[#b8b6b6] text-left block md:table-cell">
              URL
            </th>
            <th className="p-2 py-3 font-bold border border-[#b8b6b6] text-left block md:table-cell">
              Download
            </th>
            <th className="p-2 py-3 font-bold border border-[#b8b6b6] text-left block md:table-cell">
              Products
            </th>
            <th className="p-2 py-3 font-bold border border-[#b8b6b6] text-left block md:table-cell">
              Indexation method
            </th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {resourceData?.resources?.map((item, index) => (
            <tr key={index} className="bg-white">
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
                {item.title}
              </td>
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
                {item.url}
              </td>
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
                {item.file ? (
                  <div className="flex flex-col">
                    <span>Click to download Docx file</span>
                    <span
                      className="text-blue-500 hover:underline cursor-pointer"
                      onClick={()=>handleDownload(item.file)}
                    >
                      {item.title}
                    </span>
                  </div>
                ) : (
                  "Docx file not available"
                )}
              </td>
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
               produncts 1 , produncts 1 , produncts 1 
              </td>
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
              {item.indexing}
              </td>
            </tr>
          ))}
        </tbody>
      </table>  
    </div>
  )
}

export default ValidateData