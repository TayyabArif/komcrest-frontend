import React, { useState, useEffect, useRef } from "react";
import {
  Progress,
  Button,
  Checkbox,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Check } from "lucide-react";
import AddUrls from "./AddUrls";
import IndexContent from "./IndexContent";
import ReviewContent from "./ReviewContent";
import ValidateData from "./ValidateData";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../../helper/index";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Completed from "../../shared/Completed";
import { urlPattern } from "../../../../helper/index";
import useSocket from "@/customHook/useSocket";
import { useMyContext } from "@/context";

const AddResource = () => {
  const [stepper, setStepper] = useState(0);
  const [progressBar, setProgressBar] = useState(13);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const token = cookiesData?.token;
  const companyId = cookiesData?.companyId;
  const [allResources, setAllResources] = useState([{ url: "", title: "" , status:"pending"}]);
  const [errors, setErrors] = useState([]);
  const {companyProducts } = useMyContext();
  const [resourceData, setResourceData] = useState({
    language: "",
    productIds: [],
    resources: [],
  });


  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const socket = useSocket(baseUrl);

  const languageOptions = [
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
        return "Validate your data so that it can be properly indexed for our Komcrest AI";
      default:
        return "";
    }
  } 

  useEffect(() => {
      setResourceData((prev) => ({
        ...prev,
        language : "English",
        productIds: companyProducts.length === 1 ?  [companyProducts[0].id] : prev.productIds, 
      }));
  
  }, [companyProducts]);

  

  const handleNextClick = () => {
    if (stepper === 0) {
      const newUrlData = allResources.slice(0, allResources.length - 1);
      setResourceData({
        ...resourceData, 
        resources : []
      })
      if (newUrlData.length > 0) {
        handleUrlSubmit(newUrlData);
      }else{
        toast.error("URL must be added to go to the next step")
      }
    } else if (stepper === 1 ) {
      setStepper(stepper + 1);
      setProgressBar(progressBar + 27);
    } else if (stepper === 2) {
      if( resourceData.language !== "" && resourceData.productIds.length > 0){
        setStepper(stepper + 1);
        setProgressBar(progressBar + 27);
      }else{
      toast.error("Language or Products are missing")
      }
     
    }else if (stepper === 3) {
      updateRecords();
    }
  };

  const handleCancelClick = () => {
    if (stepper > 0) {
      setStepper(stepper - 1);
      setProgressBar(progressBar - 27);
    }else{
      router.push("/vendor/onlineResource")
    }
  };

 
  const handleUrlSubmit = (newUrlData) => {
    // setResourceData({
    //   ...resourceData,
    //   resources : newUrlData
    // })

    // debugger
    const jsonPayload = JSON.stringify(newUrlData);
    setStepper(stepper + 1);
    setProgressBar(progressBar + 27);

    let requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: jsonPayload,
      redirect: "follow",
    };

    fetch(`${baseUrl}/resources`, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        return {
          status: response.status,
          ok: response.ok,
          data,
        };
      })
      .then(({ status, ok, data }) => {
        if (ok) {
          data.forEach((item) => {
            item.indexing = "Manual";
          });
          setResourceData((prevState) => ({
            ...prevState,
            resources: data,
          }));
        } else {
          console.error("Error:", data);
        }
      })
      .catch((error) => console.error(error));
  };

  const updateRecords = async () => {
    try {
      setStepper(stepper + 1);
      setProgressBar(progressBar + 27);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const updatePromises = resourceData.resources?.map((record) => {
        const formData = new FormData();

        // Add record data
        formData.append("id", record.id);
        formData.append("url", record.url);
        formData.append("title", record.title);
        formData.append("status", record.status);
        formData.append("error", record.error);
        formData.append("indexing", record.indexing);

        // Add additional data
        formData.append("language", resourceData.language);
        resourceData.productIds.forEach((id) => {
          formData.append("productIds[]", id);
        });

        // Add file if exists
        if (record.file) {
          formData.append("file", record.file);
        }

        const requestOptions = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          redirect: "follow",
        };

        return fetch(`${baseUrl}/resources`, requestOptions).then(
          async (response) => {
            const data = await handleResponse(
              response,
              router,
              cookies,
              removeCookie
            );
            return {
              status: response.status,
              ok: response.ok,
              data,
            };
          }
        );
      });

      const results = await Promise.all(updatePromises);

      results.forEach(({ status, ok, data }) => {
        if (ok) {
          // Handle successful update
        } else {
          toast.error(data?.error);
          console.error("Error:", data);
        }
      });

      router.push("/vendor/onlineResource");
    } catch (error) {
      console.error("Error updating records:", error);
    }
  };

  const handleCheckboxChange = (id) => {
    setResourceData((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter((pid) => pid !== id)
        : [...prev.productIds, id],
    }));
  };

  const handleSelectChange = (property, value, index) => {
    if (property == "language") {
      setResourceData((prevData) => ({
        ...prevData,
        language: value,
      }));
    } else if (property == "indexing") {
      setResourceData((prevData) => ({
        ...prevData,
        resources: prevData.resources.map((item, idx) =>
          idx === index ? { ...item, [property]: value } : item
        ),
      }));
    }
  };

  return (
    <div className="w-[100%] h-full">
      <div className="w-[90%] mx-auto py-3 mt-[1rem]">
        <h1 className="font-semibold bg-slate-50 px-6 py-2 2xl:text-[20px]">
          {getTitle()}
        </h1>
        <div className="w-full h-[80vh] bg-white p-6">
          <Progress
            aria-label="Loading..."
            value={progressBar}
            className="h-[8px]"
          />

          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="my-3 flex gap-2">
                {[
                  "Add URLs",
                  "Index content",
                  "Review content",
                  "Validate data",
                ].map((title, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-center flex-1 border py-1 px-2 rounded"
                  >
                    <span
                      className={`${
                        stepper >= index + 1 ? "bg-blue-600" : "border-blue-600"
                      } border-blue-600 flex items-center justify-center rounded-full w-[25px] h-[25px] text-center border-2`}
                    >
                      {stepper >= index + 1 ? (
                        <Check className="text-white font-bold size-65" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <h1
                      className={`text-[16px] 2xl:text-[20px] ${
                        stepper === index ? "text-blue-600" : ""
                      }`}
                    >
                      {title}
                    </h1>
                  </div>
                ))}
              </div>
              <div className="overflow-auto max-h-[58vh]">
                {stepper === 0 && (
                  <AddUrls
                    setAllResources={setAllResources}
                    allResources={allResources}
                    errors={errors}
                    setResourceData={setResourceData}
                  />
                )}
                {stepper === 1 && <IndexContent resourceData={resourceData}  setResourceData={setResourceData}/>}
                {stepper === 2 && (
                  <ReviewContent
                    resourceData={resourceData}
                    setResourceData={setResourceData}
                    handleSelectChange={handleSelectChange}
                  />
                )}
                {stepper === 3 && (
                  <ValidateData
                    resourceData={resourceData}
                    companyProducts={companyProducts}
                  />
                )}
                {stepper === 4 && <Completed  content="Importing online resources"/>}
              </div>
            </div>
            <div>
              {stepper >= 0 && stepper <= 3 && (
                <div
                  className={`flex items-end ${
                    stepper === 2 ? "justify-between" : "justify-end"
                  } gap-3`}
                >
                  {stepper === 2 && (
                    <div className="space-y-2">
                      <div className=" mt-8 mb-2">
                        <h1 className="font-semibold text-[16px] 2xl:text-[20px] ">
                          Select Language:
                        </h1>
                        <Select
                          variant="bordered"
                          className="min-w-[80px] bg-transparent"
                          size="md"
                          placeholder="Select Language"
                          value={resourceData.language}
                          onChange={(e) =>
                            handleSelectChange("language", e.target.value)
                          }
                          defaultSelectedKeys={
                            resourceData.language ? [resourceData.language] : []
                          }
                          classNames={{ value: "text-[16px] 2xl:text-[20px]" }}
                        >
                          {languageOptions.map((option) => (
                            <SelectItem
                              key={option.key}
                              value={option.label}
                              classNames={{
                                title: "text-[16px] 2xl:text-[17px]",
                              }}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="flex itemx-center gap-4">
                        <h1 className="font-semibold text-[16px] 2xl:text-[20px]">
                          Select associated products:
                        </h1>
                        <div className="gap-x-6 gap-y-2 flex flex-wrap">
                          {companyProducts.map((item, index) => (
                            <Checkbox
                              key={index}
                              radius="md"
                              size="lg"
                              isSelected={resourceData.productIds.includes(
                                item.id
                              )}
                              onChange={() => handleCheckboxChange(item.id)}
                              className="2xl:text-[42px]"
                              classNames={{
                                label:
                                  "!rounded-[3px] text-[16px] 2xl:text-[20px]",
                              }}
                            >
                              {item.name}
                            </Checkbox>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-3">
                    <Button
                      onClick={handleCancelClick}
                      radius="none"
                      size="sm"
                      className="px-3 mx-3 text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-red-200 py-0 text-red-500  w-max rounded-[4px]"
                    >
                      {stepper === 0 ? "Cancel" : "Back"}
                    </Button>
                    <Button
                      onClick={handleNextClick}
                      radius="none"
                      size="sm"
                      className="text-white px-3 text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-btn-primary w-max rounded-[4px]"
                    >
                      {stepper === 3 ? "Confirm" : "Next"}
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
