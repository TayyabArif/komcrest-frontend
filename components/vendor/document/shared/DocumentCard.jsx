import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { Settings } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import ConfirmationModal from "@/components/admin/shared/ConfirmationModal";
import { useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/router";
import { formatDate } from "../../../../helper";
import { useCookies } from 'react-cookie';
import { toast } from "react-toastify";

const DocumentCard = ({ cardData, setIsDeleted }) => {
  const router = useRouter();
  const [openPopoverIndex, setOpenPopoverIndex] = React.useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cookies, setCookie] = useCookies(['myCookie']);
  const cookiesData = cookies.myCookie;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const modalData = {
    heading: "Delete Document",
    desc: " Are you sure you want to delete the Document? The Document will no longer be available, and you won’t be able to access their information",
    name: "Sodexo",
    confirmText: "Confirm deleted",
  };

  const handleDelete = async () => {
    const token = cookiesData.token
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };
    fetch(
      `${baseUrl}/documents/${selectedDocument?.id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log("$$$$$$$$$", result);
        toast.success("Document deleted successfully");
        setIsDeleted(true);
      })
      .catch((error) => console.error(error));
  };

  const handleDownload = async (filePath) => {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const fileUrl = `${baseUrl}/${filePath}`;
    try {
      const response = await fetch(proxyUrl + fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filePath.split("/").pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Document Downloaded successfully");
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };

  const  handleDocumentLink = (link) => {
    window.open(link, '_blank');
  } 

  // const handleDownload = async (filePath) => {
  //   const fileUrl = `http://localhost:3001/${filePath}`;
  //   try {
  //     const response = await fetch(fileUrl);
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', filePath.split('/').pop());
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.error("Error downloading the file", error);
  //   }
  // };

  return (
    <div>
      <div className="flex flex-wrap w-[80%] mx-auto my-5 gap-x-10">
        {cardData &&
          cardData.map((item, index) => {
            return (
              <div
                key={index}
                className="w-[230px] h-[180px] bg-white rounded-lg p-2 my-4 flex flex-col justify-between mx-2"
              >
                <div>
                  <h1 className="text-[14px] font-semibold">{item.title}</h1>
                  <h2 className="text-[11px] font-semibold">{item.name}</h2>
                  <p className="text-[11px]">{item.description}</p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[13px]">
                    DOCX {formatDate(item.createdAt)}
                  </span>
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
                      <div className="px-3 py-2 space-y-1">
                        {item.filePath && (
                          <div
                            onClick={() => {
                              handleDownload(item.filePath);
                              setOpenPopoverIndex(null);
                            }}
                            className="text-small cursor-pointer"
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
                            className="text-small cursor-pointer"
                          >
                            Link
                          </div>
                        )}

                        <div
                          className="text-small cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/vendor/document/AddDocument?id=${item.id}`
                            );
                          }}
                        >
                          Update
                        </div>

                        <div
                          className="text-small text-red-600 cursor-pointer"
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
