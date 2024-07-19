import React, { useState, useEffect } from "react";
import { Progress } from "@nextui-org/react";
import { Check, language } from "lucide-react";
import AddUrls from "./AddUrls";
import IndexContent from "./IndexContent";
import ReviewContent from "./ReviewContent";
import ValidateData from "./ValidateData";

import { Button, Checkbox, Select, SelectItem } from "@nextui-org/react";
import { useCookies } from "react-cookie";
import {handleResponse}  from "../../../../helper/index"
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const AddResource = () => {
  const [stepper, setStepper] = useState(0);
  const [progressBar, setProgressBar] = useState(13);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [companyProducts, setCompanyProducts] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter()
 

  const language = [
    { key: "French", label: "French" },
    { key: "English", label: "English" },
    { key: "Spanish", label: "Spanish" },
    { key: "German", label: "German" },
  ];

  function getTitle() {
    switch (stepper) {
      case 0:
        return "List URLs you want to index";
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
                Add URLs

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
              <h1 className="text-[16px] 2xl:text-[20px]">Index content</h1>
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
              <h1 className="text-[16px] 2xl:text-[20px]">Review content</h1>
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
          <div className="overflow-auto  max-h-[58vh]">
            {stepper == 0 && (
              <AddUrls
               
              />
            )}
            {stepper == 1 && <IndexContent 
            
            />}
            {stepper == 2 && (
              <ReviewContent
        
                
              />
            )}
            {stepper == 3 && <ValidateData />}
            
          </div>
          </div>
     <div>
          {stepper >= 0 && stepper <= 3 && (
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
                  className="px-3 mx-3 text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-gray-200 w-max rounded-[4px] "
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                        
                    //   if(stepper == 0){
                    //     gotToMatchColum()
                    //   }
                    //  else if(stepper == 2){
                    //      handleUpdateData()
                    //   }else if (stepper == 3) {
                    //     submitData();
                    //   }
                    
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

export default AddResource;



