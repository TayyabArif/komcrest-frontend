import React, { useState, useEffect, useRef } from "react";
import { Progress, Button, Checkbox, Select, SelectItem } from "@nextui-org/react";
import { Check } from "lucide-react";
import AddUrls from "./AddUrls";
import IndexContent from "./IndexContent";
import ReviewContent from "./ReviewContent";
import ValidateData from "./ValidateData";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../../helper/index";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const AddResource = () => {
  const [stepper, setStepper] = useState(0);
  const [progressBar, setProgressBar] = useState(13);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [companyProducts, setCompanyProducts] = useState([]);
  const [knowledgeData, setKnowledgeData] = useState({
    productIds: [],
    language: "",
  });
  const [formData, setFormData] = useState({
    links: [{ url: "", title: "" }],
  });

  const formRef = useRef(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

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

  const getCompanyProducts = async () => {
    const token = cookiesData?.token;
    const companyId = cookiesData?.companyId;

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };
    fetch(`${baseUrl}/companies/${companyId}`, requestOptions)
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
          setCompanyProducts(data?.Products);
        } else {
          toast.error(data?.error);
          console.error("Error:", data);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getCompanyProducts();
  }, []);

  const handleNextClick = () => {
    if (stepper === 0) {
      formRef.current.requestSubmit(); // Trigger form submission
    }
    if (stepper < 3) {
      setStepper(stepper + 1);
      setProgressBar(progressBar + 27);
    }
  };

  const handleCancelClick = () => {
    if (stepper > 0) {
      setStepper(stepper - 1);
      setProgressBar(progressBar - 27);
    }
  };

  const handleFormSubmit = (data) => {
    setFormData(data);
    console.log("Form Data: ", data);
  };

  const handleCheckboxChange = (id) => {
    setKnowledgeData((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter((pid) => pid !== id)
        : [...prev.productIds, id],
    }));
  };

  const handleSelectChange = (value) => {
    setKnowledgeData((prev) => ({ ...prev, language: value }));
  };

  return (
    <div className="w-[100%] h-full">
      <div className="w-[90%] mx-auto py-4 mt-[2rem]">
        <h1 className="font-semibold bg-slate-50 px-6 py-1 2xl:text-[20px]">
          {getTitle()}
        </h1>
        <div className="w-full h-[83vh] bg-white p-6">
          <Progress aria-label="Loading..." value={progressBar} className="h-[8px]" />

          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="my-3 flex gap-2">
                {["Add URLs", "Index content", "Review content", "Validate data"].map((title, index) => (
                  <div key={index} className="flex gap-3 items-center flex-1 border py-1 px-2 rounded">
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
                    <h1 className={`text-[16px] 2xl:text-[20px] ${stepper === index ? "text-blue-600" : ""}`}>
                      {title}
                    </h1>
                  </div>
                ))}
              </div>
              <div className="overflow-auto max-h-[58vh]">
                {stepper === 0 && <AddUrls ref={formRef} onSubmit={handleFormSubmit} formData={formData} />}
                {stepper === 1 && <IndexContent formData={formData}/>}
                {stepper === 2 && <ReviewContent formData={formData}/>}
                {stepper === 3 && <ValidateData />}
              </div>
            </div>
            <div>
              {stepper >= 0 && stepper <= 3 && (
                <div className={`flex items-end ${stepper === 2 ? "justify-between" : "justify-end"} gap-3`}>
                  {stepper === 2 && (
                    <div className="space-y-2">
                       <div className=" mt-8 mb-2">
                        <h1 className="font-semibold text-[16px] 2xl:text-[20px] w-60">
                          Select Language:
                        </h1>
                        <Select
                          variant="bordered"
                          className="w-1/2 bg-transparent"
                          size="md"
                          placeholder="Select Language"
                          value={knowledgeData.language}
                          onChange={(e) => handleSelectChange(e.target.value)}
                          defaultSelectedKeys={knowledgeData ? [knowledgeData.language] : []}
                          classNames={{ value: "text-[16px] 2xl:text-[20px]" }}
                        >
                          {languageOptions.map((option) => (
                            <SelectItem
                              key={option.key}
                              value={option.label}
                              classNames={{ title: "text-[16px] 2xl:text-[20px]" }}
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
                              isSelected={knowledgeData.productIds.includes(item.id)}
                              onChange={() => handleCheckboxChange(item.id)}
                              className="2xl:text-[42px]"
                              classNames={{ label: "!rounded-[3px] text-[16px] 2xl:text-[20px]" }}
                            >
                              {item.name}
                            </Checkbox>
                          ))}
                        </div>
                      </div>
                     
                    </div>
                  )}
                  <div className="mt-5">
                    <Button
                      onClick={handleCancelClick}
                      radius="none"
                      size="sm"
                      className="px-3 mx-3 text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-gray-200 w-max rounded-[4px]"
                    >
                      Cancel
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
