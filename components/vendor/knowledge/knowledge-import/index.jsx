import React, { useState, useEffect } from "react";
import { Progress } from "@nextui-org/react";
import UploadFile from "./UploadFile";
import SelectHeaderRow from "./SelectHeaderRow";
import { Check, language } from "lucide-react";
import MatchColum from "./MatchColum";
import { Button, Checkbox, Select, SelectItem } from "@nextui-org/react";
import Validate from "./Validate";
import Completed from "./Completed";
import { useCookies } from "react-cookie";
import {handleResponse}  from "../../../../helper/index"
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const UploadQuestions = () => {
  const [stepper, setStepper] = useState(0);
  const [progressBar, setProgressBar] = useState(13);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [companyProducts, setCompanyProducts] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter()
  const [selectedHeader , setSelectedHeader] = useState([])
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [updateHeader , setUpdateHeader] = useState([]) 
  const [mappedIndexValue , setMappedIndexValue] = useState([])



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

  const getCompanyProducts = async () => {
    const token = cookiesData?.token;
    const companyId = cookiesData?.companyId;
    // debugger
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };
    fetch(`${baseUrl}/companies/${companyId}`, requestOptions)
      .then( async (response) => {
        const data = await handleResponse(response, router, cookies, removeCookie);
        return {
          status: response.status,
          ok: response.ok,
          data,
        };
      })
      .then(({ status, ok, data }) => {
        if (ok) {
          setCompanyProducts(data?.Products);
          console.log(">>>>>>>", data?.Products);
        } else {
          toast.error(data?.error);
          console.error("Error:", data);
        }
      })
      .catch((error) => console.error(error));
  };

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

  useEffect(() => {
    getCompanyProducts();
  }, []);


  const handleUpdateData = () => { 
    // const [headers, ...rows] = knowledgeData.questions;
    const rows = knowledgeData.questions.slice(1);
    const transformedData = rows.map((row) => {
      return mappedIndexValue.reduce((acc, header, index) => {
        if (header) {
          acc[header.toLowerCase()] = row[index] ? row[index].trim() : "";
        }
        return acc;
      }, {});
    });
  
   
  // Remove "do no map" key
    let updatedData =  transformedData.map(question => {
      const { "do no map": _, ...rest } = question; 
      return rest;
    });
  console.log(">>>>>>>>>>>>>>",updatedData)


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
    debugger
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
 

  const jsonPayload = JSON.stringify(updatedData);

  // API call
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
        toast.success("Document created successfully");
        router.push("/vendor/knowledge")
      } else {
        toast.error(data?.error || "Document not Created");
        console.error("Error:", data);
      }
    })
    .catch((error) => console.error(error));
};

   

  return (
    <div className="w-[100%] h-full">
      <div className="w-[90%] mx-auto py-4 mt-[2rem]">
        <h1 className="font-semibold bg-slate-50 px-6 py-1 2xl:text-[20px]">
          {getTitle()}
        </h1>
        <div className="w-full h-[83vh] bg-white p-6 ">
          <Progress
            aria-label="Loading..."
            value={progressBar}
            className="h-[8px]"
          />
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
                } font-semibold text-[18px] 2xl:text-[20px]`}
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
              <h1 className="text-[18px] 2xl:text-[20px]">Select header row</h1>
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
              <h1 className="text-[18px] 2xl:text-[20px]">Match Columns</h1>
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
              <h1 className="text-[18px] 2xl:text-[20px]">Validate data</h1>
            </div>
          </div>
          {stepper > 0 &&  <h1 className='my-2 font-semibold text-[18px] 2xl:text-[20px]'>Your table - {knowledgeData.name.replace(".xlsx", "")}</h1>}
        
          <div className="overflow-scroll max-h-[58vh] min-h-[45vh]">
            {stepper == 0 && (
              <UploadFile
                setKnowledgeData={setKnowledgeData}
                knowledgeData={knowledgeData}
                setStepper={setStepper}
                setProgressBar={setProgressBar}
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
            {stepper == 4 && <Completed />}
          </div>

          {stepper >= 1 && stepper <= 3 && (
            <div
              className={` flex items-end ${
                stepper == 2 ? "justify-between" : "justify-end"
              } gap-3`}
            >
              {stepper == 2 && (
                <div>
                  <h1 className="font-semibold text-[18px] 2xl:text-[20px] mt-3">Select associated products</h1>
                  <div className="gap-x-6 gap-y-2 flex flex-wrap my-2">
                    {companyProducts.map((item, index) => (
                      <Checkbox
                        key={index}
                        radius="sm"
                        isSelected={knowledgeData.productIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                        className="2xl:text-[42px]"
                        classNames={{label: "!rounded-[3px] text-[18px] 2xl:text-[20px]"}}
                      >
                        {item.name}
                      </Checkbox>
                    ))}
                  </div>
                  <div>
                    <h1 className="font-semibold text-[18px] 2xl:text-[20px] mb-2"> Select Language</h1>
                    <Select
                      variant="bordered"
                      className="w-full bg-transparent"
                      size="sm"
                      placeholder="Select Language"
                      value={knowledgeData.language}
                      onChange={(e) => handleSelectChange(e.target.value)}
                      defaultSelectedKeys={knowledgeData ? [knowledgeData.language] : []}
                    >
                      {language.map((option) => (
                        <SelectItem key={option.key} value={option.label}>
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
                  className="px-3 mx-3 text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-gray-200 w-max rounded-[4px] "
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                        
                      if(stepper == 1){
                        gotToMatchColum()
                      }
                     else if(stepper == 2){
                         handleUpdateData()
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
  );
};

export default UploadQuestions;



