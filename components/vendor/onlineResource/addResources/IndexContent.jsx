import React from 'react'

const IndexContent = ({resourceData}) => {
  // debugger
  return (
    <div className="overflow-x-auto mt-10">
    <table className="min-w-full  block md:table ">
      <thead className="block md:table-header-group">
        <tr className=" border md:border-none  block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative ">
          <th className="p-2 font-bold  py-3  border border-[#b8b6b6]    text-left block md:table-cell">
            Title
          </th>
          <th className="p-2 py-3 font-bold border border-[#b8b6b6]  text-left block md:table-cell">
            URL
          </th>
          <th className="p-2  py-3 font-bold border border-[#b8b6b6] text-left block md:table-cell">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="block md:table-row-group">
        {resourceData?.resources?.map((item, index) => (
          <tr key={index} className="bg-white">
             <td className="p-2 border border-[#b8b6b6]  text-left block md:table-cell py-3">{item.title}</td>
            <td className="p-2 border border-[#b8b6b6]  text-left block md:table-cell py-3">{item.url}</td>
            <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default IndexContent