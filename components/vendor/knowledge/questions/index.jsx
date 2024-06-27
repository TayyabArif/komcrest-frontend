import React,{useState , useEffect} from "react";
import { Progress } from "@nextui-org/react";
import UploadFile from "./UploadFile"
import SelectHeaderRow from './SelectHeaderRow';
import { Check } from 'lucide-react';
import MatchColum from "./MatchColum"
import {Button ,Checkbox } from "@nextui-org/react";
import Validate from "./validate" 
import Completed from "./Completed"
import { useCookies } from "react-cookie";

const UploadQuestions = () => {
  debugger
  const [excelData, setExcelData] = useState(null);
  const [stepper , setStepper] = useState(0)
  const [progressBar ,setProgressBar] = useState(13)
  const [cookies, setCookie, removeCookie] = useCookies(['myCookie']); 
  const cookiesData = cookies.myCookie;
  const [companyProducts, setCompanyProducts] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  function getTitle(){
    switch (stepper){
      case 0:
      return "Upload requirements, questions and answers"
      case 1:
      return "Select header row so we can match them afterwards with our columns"
      case 2:
      return "Match your columns with ours so we can index your content properly"
      case 3:
      case 4:
      return " Validate your data so that it can be properly indexed for our Komcrest AI"
    }
   
  }

  const getCompanyProducts = async () => {
    const token = cookiesData?.token;
    const companyId = cookiesData?.companyId;
    debugger
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };
    fetch(`${baseUrl}/companies/${companyId}`, requestOptions)
      .then((response) => {
        return response.json().then((data) => ({
          status: response.status,
          ok: response.ok,
          data,
        }));
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

  useEffect(()=>{
    getCompanyProducts()
  },[])
  
  return (
    <div className="w-[100%] h-full">
      <div className="w-[90%] mx-auto py-4 mt-[2rem]">
        <h1 className="font-semibold bg-slate-50 px-6 py-1 2xl:text-[20px]">
       {getTitle()}
        </h1>
        <div className="w-full h-[80vh] bg-white p-6 ">
          <Progress aria-label="Loading..." value={progressBar} className="h-[8px]" />
          <div className="my-3 flex gap-2">
          
              <div className="flex gap-3 items-center flex-1 border py-2 px-2 rounded">
                <span className={`${stepper == 1 || stepper > 1 ? "bg-blue-600  " : "border-blue-600"} border-blue-600 flex items-center justify-center rounded-full  w-[25px] h-[25px] text-center border-2 `}>
                { stepper == 1 || stepper > 1 ? <Check className="text-white font-bold size-65"/> : 1} 
                </span>
                <h1 className={`${stepper ==! 1 ? "text-blue-600" : ""} font-semibold`}>Uplaod File</h1>
            </div>

            <div className="flex gap-3 items-center flex-1 border py-1 px-2 rounded">
                <span className={`${stepper == 2 || stepper > 2 ? "bg-blue-600" : "border-blue-600"} border-blue-600 flex items-center justify-center rounded-full  w-[25px] h-[25px] text-center border-2`}>
                { stepper == 2 || stepper > 2 ? <Check className="text-white font-bold size-65"/> : 2} 
                </span>
                <h1>Select header row</h1>
            </div>

            <div className="flex gap-3 items-center flex-1 border py-1 px-2 rounded">
            <span className={`${stepper == 3 || stepper > 3 ? "bg-blue-600" : ""} border-blue-600 flex items-center justify-center rounded-full  w-[25px] h-[25px] text-center border-2 `}>
            { stepper == 3 || stepper > 3 ? <Check className="text-white font-bold size-65"/> : 3} 
                </span>
                <h1>Match Columns</h1>
            </div>

            <div className="flex gap-3 items-center flex-1 border py-1 px-2 rounded">
            <span className={`${stepper == 4 || stepper > 4 ? "bg-blue-600" : ""} border-blue-600 flex items-center justify-center rounded-full  w-[25px] h-[25px] text-center border-2 `}>
            { stepper == 4 || stepper > 4 ? <Check className="text-white font-bold size-65"/> : 4} 
                </span>
                <h1>Validate data</h1>
            </div>
          </div>
          <div className="overflow-scroll h-[59vh]">
           {stepper == 0 && <UploadFile setExcelData={setExcelData} setStepper={setStepper} setProgressBar={setProgressBar}/>}
           {stepper == 1 && <SelectHeaderRow excelData={excelData}/>}
           {stepper == 2 && <MatchColum excelData={excelData} setExcelData={setExcelData}/>}
           {stepper == 3 && <Validate excelData={excelData}/>}
           {stepper == 4 && <Completed />}
           </div>


         {
          stepper >= 1 && stepper <= 3   && (
            <div className={` flex items-center ${stepper == 2 ?  "justify-between" : "justify-end" } gap-3` }>
              {stepper == 2   && (
                 <div> 
              <h1 className='font-semibold'>Select associated products</h1>
               <div className="gap-x-6 gap-y-2 flex flex-wrap my-1 ">
           {companyProducts.map((item, index) => (
        <Checkbox
          key={index}
          radius="sm"
          // isSelected={documentData.productIds.includes(item.id)}
          // onChange={() => handleCheckboxChange(item.id)}
          className="2xl:text-[20px]"
        >
          {item.name}
        </Checkbox>
      ))}
    </div>
</div>
              )}
             
              <div>
                    <Button onClick={()=>{
                      setStepper(stepper - 1)
                      setProgressBar(progressBar - 27)
                      
                      } }radius="none" size="sm" className=" px-[10px] mx-3 text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-gray-100 w-max rounded-[4px] ">
                        Back
                    </Button>
                     <Button onClick={()=>{
                      if(stepper < 4 ){
                        setStepper(stepper + 1)
                        setProgressBar(progressBar + 27)
                      }
                     }} radius="none" size="sm" className="text-white px-[10px] text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-btn-primary w-max rounded-[4px]">
                       {stepper == 3 ? "Confirm" : " Next"}
                    </Button>
                    </div>
           </div>
          )
         }
        </div>
      </div>
    </div>
  );
};

export default UploadQuestions;
