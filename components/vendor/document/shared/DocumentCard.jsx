import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { Settings } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import ConfirmationModal from "@/components/admin/shared/ConfirmationModal";
import { useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/router";
import { formatDate } from "../../../../helper";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import {  handleDownload} from "@/helper";
import { saveAs } from "file-saver";

const DocumentCard = ({ cardData, setIsDeleted, isDeleted }) => {
  const router = useRouter();
  const [openPopoverIndex, setOpenPopoverIndex] = React.useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cookies, setCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const modalData = {
    heading: "Delete Document",
    desc: " Are you sure you want to delete the Document? The Document will no longer be available, and you won’t be able to access their information",
    name: "Sodexo",
    confirmText: "Confirm deleted",
  };

  const handleDelete = async () => {
    const token = cookiesData.token;
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };
    
    fetch(`${baseUrl}/documents/${selectedDocument?.id}`, requestOptions)
      .then((response) => {
        if (response.ok) {  // Check if response status is 200-299
          return response.text();
        } else {
          throw new Error("Failed to delete document"); // Handle non-200 responses
        }
      })
      .then((result) => {
        console.log("$$$$$$$$$", result);
        toast.success("Document deleted successfully");
        setIsDeleted(!isDeleted);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error deleting document");
      });
  };
  
 
  
  const handleDownload = async (filePath) => {
    if (typeof filePath === "string") {
      const fileName = filePath.split("/").pop();
      const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${fileName}`;
  
      try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("Network response was not ok");
  
        const blob = await response.blob();
   
        // Directly trigger download without asking location
        saveAs(blob, fileName);
  
        // Show success toast
        toast.success("Document downloaded successfully");
      } catch (error) {
        console.error("Download failed:", error);
        toast.error("Failed to download document");
      }
    } else {
      alert("Invalid file path.");
    }
  };
  
  
  

  const handleDocumentLink = (link) => {
    const formattedLink =
      link.startsWith("http://") || link.startsWith("https://")
        ? link
        : `https://${link}`;
    window.open(formattedLink, "_blank");
  };


  return (
    <div className="overflow-auto">
      <div className="flex flex-wrap   w-[85%] mx-auto py-6 gap-[3.4rem]">
        {cardData &&
          cardData.map((item, index) => {
            return (
              <div
                key={index}
                className="w-[21%] min-h-[250px] bg-white rounded-lg p-2 px-4 flex flex-col justify-between"
              >
                <div
                  className=""
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  <h1 className="text-[16px] font-semibold 2xl:text-[20px]">{item.title}</h1>
                  <p className="text-[15px] 2xl:text-[20px]">{item.description}</p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[14px] 2xl:text-[20px]">
                    {item.filePath.split('.').pop().toUpperCase()} -
                    <span className="mx-2 text-[14px] 2xl:text-[20px]">{formatDate(item.createdAt)}</span>
                  </span>
                  <Popover
                    className="rounded-[0px]"
                    isOpen={openPopoverIndex === index}
                    onOpenChange={(open) =>
                      setOpenPopoverIndex(open ? index : null)
                    }
                  >
                    <PopoverTrigger>
                      <Settings
                        size={20}
                        className="cursor-pointer"
                        color="#2457d7"
                        strokeWidth={2}
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="px-3 py-2 space-y-1.5">
                        {item.filePath && (
                          <div
                            onClick={() => {
                              // handleDownload(item.filePath);
                              handleDownload(item.filePath)
                              setOpenPopoverIndex(null);
                            }}
                            className="text-small cursor-pointer 2xl:text-[20px]"
                          >
                            Download
                          </div>
                        )}

                        {item.documentLink && (
                          <div
                            onClick={() => {
                              handleDocumentLink(item.documentLink);
                              setOpenPopoverIndex(null);
                            }}
                            className="text-small cursor-pointer 2xl:text-[20px]"
                          >
                            Link
                          </div>
                        )}

                        <div
                          className="text-small cursor-pointer 2xl:text-[20px]"
                          onClick={() => {
                            router.push(
                              `/vendor/document/AddDocument?id=${item.id}`
                            );
                          }}
                        >
                          Update
                        </div>

                        <div
                          className="text-small text-red-600 cursor-pointer 2xl:text-[20px]"
                          onClick={() => {
                            setSelectedDocument(item);
                            onOpen();
                            setOpenPopoverIndex(null);
                          }}
                        >
                          Delete
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            );
          })}
      </div>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        data={modalData}
        handleSubmit={handleDelete}
      />
    </div>
  );
};

export default DocumentCard;
