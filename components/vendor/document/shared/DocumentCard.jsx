import React from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { Settings } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
const DocumentCard = ({cardData}) => {
    const [openPopoverIndex, setOpenPopoverIndex] = React.useState(null);
  return (
    <div>
      <div className="flex justify-between flex-wrap w-[80%] mx-auto my-10">
        { cardData && cardData.map((item, index) => {
          return (
            <div
              key={index}
              className="w-[180px] h-[130px] bg-white rounded-lg p-2 my-4 flex flex-col justify-between mx-2"
            >
              <div>
                <h1 className="text-[11px] font-semibold">{item.title}</h1>
                <h2 className="text-[11px] font-semibold">{item.name}</h2>
                <p className="text-[11px]">{item.description}</p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[13px]">DOCX-Apr182024</span>
                <Popover
                className="rounded-[0px]"
                  isOpen={openPopoverIndex === index}
                  onOpenChange={(open) =>
                    setOpenPopoverIndex(open ? index : null)
                  }
                >
                  <PopoverTrigger>
                    <Settings size={20} className="cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2 space-y-1">
                     { item.document_link &&  <div className="text-small ">Download</div>} 
                      <div className="text-small ">Update</div>
                      <div className="text-small text-red-600">Delete</div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentCard;
