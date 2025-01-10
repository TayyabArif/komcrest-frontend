import React, { useEffect, useState } from "react";
import { Input, Textarea, Button } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { Select, SelectItem } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import { useRouter } from "next/router";
import { handleResponse } from "../../../../helper";
import { Tooltip } from "@nextui-org/tooltip";
import { useMyContext } from "@/context";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-light-cyan/theme.css";

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
  const [company, setCompany] = useState("");
  const cookiesData = cookies.myCookie;
  const { companyUserData, documentData, companyProducts, onlineResourceData } =
    useMyContext();
  const [documentAndOnlineResourceData, setDocumentAndOnlineResourceData] =
    useState([]);

  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");
    if (parts.length >= 2) {
      setCompany(parts[0]);
    }
  }, []);

  // const [companyProducts, setCompanyProducts] = useState([]);
  // const [documentData, setDocumentData] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataLoaded, setDataIsLoaded] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const token = cookiesData?.token;
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [selectedReference, setSelectedReference] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    coverage: "",
    question: "",
    answer: "",
    productIds: [],
    roadmap: "",
    komcrestCategory: "",
    curator: "",
    language: "",
    documentIds: [],
    onlineResourceIds: [],
  });

  const language = [
    { key: "French", label: "French" },
    { key: "English", label: "English" },
    { key: "Spanish", label: "Spanish" },
    { key: "German", label: "German" },
  ];

  useEffect(() => {
    if (!id) {
      setNewQuestion((prev) => ({
        ...prev,
        language: "English",
        productIds: companyProducts && companyProducts.map((item)=> item.id)
      }));
    }
  }, [companyProducts]);

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
    setNewQuestion((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setDataIsLoaded(true);
    if (id) {
      setDataIsLoaded(false);
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
          if (ok) {
            console.log("API Response Data:", data);

            setNewQuestion(() => ({
              coverage: data.coverage,
              question: data.question,
              answer: data.answer,
              roadmap: data.roadmap,
              komcrestCategory: data.komcrestCategory,
              curator: data.curator,
              language: data.language,
              productIds: data.Products?.map((product) => product.id),
            }));

            const result = [
              {
                label: "Document",
                code: "Document",
                items: data.documents.map(doc => ({ id: doc.id, title: doc.title }))
              },
              {
                label: "Online Resource",
                code: "OnlineResource",
                items: data.onlineResources.map(resource => ({ id: resource.id, title: resource.title }))
              }
            ];
            setSelectedReference(result)
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
    const payload = {
      ...newQuestion,
      documentIds: selectedReference
        .find(item => item.code === "Document")
        ?.items?.map(doc => doc.id) ?? [],
    
      onlineResourceIds: selectedReference
        .find(item => item.code === "OnlineResource")
        ?.items?.map(resource => resource.id) ?? []
    };
    
    const jsonPayload = JSON.stringify(payload);

    if (id) {
      let requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
    } else {
      {
        let requestOptions = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: jsonPayload,
          redirect: "follow",
        };

        fetch(`${baseUrl}/questions`, requestOptions)
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

  const generateAIAnswer = async () => {
    if (newQuestion.question) {
      setIsAiGenerating(true);
      let jsonPayload = JSON.stringify({
        question: newQuestion.question,
        coverage: newQuestion.coverage,
        answer: newQuestion.answer,
        komcrestCategory: newQuestion.komcrestCategory,
        company: company,
      });
      let requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: jsonPayload,
        redirect: "follow",
      };

      await fetch(`${baseUrl}/questions/generate-answer`, requestOptions)
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
            console.log("Success:", data);
            setNewQuestion({
              ...newQuestion,
              answer: data,
            });
          } else {
            toast.error(data?.error || "question not Created");
            console.error("Error:", data);
          }
          setIsAiGenerating(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Answer not Created");
          setIsAiGenerating(false);
        });
    } else {
      toast.error(
        "An existing question is require to get your answer improved"
      );
    }
  };

  useEffect(() => {
    const groupedResources = [
      {
        label: "Document",
        code: "Document",
        items: documentData.map((doc) => ({
          id: doc.id,
          title: doc.title,
        })),
      },
      {
        label: "Online Resource",
        code: "OnlineResource",
        items: onlineResourceData.filter(item => item.file && item.file !== null).map((resource) => ({
          id: resource.id,
          title: resource.title,
        })),
      },
    ];
    setDocumentAndOnlineResourceData(groupedResources);
  }, [onlineResourceData, documentData]);


  const groupedItemTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  const handleSelectionChange = (e) => {
    const selectedValues = e.value;

    // Group selections based on `documentAndOnlineResourceData`
    const groupedSelections = documentAndOnlineResourceData
      .map((group) => {
        return {
          label: group.label,
          code: group.code,
          items: group.items.filter((item) =>
            selectedValues.some((selected) => selected.id === item.id)
          ),
        };
      })
      .filter((group) => group.items.length > 0);

    setSelectedReference(groupedSelections);
  };

  return (
    <div className="w-[100%] h-full">
      {dataLoaded && (
        <div className="w-[85%] mx-auto py-4 mt-[2rem]">
          <div className="px-4 bg-white pb-6 rounded">
            <h1 className="py-2 border-b-2 text-standard font-bold">
              {`${id ? "Update" : "New"}`} Question
            </h1>
            <div className="flex justify-between">
              <div className=" w-[45%] space-y-3">
                <div className="mt-2 mb-3">
                  <label className="text-standard">
                    Question
                  </label>
                  <Textarea
                    variant="bordered"
                    // size="sm"
                    maxRows={6}
                    placeholder="Type the question here"
                    name="question"
                    value={newQuestion.question}
                    onChange={handleData}
                    radius="sm"
                    classNames={{
                      input:
                        "text-standard h-[150px] ",
                    }}
                  />
                </div>
                <div>
                  <label className="text-standard">
                    Komcrest Domain
                  </label>
                  <Select
                    variant="bordered"
                    className="w-full bg-transparent text-[20px] "
                    size="md"
                    radius="sm"
                    placeholder="Select"
                    name="komcrestCategory"
                    value={newQuestion.komcrestCategory}
                    onChange={(e) => handleData(e)}
                    defaultSelectedKeys={
                      newQuestion.komcrestCategory
                        ? [newQuestion.komcrestCategory]
                        : []
                    }
                    classNames={{ value: "text-standard" }}
                  >
                    {categoryOption?.map((option) => (
                      <SelectItem
                        key={option.key}
                        value={option.label}
                        classNames={{ title: "text-standard" }}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="my-2">
                  <label className="text-standard">
                    Compliance
                  </label>
                  <Input
                    type="text"
                    variant="bordered"
                    placeholder=""
                    size="md"
                    radius="sm"
                    name="coverage"
                    value={newQuestion.coverage}
                    onChange={handleData}
                    classNames={{
                      input: "text-standard",
                    }}
                  />
                </div>

                <div className="">
                  <div className="flex justify-between items-end">
                    <label className="text-standard">
                      Answer
                    </label>

                    {/* <Tooltip className="bg-gray-100 w-[150px] " content="Question, Answer, Komcrest Domain, Compliance, is required"> */}
                    <div>
                      <Button
                        onClick={generateAIAnswer}
                        size="sm"
                        color="primary"
                        // isDisabled={
                        //   !newQuestion.question ||
                        //   !newQuestion.coverage ||
                        //   !newQuestion.answer ||
                        //   !newQuestion.komcrestCategory
                        // }
                        className="rounded-md 2xl:text-[18px] cursor-pointer text-[16px] font-semibold mb-1"
                      >
                        {isAiGenerating ? "Improving..." : "Improve"}
                      </Button>
                    </div>
                    {/* </Tooltip> */}
                  </div>
                  <Textarea
                    variant="bordered"
                    // size="md"
                    placeholder="Type the answer here"
                    name="answer"
                    maxRows={6}
                    radius="sm"
                    value={newQuestion.answer}
                    onChange={handleData}
                    classNames={{
                      input: "2xl:text-[20px] text-[16px]  ",
                    }}
                  />
                </div>

                <div>
                  <label className="text-standard">
                    Associated Products
                  </label>

                  <div className="gap-x-6 gap-y-2 flex flex-wrap my-1 ">
                    {companyProducts?.map((item, index) => (
                      <Checkbox
                        key={index}
                        isSelected={newQuestion.productIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                        radius="none"
                        size="lg"
                        classNames={{
                          label: "!rounded-[3px] text-standard",
                          wrapper: "!rounded-[3px]" 
                        }}
                      >
                        {item.name}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-[45%] space-y-3">
                <div className="my-2">
                  <label className="text-standard">Roadmap</label>
                  <Input
                    type="text"
                    variant="bordered"
                    placeholder="If it is in your roadmap, provide details, e.g. “Q2 2025”"
                    size="md"
                    radius="sm"
                    name="roadmap"
                    value={newQuestion.roadmap}
                    onChange={handleData}
                    classNames={{
                      input: "text-standard",
                    }}
                  />
                </div>
                {id && (
                  <div className="">
                    <label className="text-standard">
                      Source
                    </label>
                    <Input
                      type="text"
                      variant="bordered"
                      size="md"
                      radius="sm"
                      name="source"
                      value={newQuestion.documentFile?.name}
                      onChange={handleData}
                      classNames={{
                        input: "text-standard",
                      }}
                    />
                  </div>
                )}

                <div>
                  <label className="text-standard">Curator</label>
                  <Select
                    variant="bordered"
                    className="w-full bg-transparent "
                    size="md"
                    placeholder="Select"
                    name="curator"
                    radius="sm"
                    value={newQuestion.curator}
                    onChange={(e) => handleData(e)}
                    defaultSelectedKeys={
                      newQuestion.curator ? [newQuestion.curator] : []
                    }
                    classNames={{ value: "text-standard" }}
                  >
                    {companyUserData?.map((option) => (
                      <SelectItem
                        key={option.label}
                        value={option.label}
                        classNames={{ title: "text-standard" }}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="text-standard">
                    Reference
                  </label>
                  <MultiSelect
                    value={selectedReference.flatMap((group) => group.items)}
                    options={documentAndOnlineResourceData}
                    onChange={handleSelectionChange}
                    optionLabel="title"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                    optionGroupTemplate={groupedItemTemplate}
                    placeholder="Select References"
                    // display="chip"
                    className="w-full md:w-20rem text-standard"
                  />
                </div>

                <div>
                  <label className="text-standard">
                    Language
                  </label>
                  <Select
                    variant="bordered"
                    className="w-full bg-transparent text-standard "
                    size="md"
                    radius="sm"
                    placeholder="language"
                    name="language"
                    value={newQuestion.language}
                    onChange={(e) => handleData(e)}
                    defaultSelectedKeys={
                      newQuestion.language ? [newQuestion.language] : []
                    }
                    classNames={{ value: "text-standard" }}
                  >
                    {language?.map((option) => (
                      <SelectItem
                        key={option.key}
                        value={option.key}
                        classNames={{ title: "text-standard" }}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-3">
              <Button
                size="md"
                className="global-cancel-btn"
                onClick={() => router.push("/vendor/knowledge")}
              >
                Cancel
              </Button>
              <Button
                size="md"
                className="global-success-btn"
                onClick={handleSubmit}
              >
                {`${id ? "Update" : "Add"}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewQuestion;
