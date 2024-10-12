import React, { useState, useEffect } from "react";
import { Progress } from "@nextui-org/react";
import UploadFile from "./UploadFile";
import SelectHeaderRow from "./SelectHeaderRow";
import { Check, language } from "lucide-react";
import MatchColum from "./MatchColum";
import { Button, Checkbox, Select, SelectItem } from "@nextui-org/react";
import Validate from "./Validate";
import Completed from "../../shared/Completed";
import { useCookies } from "react-cookie";
import {handleResponse}  from "../../../../helper/index"
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useMyContext } from "@/context";

const UploadQuestions = () => {
  const [stepper, setStepper] = useState(0);
  const [progressBar, setProgressBar] = useState(13);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter()
  const [selectedHeader , setSelectedHeader] = useState([])
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [updateHeader , setUpdateHeader] = useState([]) 
  const [mappedIndexValue , setMappedIndexValue] = useState([])
  const {companyProducts } = useMyContext();
  
  const [knowledgeData, setKnowledgeData] = useState({
    name: "",
    language: "",
    productIds: [],
    questions: [],
  });

  const [updatedData , setUpdatedData] = useState({})



  const [selectedValues, setSelectedVsalues] = useState(knowledgeData.questions.length > 0 ? knowledgeData.questions[0]  : []);

  const language = [
    { key: "French", label: "French" },
    { key: "English", label: "English" },
    { key: "Spanish", label: "Spanish" },
    { key: "German", label: "German" },
  ];

  function getTitle() {
    switch (stepper) {
      case 0:
        return "Upload requirements, questions and answers";
      case 1:
        return "Select header row so we can match them afterwards with our columns";
      case 2:
        return "Match your columns with ours so we can index your content properly";
      case 3:
      case 4:
        return " Validate your data so that it can be properly indexed for our Komcrest AI";
    }
  }

  useEffect(() => {
    if (companyProducts.length === 1) {
      console.log("companyProducts", companyProducts);
      setKnowledgeData((prev) => ({
        ...prev,
        productIds: [companyProducts[0].id], 
      }));
    }
  }, [companyProducts]);



  const handleCheckboxChange = (id) => {
    setKnowledgeData((prevData) => {
      const productIds = prevData.productIds.includes(id)
        ? prevData.productIds.filter((productId) => productId !== id)
        : [...prevData.productIds, id];

      return {
        ...prevData,
        productIds,
      };
    });
  };

  const handleSelectChange = (value) => {
    setKnowledgeData({
      ...knowledgeData,
      language: value,
    });
  };

 
  const handleUpdateData = () => { 
    // const [headers, ...rows] = knowledgeData.questions;
    const rows = knowledgeData.questions.slice(1);
    const transformedData = rows.map((row) => {
      return mappedIndexValue.reduce((acc, header, index) => {
        if (header) {
          // acc[header.toLowerCase()] = row[index] ? row[index].trim() : "";
          acc[header.toLowerCase()] = row[index] && isNaN(row[index]) ? row[index].trim() : "";
        }
        return acc;
      }, {});
    });
  
   
  // Remove "do no map" key
    let updatedData =  transformedData.map(question => {
      const { "do no map": _, ...rest } = question; 
      return rest;
    });
  if (!updatedData[0].hasOwnProperty('curator')) {
    
    updatedData = updatedData.map(obj => ({
        ...obj,
        curator: cookiesData?.userName
    }));
}
    const newObj = {
      ...knowledgeData,
      questions: updatedData,
    };
    console.log("Transformed Data:", newObj);
    setUpdatedData(newObj)
    setStepper(stepper + 1);
      setProgressBar(progressBar + 27);
  }

  const  gotToMatchColum = () =>{
    if(selectedHeader.length > 0){
      setStepper(stepper + 1);
      setProgressBar(progressBar + 27);
    }else {
      toast.error("Select a header row")
    }
     
  }

const submitData = () => {
  setStepper(stepper + 1);
  setProgressBar(progressBar + 27);

  // change compliance to coverage

  let payloadData = updatedData
  payloadData.questions.forEach(question => {
    if (question.compliance !== undefined) {
        question.coverage = question.compliance;
        delete question.compliance;
    }
});
  
console.log(">>>>>>>>>>:::::::",payloadData)
  const jsonPayload = JSON.stringify(payloadData);

  const token = cookiesData.token;
  let requestOptions = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: jsonPayload,
    redirect: "follow",
  };

  fetch(`${baseUrl}/document-files`, requestOptions)
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
        console.log("Success:", data);
        toast.success("Knowledge created successfully");
        router.push("/vendor/knowledge");
      } else {
        toast.error(data?.error || "Document not Created");
        console.error("Error:", data);
      }
    })
    .catch((error) => {
      if (error.response) {
        console.error("API Error:", error.response);
        toast.error(error.response.data?.error || "An error occurred while creating the document");
      } else {
        console.error("Fetch Error:", error);
        toast.error("An error occurred while creating the Knowledge");
        setStepper(0);
      }
    });
};

  
  return (
    <div className="w-[100%] h-full">
      <div className="w-[90%] mx-auto py-4 mt-[2rem]">
        <h1 className="font-semibold bg-slate-50 px-6 py-1 2xl:text-[20px]">
          {getTitle()}
        </h1>
        <div className="w-full h-[83vh] bg-white p-6">
          <Progress
            aria-label="Loading..."
            value={progressBar}
            className="h-[8px]"
          />

          <div className="flex flex-col justify-between  h-full">
            <div>
          <div className="my-3 flex gap-2">
            <div className="flex gap-3 items-center flex-1 border py-2 px-2 rounded">
              <span
                className={`${
                  stepper == 1 || stepper > 1
                    ? "bg-blue-600  "
                    : "border-blue-600"
                } border-blue-600 flex items-center justify-center rounded-full  w-[25px] h-[25px] text-center border-2 `}
              >
                {stepper == 1 || stepper > 1 ? (
                  <Check className="text-white font-bold size-65" />
                ) : (
                  1
                )}
              </span>
              <h1
                className={`${
                  stepper == !1 ? "text-blue-600" : ""
                } font-semibold text-[16px] 2xl:text-[20px]`}
              >
                Uplaod File
              </h1>
            </div>

            <div className="flex gap-3 items-center flex-1 border py-1 px-2 rounded">
              <span
                className={`${
                  stepper == 2 || stepper > 2
                    ? "bg-blue-600"
                    : "border-blue-600"
                } border-blue-600 flex items-center justify-center rounded-full  w-[25px] h-[25px] text-center border-2`}
              >
                {stepper == 2 || stepper > 2 ? (
                  <Check className="text-white font-bold size-65" />
                ) : (
                  2
                )}
              </span>
              <h1 className="text-[16px] 2xl:text-[20px]">Select header row</h1>
            </div>

            <div className="flex gap-3 items-center flex-1 border py-1 px-2 rounded">
              <span
                className={`${
                  stepper == 3 || stepper > 3 ? "bg-blue-600" : ""
                } border-blue-600 flex items-center justify-center rounded-full  w-[25px] h-[25px] text-center border-2 `}
              >
                {stepper == 3 || stepper > 3 ? (
                  <Check className="text-white font-bold size-65" />
                ) : (
                  3
                )}
              </span>
              <h1 className="text-[16px] 2xl:text-[20px]">Match Columns</h1>
            </div>

            <div className="flex gap-3 items-center flex-1 border py-1 px-2 rounded">
              <span
                className={`${
                  stepper == 4 || stepper > 4 ? "bg-blue-600" : ""
                } border-blue-600 flex items-center justify-center rounded-full  w-[25px] h-[25px] text-center border-2 `}
              >
                {stepper == 4 || stepper > 4 ? (
                  <Check className="text-white font-bold size-65" />
                ) : (
                  4
                )}
              </span>
              <h1 className="text-[16px] 2xl:text-[20px]">Validate data</h1>
            </div>
          </div>
          {stepper > 0 &&  <h1 className='my-2 font-semibold text-[16px] 2xl:text-[20px]'>Your table - {knowledgeData.name.replace(".xlsx", "")}</h1>}
          <div className="overflow-auto  max-h-[58vh]">
            {stepper == 0 && (
              <UploadFile
                setKnowledgeData={setKnowledgeData}
                knowledgeData={knowledgeData}
                setStepper={setStepper}
                setProgressBar={setProgressBar}
                setSelectedHeader={setSelectedHeader}
                setSelectedRowIndex={setSelectedRowIndex}
              />
            )}
            {stepper == 1 && <SelectHeaderRow 
            knowledgeData={knowledgeData} 
            setSelectedHeader={setSelectedHeader} 
            setSelectedRowIndex={setSelectedRowIndex}
            selectedRowIndex={selectedRowIndex}
            
            />}
            {stepper == 2 && (
              <MatchColum
                setKnowledgeData={setKnowledgeData}
                knowledgeData={knowledgeData}
                selectedHeader={selectedHeader}
                setUpdateHeader={setUpdateHeader}
                setMappedIndexValue={setMappedIndexValue}
                mappedIndexValue={mappedIndexValue}
                updateHeader={updateHeader}
                
              />
            )}
            {stepper == 3 && <Validate knowledgeData={knowledgeData} questions={updatedData.questions} />}
            {stepper == 4 && <Completed  content="Importing questions and answers"/>}
          </div>
          </div>
     <div>
          {stepper >= 1 && stepper <= 3 && (
            <div
              className={` flex items-end  ${
                stepper == 2 ? "justify-between" : "justify-end"
              } gap-3`}
            >
              {stepper == 2 && (
                <div className="">
                  <div className="flex itemx-center gap-4">
                  <h1 className="font-semibold text-[16px] 2xl:text-[20px]">Select associated products:</h1>
                  <div className="gap-x-6 gap-y-2 flex flex-wrap">
                    {companyProducts.map((item, index) => (
                      <Checkbox
                        key={index}
                        radius="md"
                        size="lg"
                        isSelected={knowledgeData.productIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                        className="2xl:text-[42px]"
                        classNames={{label: "!rounded-[3px] text-[16px] 2xl:text-[20px]"}}
                      >
                        {item.name}
                      </Checkbox>
                    ))}
                  </div>
                  </div>
                  <div className="flex items-center mt-8 mb-2">
                    <h1 className="font-semibold text-[16px] 2xl:text-[20px] w-60"> Select Language: </h1>
                    <Select
                      variant="bordered"
                      className="w-full bg-transparent"
                      size="md"
                      placeholder="Select Language"
                      value={knowledgeData.language}
                      onChange={(e) => handleSelectChange(e.target.value)}
                      defaultSelectedKeys={knowledgeData ? [knowledgeData.language] : []}
                      classNames={{value: "text-[16px] 2xl:text-[20px]"}}
                    >
                      {language.map((option) => (
                        <SelectItem key={option.key} value={option.label} classNames={{title: "text-[16px] 2xl:text-[20px]"}}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              )}

              <div className="mt-5">
                <Button
                  onClick={() => {
                    setStepper(stepper - 1);
                    setProgressBar(progressBar - 27);
                  }}
                  radius="none"
                  size="sm"
                  className="px-3 mx-3 text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-red-200  text-red-500   w-max rounded-[4px] "
                >
                  {stepper === 0 ? "Cancel" : "Back"}
                </Button>
                <Button
                  onClick={() => {
                      if(stepper == 1){
                        gotToMatchColum()
                      }
                     else if(stepper == 2){
                      if (!mappedIndexValue.includes("Question") && !mappedIndexValue.includes("Compliance")) {
                        toast.error("Please select Compliance and Question field");
                      } else if (!mappedIndexValue.includes("Question")) {
                        toast.error("Please select Question field");
                      } else if (!mappedIndexValue.includes("Compliance")) {
                        toast.error("Please select Compliance field");
                      } else {
                        handleUpdateData();
                      }
                      }else if (stepper == 3) {
                        submitData();
                      }
                    
                  }}
                  radius="none"
                  size="sm"
                  className="text-white px-3 text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-btn-primary w-max rounded-[4px]"
                >
                  {stepper == 3 ? "Confirm" : " Next"}
                </Button>
              </div>
            </div>
          )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadQuestions;



