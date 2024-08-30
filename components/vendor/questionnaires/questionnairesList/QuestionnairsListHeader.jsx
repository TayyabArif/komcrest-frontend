import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { Settings } from "lucide-react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "@/helper";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useDisclosure, Progress } from "@nextui-org/react";
import DeleteModal from "../../shared/DeleteModal";
import { ArrowRight } from 'lucide-react';



const deleteModalContent = "Are you sure to delete this Questionnaires?";
const QuestionnairsListHeader = ({currentStatus ,questionnaireData, setDataUpdate}) => {  
  const router = useRouter();
  const { id } = router.query;
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [dropDownOpen ,setDropDownOpen] = useState(false)

  const questionnaireUpdated = (value) => {
    const jsonPayload = JSON.stringify({
      status : value
      });
    const token = cookiesData.token;
    let requestOptions = {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: jsonPayload,
      redirect: "follow",
    };
  
    
      fetch(`${baseUrl}/questionnaires/${id}`, requestOptions)
        .then(async (response) => {
          const data = await handleResponse(response, router, cookies, removeCookie);
          return {
            status: response.status,
            ok: response.ok,
            data,
          };
        })
        .then(({ status, ok, data }) => {
          if (ok) {
            toast.success(data.message);
            setDataUpdate((prev)=>!prev)
          } else {
            toast.error(data?.error || "Questionnaires status not Updated");
            console.error("Error:", data);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.error("API Error:", error.response);
            toast.error(error.response.data?.error || "An error occurred while Updated  Questionnaires status");
          }
        });
  }
  const handleExport = () => {
    // Group data by 'sheetTag'
    const groupedData = questionnaireData?.questionnaireRecords?.reduce((acc, record) => {
      const { sheetTag } = record;
      if (!acc[sheetTag]) {
        acc[sheetTag] = [];
      }
      
      // Filter the record to only include the desired properties
      const filteredRecord = {
        Category: record.category,
        Question: record.question,
        Status: record.status,
        Compliance : record.compliance,
        Answer: record.answer

      };
      
      acc[sheetTag].push(filteredRecord);
      return acc;
    }, {});
  
    // Create a workbook
    const workbook = XLSX.utils.book_new();
  
    // Add sheets to the workbook based on 'sheetTag'
    Object.keys(groupedData).forEach(sheetName => {
      const sheetData = groupedData[sheetName];
      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });
  
    // Convert workbook to binary format
    const workbookBinary = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  
    // Function to create a Blob from the workbook binary
    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    };
  
    // Create a Blob from the workbook binary
    const blob = new Blob([s2ab(workbookBinary)], { type: 'application/octet-stream' });
  
    // Create a link element to download the file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'excel_data.xlsx'; // Use the file name provided
    link.click();
  
    // Clean up and revoke the Object URL
    URL.revokeObjectURL(link.href);
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

    try {
      const response = await fetch(
        `${baseUrl}/questionnaires/${id}`,
        requestOptions
      );

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        router.push("/vendor/questionnaires")
      } else {
        toast.error("Failed to delete questionnaires");
      }
    } catch (error) {
      console.error("Error during bulk delete:", error);
      toast.error("An error occurred during deletion");
    }
  
  };
  
  return (
    <div className="bg-gray-50 py-2">
      <div className="flex justify-between items-center  w-[85%] mx-auto">
        <div className="leading-7 flex gap-2 items-center">
          <p
          onClick={()=>router.push("/vendor/questionnaires")}
          className="text-[16px] 2xl:text-[20px] cursor-pointer">Questionnaires</p>
          <ArrowRight size={20}/>
          <p className="text-[16px] 2xl:text-[20px]">{questionnaireData?.customerName} - {questionnaireData?.fileName.replace(".xlsx", "")}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <select onChange={(e)=>questionnaireUpdated(e.target.value)}  value={currentStatus} className="w-[150px]  bg-[#D8D8D8] text-[18px] border rounded-lg pr-3 p-[5px]">
              <option  disabled>Change Status</option>
              <option value="To Process">To Process</option>
              <option value="Started">Started</option>
              <option value="For Review">For Review</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
            </select>
            <Button
              radius="none"
              size="sm"
              className="text-white text-sm  2xl:text-[20px] bg-btn-primary w-max rounded-[4px] my-4"
              onClick={handleExport}
            >
              Export .XLS
            </Button>
            <div className="bg-[#D8D8D8] py-1 px-[6px] rounded-md">
            <Popover
            isOpen={dropDownOpen}
            onOpenChange={(open) =>{
              setDropDownOpen(false)
            }}
            
          className="rounded-[0px]"
        >
          <PopoverTrigger>
          <Settings className="text-[#252525] " onClick={()=>setDropDownOpen(true)}/>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-3 py-2 space-y-1.5 text-[16px]">
              <div className="text-small cursor-pointer ">
                Download original questionnaire
              </div>

              <div className="text-small cursor-pointer"
              onClick={(e)=>{
                e.stopPropagation()
                router.push(`/vendor/questionnaires/update?id=${id}`)
              }}
              >Update info</div>

              <div className="text-small text-red-600 cursor-pointer "
              onClick={(e) => {
                onOpen();
                setDropDownOpen(false)
              }}>
                Delete
              </div>
            </div>
          </PopoverContent>
        </Popover>
            
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            handleSubmit={handleDelete}
            deleteModalContent={deleteModalContent}
          />
    </div>
  );
};

export default QuestionnairsListHeader;
