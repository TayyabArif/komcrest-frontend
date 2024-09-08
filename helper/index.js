
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';




export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()]; 
    const day = date.getUTCDate().toString().padStart(2, '0'); 
    const year = date.getUTCFullYear();
  
    return `${month}-${day}-${year}`;
  }

export function formatDateWithTime(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  }).format(new Date(dateString));
}

  export const handleResponse = async (response  ,router, cookies,removeCookie) => {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else if (response.status === 400) {
      // router.push("/vendor/login/access");
      removeCookie('myCookie', { path: '/' });
      router.push("/vendor/login/access");
      toast.error(data?.error);
      throw new Error(data?.error);
    } else {
      throw new Error("An unexpected error occurred");
    }
  };
  

  export const formatCamelCaseString = (str) => {
    const words = str.replace(/([A-Z])/g, ' $1');
    const formattedString = words
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  
    return formattedString;
  }

  export const handleDownload = (filePath) => {
    alert(typeof filePath)
    console.log("filePathfilePathfilePath",filePath)
    if (typeof filePath === "string") {
        const fileName = filePath.split("/").pop();
        const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/files/${fileName}`;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('Invalid file path.');
    }
};


  export const urlPattern = new RegExp(
    "^(https?:\\/\\/)" + // Protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // Domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // Port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // Query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );

 export const multipleSelectStyle = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.80rem",
      border: "2.2px solid #E5E7EB",
      fontSize: "18px",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#2457D7",
      borderRadius: "1rem",
      padding: "0px 2px",
      color: "white",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white",
      ":hover": {
        backgroundColor: "#2457D7",
        borderRadius: "1rem",
        color: "white",
      },
    }),
  };


  /// exoort questionnire data 
  export const handleExport = (data , type) => {
    // Group data by 'sheetTag'
    const groupedData = data?.reduce((acc, record) => {
      const { sheetTag } = record;
      if (!acc[sheetTag]) {
        acc[sheetTag] = [];
      }
      
      // Filter the record to only include the desired properties
      const filteredRecord = {
        Category: record.category,
        Question: record.question,
        ...(!type ? { Compliance: record.compliance, Answer: record.answer ,Status: record.status,} : {})        

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