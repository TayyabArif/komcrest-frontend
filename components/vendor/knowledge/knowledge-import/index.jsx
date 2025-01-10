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
import { handleResponse } from "../../../../helper/index";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useMyContext } from "@/context";

const UploadQuestions = () => {
  const [stepper, setStepper] = useState(0);
  const [progressBar, setProgressBar] = useState(13);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [selectedHeader, setSelectedHeader] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [updateHeader, setUpdateHeader] = useState([]);
  const [mappedIndexValue, setMappedIndexValue] = useState([]);
  const {
    companyProducts,
    knowledgeBasePayloadData,
    setKnowledgeBasePayloadData,
    isKnowledgeBaseOpenDirect,
  } = useMyContext();

  const [knowledgeData, setKnowledgeData] = useState({
    name: "",
    language: "",
    productIds: [],
    questions: [],
  });

  useEffect(() => {
    if (isKnowledgeBaseOpenDirect) {
      setStepper(0);
    } else {
      setStepper(3);
      setProgressBar(90);
    }
  }, [isKnowledgeBaseOpenDirect]);

  const [selectedValues, setSelectedVsalues] = useState(
    knowledgeData.questions.length > 0 ? knowledgeData.questions[0] : []
  );

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
    setKnowledgeData((prev) => ({
      ...prev,
      language: "English",
      productIds: companyProducts && companyProducts.map((item) => item.id),
    }));
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
    const rows = knowledgeData.questions.slice(selectedRowIndex + 1);
    const transformedData = rows.map((row) => {
      return mappedIndexValue.reduce((acc, header, index) => {
        if (header) {
          // acc[header.toLowerCase()] = row[index] ? row[index].trim() : "";
          acc[header.toLowerCase()] =
            row[index] && isNaN(row[index]) ? row[index].trim() : "";
        }
        return acc;
      }, {});
    });

    // Remove "do no map" key
    let updatedData = transformedData.map((question) => {
      const { "do no map": _, ...rest } = question;
      return rest;
    });
    if (!updatedData[0].hasOwnProperty("curator")) {
      updatedData = updatedData.map((obj) => ({
        ...obj,
        curator: cookiesData?.userName,
      }));
    }
    const newObj = {
      ...knowledgeData,
      questions: updatedData,
    };
    console.log("Transformed Data:", newObj);
    setKnowledgeBasePayloadData(newObj);
    setStepper(stepper + 1);
    setProgressBar(progressBar + 27);
  };

  const gotToMatchColum = () => {
    if (selectedHeader.length > 0) {
      setStepper(stepper + 1);
      setProgressBar(progressBar + 27);
    } else {
      toast.error("Select a header row");
    }
  };

  const submitData = () => {
    setStepper(stepper + 1);
    setProgressBar(progressBar + 27);

    // change compliance to coverage

    let payloadData = knowledgeBasePayloadData;
    payloadData.questions.forEach((question) => {
      if (question.compliance !== undefined) {
        question.coverage = question.compliance;
        delete question.compliance;
      }
    });
    const jsonPayload = JSON.stringify(payloadData);

    const token = cookiesData.token;
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: jsonPayload,
      redirect: "follow",
    };

    fetch(`${baseUrl}/document-files`, requestOptions)
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
          toast.error(
            error.response.data?.error ||
              "An error occurred while creating the document"
          );
        } else {
          console.error("Fetch Error:", error);
          toast.error("An error occurred while creating the Knowledge");
          setStepper(0);
        }
      });
  };

  const reverseDataFormation = () => {
    if (stepper > 1) {
      const ReVerseTransformDataForMatchColum =
        knowledgeBasePayloadData?.questions?.map((item) => [
          item.question,
          item.coverage,
          item.answer,
          item.curator,
        ]);

      setKnowledgeData({
        name: knowledgeBasePayloadData.name,
        language: knowledgeBasePayloadData.language,
        productIds: knowledgeBasePayloadData.productIds,
        questions: ReVerseTransformDataForMatchColum,
      });

      const keys = Object.keys(knowledgeBasePayloadData?.questions[0]);
      let capitalizedKeys = keys.map(
        (key) => key.charAt(0).toUpperCase() + key.slice(1)
      );

      capitalizedKeys = capitalizedKeys.map(key => key === "Coverage" ? "Compliance" : key);
      setMappedIndexValue(capitalizedKeys);
      console.log(ReVerseTransformDataForMatchColum);
      setSelectedRowIndex(0);
      setSelectedHeader(ReVerseTransformDataForMatchColum[0]);

      setProgressBar(progressBar - 27);
      setStepper(stepper - 1);
    } else {
       router.push("/vendor/questionnaires")
    }
  };

  return (
    <div className="w-[100%] h-full flex flex-col">
      <div className="w-[90%] mx-auto pt-10 mt-[1rem] h-[0vh] flex-1 flex flex-col">
        <h1 className="font-bold bg-slate-50 px-6 py-2 text-standard rounded-t">
          {getTitle()}
        </h1>
        <div className="w-full  bg-white p-6 flex-1 flex flex-col h-[0vh] rounded-b">
          <Progress
            aria-label="Loading..."
            value={progressBar}
            className="h-[8px]"
          />

          <div className="flex flex-1 flex-col justify-between  h-full">
            <div className="flex flex-1 h-[0vh] flex-col">
              <div className="mt-3 flex gap-2">
                <div className="flex gap-3 items-center flex-1 border-2 py-[6px] px-2 rounded">
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
                    } font-semibold text-standard`}
                  >
                    Uplaod File
                  </h1>
                </div>

                <div className="flex gap-3 items-center flex-1 border-2 py-[6px] px-2 rounded">
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
                  <h1 className="text-standard">
                    Select header row
                  </h1>
                </div>

                <div className="flex gap-3 items-center flex-1 border-2 py-[6px] px-2 rounded">
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
                  <h1 className="text-standard">Match Columns</h1>
                </div>

                <div className="flex gap-3 items-center flex-1 border-2 py-[6px] px-2 rounded">
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
                  <h1 className="text-standard">Validate data</h1>
                </div>
              </div>
              {stepper > 0 && stepper < 4 && (
                <h1 className="my-2 font-semibold text-standard">
                  Your table -{" "}
                  {(isKnowledgeBaseOpenDirect
                    ? knowledgeData.name
                    : knowledgeBasePayloadData?.name
                  ).replace(".xlsx", "")}
                </h1>
              )}

              <div className=" h-[0vh] flex-1 flex flex-col">
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
                {stepper == 1 && (
                  <SelectHeaderRow
                    knowledgeData={knowledgeData}
                    setSelectedHeader={setSelectedHeader}
                    setSelectedRowIndex={setSelectedRowIndex}
                    selectedRowIndex={selectedRowIndex}
                  />
                )}
                {stepper == 2 && (
                  <MatchColum
                    setKnowledgeData={setKnowledgeData}
                    knowledgeData={knowledgeData}
                    selectedHeader={selectedHeader}
                    setUpdateHeader={setUpdateHeader}
                    setMappedIndexValue={setMappedIndexValue}
                    mappedIndexValue={mappedIndexValue}
                    updateHeader={updateHeader}
                    selectedRowIndex={selectedRowIndex}
                  />
                )}
                {stepper == 3 && (
                  <Validate
                    knowledgeData={knowledgeData}
                    questions={knowledgeBasePayloadData.questions}
                    selectedRowIndex={selectedRowIndex}
                  />
                )}
                {stepper == 4 && (
                  <Completed content="Importing questions and answers" />
                )}
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
                      <div className="flex itemx-center gap-2">
                        <h1 className="font-semibold text-standard">
                          Select associated products:
                        </h1>
                        <div className="gap-x-6 gap-y-2 flex flex-wrap">
                          {companyProducts.map((item, index) => (
                            <Checkbox
                              key={index}
                              isSelected={knowledgeData.productIds.includes(
                                item.id
                              )}
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
                      <div className="flex items-center mt-5 mb-2">
                        <h1 className="font-semibold text-standard w-60">
                          {" "}
                          Select Language:{" "}
                        </h1>
                        <Select
                          variant="bordered"
                          className="w-full bg-transparent"
                          size="md"
                          radius="sm"
                          placeholder="Select Language"
                          value={knowledgeData.language}
                          onChange={(e) => handleSelectChange(e.target.value)}
                          defaultSelectedKeys={
                            knowledgeData ? [knowledgeData.language] : []
                          }
                          classNames={{ value: "text-standard" }}
                        >
                          {language.map((option) => (
                            <SelectItem
                              key={option.key}
                              value={option.label}
                              classNames={{
                                title: "text-standard",
                              }}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex gap-3">
                    <Button
                      onClick={() => {
                        if (isKnowledgeBaseOpenDirect) {
                          setStepper(stepper - 1);
                          setProgressBar(progressBar - 27);
                        } else {
                          reverseDataFormation();
                        }
                      }}
                      radius="none"
                      size="md"
                      className="global-cancel-btn"
                    >
                      {stepper === 0 ? "Cancel" : "Back"}
                    </Button>
                    <Button
                      onClick={() => {
                        if (stepper == 1) {
                          gotToMatchColum();
                        } else if (stepper == 2) {
                          if (
                            !mappedIndexValue.includes("Question") &&
                            !mappedIndexValue.includes("Compliance")
                          ) {
                            toast.error(
                              "Please select Compliance and Question field"
                            );
                          } else if (!mappedIndexValue.includes("Question")) {
                            toast.error("Please select Question field");
                          } else if (!mappedIndexValue.includes("Compliance")) {
                            toast.error("Please select Compliance field");
                          } else {
                            handleUpdateData();
                          }
                        } else if (stepper == 3) {
                          submitData();
                        }
                      }}
                      radius="none"
                      size="md"
                      className="global-success-btn"
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
