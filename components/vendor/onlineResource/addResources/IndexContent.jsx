import React, { useEffect } from 'react';
import useSocket from '@/customHook/useSocket';
import { X ,Check} from "lucide-react";

const IndexContent = ({ resourceData, setResourceData }) => {
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('scrapingStatus', (statusUpdate) => {
        console.log("Received status update:", statusUpdate); // Log received data

        setResourceData((prevState) => {

          const resourceIndex = prevState.resources.findIndex(
            (resource) => resource.id === statusUpdate.id
          );

          if (resourceIndex !== -1) {
            // Update the existing resource
            const updatedResources = [...prevState.resources];
            updatedResources[resourceIndex] = {
              ...updatedResources[resourceIndex],
              status: statusUpdate.status,
            };
            return { ...prevState, resources: updatedResources };
          } else {
            // Add the new resource
            return {
              ...prevState,
              resources: [...prevState.resources, statusUpdate],
            };
          }
        });
      });

      return () => {
        socket.off('scrapingStatus');
      };
    }
  }, [socket, setResourceData]);

  const CheckIcon = ({ status }) => {
    switch (status) {
      case "Content cannot be saved":
        return <X size={20} strokeWidth={5} className='text-red-600' />;
        case "Content saved":
        return <Check size={20} strokeWidth={5} className='text-blue-600' />;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto mt-10">
      <table className="min-w-full block md:table">
        <thead className="block md:table-header-group">
          <tr className="border text-[16px] 2xl:text-[20px] md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
            <th className="p-2 font-bold py-3 border border-[#b8b6b6] text-left block md:table-cell">
              Title
            </th>
            <th className="p-2 py-3 font-bold border border-[#b8b6b6] text-left block md:table-cell">
              URL
            </th>
            <th className="p-2 py-3 font-bold border border-[#b8b6b6] text-left block md:table-cell">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {resourceData?.resources?.map((item, index) => (
            <tr key={index} className="bg-white text-[16px] 2xl:text-[20px]">
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">{item.title}</td>
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">{item.url}</td>
              <td className="p-2 border border-[#b8b6b6] text-left md:table-cell py-3 flex">
                <div className='flex items-center gap-3'>
                <div>{item.status}</div> 
               <div><CheckIcon status={item.status} /></div> 
               </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IndexContent;
