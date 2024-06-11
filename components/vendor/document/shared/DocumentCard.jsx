import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { Settings } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import ConfirmationModal from "@/components/admin/shared/ConfirmationModal";
import {useDisclosure} from "@nextui-org/react";
import { useRouter } from "next/router";

const DocumentCard = ({cardData , setIsDeleted}) => {

    const router = useRouter()
    const [openPopoverIndex, setOpenPopoverIndex] = React.useState(null);
    const [selectedDocument , setSelectedDocument] = useState(null)
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const modalData = {
      heading: "Delete Document",
      desc: " Are you sure you want to delete the Document? The Document will no longer be available, and you won’t be able to access their information",
      name: "Sodexo",
      confirmText: "Confirm deleted"
    }
  
    const handleDelete = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
    
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };
    
      fetch(`http://localhost:3001/api/documents/${selectedDocument?.id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log("$$$$$$$$$", result)
          toast.success("Document deleted successfully")
          setIsDeleted(!isDeleted)
        })
        .catch((error) => console.error(error));
    }
  
  return (
    <div>
      <div className="flex flex-wrap w-[80%] mx-auto my-5 gap-x-10">
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
                      <div className="text-small cursor-pointer"
                        onClick={()=>{router.push(`/vendor/document/AddDocument?id=${item.id}`)
                        }}
                      
                      >Update</div>
                      <div className="text-small text-red-600 cursor-pointer"
                      onClick={()=>{setSelectedDocument(item)
                        onOpen()
                      }}
                      
                      >Delete</div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          );
        })}
      </div>
      <ConfirmationModal isOpen={isOpen} onOpenChange ={onOpenChange} data={modalData} handleSubmit={handleDelete}/>
    </div>
  );
};

export default DocumentCard;
