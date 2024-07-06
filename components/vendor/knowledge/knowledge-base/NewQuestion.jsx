import React, { useEffect, useState } from "react";
import { Input, Textarea, Button } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { Select, SelectItem } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import { useRouter } from "next/router";
import { handleResponse } from "../../../../helper";

const NewQuestion = () => {
  const categoryOption = [
    { key: "Overview", label: "Overview" },
    { key: "Access Management", label: "Access Management" },
    {
      key: "Application & Data Security",
      label: "Application & Data Security",
    },
    { key: "Artificial Intelligence", label: "Artificial Intelligence" },
    { key: "Cloud Security", label: "Cloud Security" },
    { key: "Device Management", label: "Device Management" },
    { key: "Disaster Recovery", label: "Disaster Recovery" },
    { key: "ESG", label: "ESG" },
    { key: "Incident Management", label: "Incident Management" },
    { key: "Legal", label: "Legal" },
    { key: "Privacy", label: "Privacy" },
    {
      key: "Risk and Vulnerability Management",
      label: "Risk and Vulnerability Management",
    },
    { key: "Security Governance", label: "Security Governance" },
    { key: "Vendor Management", label: "Vendor Management" },
  ];

  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [companyProducts, setCompanyProducts] = useState([]);
  const [documentData, setDocumentData] = useState([]);
  const [CompanyUserData , setCompanyUserData] = useState([])
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { id } = router.query;
  const [newQuestion, setNewQuestion] = useState({
    coverage: "",
    question: "",
    answer: "",
    productIds: [],
    source: "",
    roadmap: "",
    category: "",
    curator: "",
    language: "",
    documentId: "",
  });

  const language = [
    { key: "French", label: "French" },
    { key: "English", label: "English" },
    { key: "Spanish", label: "Spanish" },
    { key: "German", label: "German" },
  ];

  const handleCheckboxChange = (id) => {
    setNewQuestion((prevData) => {
      const productIds = prevData.productIds.includes(id)
        ? prevData.productIds.filter((productId) => productId !== id)
        : [...prevData.productIds, id];

      return {
        ...prevData,
        productIds,
      };
    });
  };

  const handleData = (e) => {

    const { name, value } = e.target;
    console.log("value +++++++++",value)
    console.log("namemmeeee" , name)
    setNewQuestion((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleDrop = (acceptedFiles) => {
  //   const allowedTypes = [
  //     "text/plain",
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //     "application/msword",
  //     "application/json",
  //     "application/vnd.ms-excel",
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   ];

  //   const file = acceptedFiles[0];
  //   if (file && allowedTypes.includes(file.type)) {
  //     setNewQuestion((prevData) => ({
  //       ...prevData,
  //       document: file,
  //     }));
  //   } else {
  //     toast.error("Invalid file type. Please upload a valid file.");
  //   }
  // };

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
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setCompanyProducts(data?.Products);
          console.log("Products:", data?.Products);
        } else {
          toast.error(data?.error);
          console.error("Error:", data);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getCompanyProducts();
    getUserDocument();
    getCompanyUser()
  }, []);

  useEffect(() => {
    if (id) {
      const token = cookiesData?.token;
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
      };
      fetch(`${baseUrl}/questions/${id}`, requestOptions)
        .then(async (response) => {
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
        })
        .then(({ status, ok, data }) => {
          console.log("========+++++++++",data)
          if (ok) {
            setNewQuestion({
              ...data,
              productIds: data.Products.map((product) => product.id),
            });
            setDataIsLoaded(true);
          } else {
            toast.error(data?.error);
            console.error("Error:", data);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [id]);

  const handleSubmit = () => {
    console.log(newQuestion);
    const token = cookiesData?.token;
    const jsonPayload = JSON.stringify(newQuestion);
    if (id) {
      let requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: jsonPayload,
        redirect: "follow",
      };

      fetch(`${baseUrl}/questions/${id}`, requestOptions)
        .then(async (response) => {
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
        })
        .then(({ status, ok, data }) => {
          if (ok) {
            toast.success("Question updated successfully");
            router.push("/vendor/knowledge");
          } else {
            toast.error(data?.error);
            console.error("Error:", data);
          }
        })
        .catch((error) => console.error(error));
    }else{
      {
       let requestOptions = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: jsonPayload,
          redirect: "follow",
        };
  
        fetch(`${baseUrl}/questions`, requestOptions)
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
              console.log("Success:", data);
              toast.success("Question created successfully");
              router.push("/vendor/knowledge");
            } else {
              toast.error(data?.error || "question not Created");
              console.error("Error:", data);
            }
          })
          .catch((error) => console.error(error));
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles),
  });

  const getUserDocument = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/userdocuments`, requestOptions);
      const data = await handleResponse(response, router, cookies,removeCookie);
      if (response.ok) {

        const referenceOptions = data.map(item => ({
          id: item.id,
          title: item.title
      }));
        setDocumentData(referenceOptions);
        console.log(">>>>>>,",referenceOptions)
      } else {
        toast.error(data?.error);
        
      }
    } catch (error) {
      console.error("Error fetching user documents:", error);
    } 
  };

  const getCompanyUser = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/get-company-users`, requestOptions);
      const data = await handleResponse(response, router, cookies,removeCookie);
      if (response.ok) {
        const curatorOptions = data.map(item => ({
          id: item.id,
          name: item.firstName
      }));
      setCompanyUserData(curatorOptions);
        console.log("user List,",curatorOptions)
      } else {
        toast.error(data?.error);
        
      }
    } catch (error) {
      console.error("Error fetching user documents:", error);
    } 
  };

  return (
    <div className="w-[100%] h-full">
      <div className="w-[80%] mx-auto py-4 mt-[4rem]">
        <div className="px-4 bg-white pb-6">
          <h1 className="py-1 border-b-2 text-[16px] 2xl:text-[20px] font-semibold">
            {`${id ? "Update" : "New"}`} Question
          </h1>
          <div className="flex justify-between">
            <div className=" w-[45%] space-y-4">
              <div className="mt-2 mb-3">
                <label className="text-[16px] 2xl:text-[20px]">Question</label>
                <Textarea
                  variant="bordered"
                  // size="sm"
                  maxRows={5}
                  placeholder="Type the question here"
                  name="question"
                  value={newQuestion.question}
                  onChange={handleData}
                  classNames={{
                    input: "text-base 2xl:text-[18px] h-[150px]",
                  }}
                />
              </div>

              <div>
                <label className="text-[16px] 2xl:text-[20px]">Category</label>
                <Select
                  variant="bordered"
                  className="w-full bg-transparent"
                  size="sm"
                  placeholder="Select"
                  name="category"
                  // value={newQuestion.category}
                  onChange={(e) => handleData(e)}
                  defaultSelectedKeys={newQuestion.category ? [newQuestion.key] : []}
                >
                  {categoryOption?.map((option) => (
                    <SelectItem key={option.key} value={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="my-2">
                <label className="text-[16px] 2xl:text-[20px]">Coverage</label>
                <Input
                  type="text"
                  variant="bordered"
                  placeholder=""
                  size="sm"
                  name="coverage"
                  value={newQuestion.coverage}
                  onChange={handleData}
                  classNames={{
                    input: "text-base 2xl:text-[18px]",
                  }}
                />
              </div>

              <div className="">
                <label className="text-[16px] 2xl:text-[20px]">Answer</label>
                <Textarea
                  variant="bordered"
                  size="sm"
                  placeholder="Type the answer here"
                  name="answer"
                  value={newQuestion.answer}
                  onChange={handleData}
                  classNames={{
                    input: "text-base 2xl:text-[18px]",
                  }}
                />
              </div>

              <div>
                <label className="text-[16px] 2xl:text-[20px]">
                  Associated Products
                </label>

                <div className="gap-x-6 gap-y-2 flex flex-wrap my-1 ">
                  {companyProducts?.map((item, index) => (
                    <Checkbox
                      key={index}
                      isSelected={newQuestion.productIds.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                      className="2xl:text-[20px]"
                      radius="none"
                      classNames={{ wrapper: "!rounded-[3px]" }}
                    >
                      {item.name}
                    </Checkbox>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-[45%] space-y-3">
              <div className="my-2">
                <label className="text-[16px] 2xl:text-[20px]">Roadmap</label>
                <Input
                  type="text"
                  variant="bordered"
                  placeholder="If it is in your roadmap, provide details, e.g. “Q2 2025”"
                  size="sm"
                  name="roadmap"
                  value={newQuestion.roadmap}
                  onChange={handleData}
                  classNames={{
                    input: "text-base 2xl:text-[18px]",
                  }}
                />
              </div>
              <div className="">
                <label className="text-[16px] 2xl:text-[20px]">Source</label>
                <Input
                  type="text"
                  variant="bordered"
                  size="sm"
                  name="source"
                  value={newQuestion.source}
                  onChange={handleData}
                  classNames={{
                    input: "text-base 2xl:text-[18px]",
                  }}
                />
              </div>
              <div>
                <label className="text-[16px] 2xl:text-[20px]">Curator</label>
                <Select
                  variant="bordered"
                  className="w-full bg-transparent"
                  size="sm"
                  placeholder="Select"
                  name="curator"
                  value={newQuestion.curator}
                  onChange={(e) => handleData(e)}
                >
                  {CompanyUserData?.map((option) => (
                    <SelectItem key={option.name} value={option.name}>
                      {option.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-[16px] 2xl:text-[20px]">Reference</label>
                <Select
                  variant="bordered"
                  className="w-full bg-transparent"
                  size="sm"
                  placeholder="Reference"
                  name="documentId"
                  value={newQuestion.documentId}
                  onChange={(e) => handleData(e)}
                >
                  {documentData?.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.title}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-[16px] 2xl:text-[20px]">Language</label>
                <Select
                  variant="bordered"
                  className="w-full bg-transparent"
                  size="sm"
                  placeholder="language"
                  name="language"
                  value={newQuestion.language}
                  onChange={(e) => handleData(e)}
                >
                  {language?.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-3">
            <Button
              size="sm"
              className="rounded-md 2xl:text-[20px] bg-red-200 py-0 text-red-500 text-[13px] font-semibold"
              onClick={()=>router.push("/vendor/knowledge")}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              color="primary"
              className="rounded-md 2xl:text-[20px] text-[13px] font-semibold"
              onClick={handleSubmit}
            >
              {`${id ? "Update" : "Add"}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewQuestion;
