
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import ExcelJS from "exceljs";
import stringSimilarity from "string-similarity";





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
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    // second: 'numeric',
    hour12: true,
  }).format(new Date(dateString));
}

export function getOnlyDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(dateString));
}

  export const handleResponse = async (response  ,router, cookies,removeCookie) => {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else if (response.status === 400) {
      // router.push("/vendor/login/access");
      removeCookie('myCookie', { path: '/' });
      // router.push("/vendor/login/access");
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


export const handleFileDownload = async (filePath) => {
  if (typeof filePath === "string") {

    const fileName = filePath.split("/").pop();
    const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${fileName}`;

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Network response was not ok");
     console.log(":::::>>>>>>>",response)
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
    fontSize: "20px",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'white', // Set the background color of the whole dropdown menu
    padding :"0px 6px",
    borderRadius: "0.80rem",
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: '18px', // Adjust the text size in the dropdown
    backgroundColor: state.isFocused ? '#D4D4D8' : provided.backgroundColor, // Change hover color to red
    // color: state.isFocused ? 'white' : provided.color, // Optionally change text color on hover
    padding:"4px 5px",
    borderRadius: "10px",
    margin:"2px 0px",
  }),
  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: state.data.isFixed ? "gray" : "#2457D7",
    borderRadius: "1rem",
    padding: "0px 2px",
    color: "white",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    color: state.data.isFixed ? "white" : "white",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "white",
    ":hover": {
      backgroundColor: "#2457D7",
      borderRadius: "4rem",
      color: "white",
    },
  }),
};


  export const handleExport = async (data, filePath) => {
      const extractedData = data.map(item => ({
          question: item.question,
          compliance: item.compliance,
          answer: item.answer,
          sheetTag: item.sheetTag
      }));
      if (typeof filePath === "string") {
          const fileName = filePath.split("/").pop();
          const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/files/${fileName}`;
          try {
              const response = await fetch(downloadUrl);
              if (!response.ok) {
                  alert("File fetch failed!");
                  return;
              }
  
              const arrayBuffer = await response.arrayBuffer();
              const workbook = new ExcelJS.Workbook();
              await workbook.xlsx.load(arrayBuffer);
  
              // Define fixed column indices for "Compliance" and "Answer"
              const complianceColIndex = 7; // Example: Column 7 for Compliance
              const answerColIndex = 8;    // Example: Column 8 for Answer
  
              // Cleaning function
              const strictCleanString = (str) =>
                  str
                      .trim()
                      .replace(/\s+/g, " ") // Replace multiple spaces/newlines with a single space
                      .normalize(); // Normalize Unicode representations
  
              for (const sheetData of extractedData) {
                  const { sheetTag, question, compliance, answer } = sheetData;
  
                  const worksheet = workbook.getWorksheet(sheetTag);
                  if (!worksheet) {
                      console.warn(`Worksheet with tag "${sheetTag}" not found.`);
                      continue;
                  }
  
                  console.log(`Processing worksheet: ${worksheet.name}`);
  
                  // Ensure headers are set in the fixed columns
                  worksheet.getRow(1).getCell(complianceColIndex).value = "Compliance";
                  worksheet.getRow(1).getCell(answerColIndex).value = "Answer";
  
                  // Find the row where the question matches
                  let matchedRow = null;
                  worksheet.eachRow((row) => {
                    row.eachCell((cell) => {
                        if (cell.value) {
                            let cleanedCellValue;
                
                            // Check if the value is a string, number, or other type
                            if (typeof cell.value === "string") {
                                cleanedCellValue = strictCleanString(cell.value);
                            } else if (typeof cell.value === "number") {
                                cleanedCellValue = cell.value.toString(); // Convert number to string
                            } else if (typeof cell.value === "object" && cell.value.richText) {
                                // Handle rich text objects (ExcelJS rich text)
                                cleanedCellValue = strictCleanString(
                                    cell.value.richText.map((part) => part.text).join("")
                                );
                            } else {
                                cleanedCellValue = ""; // Fallback for unsupported types
                            }
                
                            const cleanedQuestion = strictCleanString(question);
                
                            // Perform strict matching
                            if (cleanedCellValue === cleanedQuestion) {
                                matchedRow = row;
                            }
                        }
                    });
                });
                
  
                  if (matchedRow) {
                      console.log(`Question matched in row: ${matchedRow.number}`);
  
                      // Write "Compliance" and "Answer" to fixed columns
                      matchedRow.getCell(complianceColIndex).value = compliance || "N/A";
                      matchedRow.getCell(answerColIndex).value = answer || "N/A";
                    
                  } else {
                      console.warn(`No match found for question: ${question}`);
                  }
              }
  
              // Save the modified workbook
              const modifiedFileBuffer = await workbook.xlsx.writeBuffer();
              const blob = new Blob([modifiedFileBuffer], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = `modified_${fileName}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
  
              console.log("Compliance and Answer columns updated successfully!");
          } catch (error) {
              console.error("Error modifying the file:", error);
              alert("An error occurred while processing the file.");
          }
      } else {
          alert("Invalid file path.");
      }
  };
  
  


  
  
  
  
  
  

  
  
  
  
  
  