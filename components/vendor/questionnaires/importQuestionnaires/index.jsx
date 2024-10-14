import React, { useState, useEffect, useRef } from "react";
import {
  Progress,
  Button,
  Checkbox,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Check } from "lucide-react";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../../helper/index";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Completed from "../../shared/Completed";
import Add from "./Add";
import SelectHeader from "./SelectHeader";
import SelectQuestion from "./SelectQuestion";
import ValidateData from "./ValidateData";
import { useMyContext } from "@/context";

const Import = ({ setImportSuccessfully, setQuestionList, questionList }) => {
  const { companyProducts } = useMyContext();
  const [stepper, setStepper] = useState(0);
  const { setQuestionnaireUpdated } = useMyContext();
  const [progressBar, setProgressBar] = useState(13);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const token = cookiesData?.token;
  const userID = cookiesData?.userId;
  const companyId = cookiesData?.companyId;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [excelFile, setExcelFile] = useState({});
  const [selectedRows, setSelectedRows] = useState({});
  const [columnMapping, setColumnMapping] = useState({});
  const [errors, setErrors] = useState({});
  const [totalCount, setTotalCount] = useState("");
  const [reamingData, setReamingData] = useState();
  const ValidateComponentRef = useRef();
  const [importQuestionnaires, setImportQuestionnaire] = useState({
    customerName: "",
    customerDomain: "",
    questionnaireType: "",
    description: "",
    productIds: [],
    language: "",
    collaborators: [userID],
    assignees: [],
    returnDate: "",
    fileName: "",
    Questionnaires: [],
    originalFile: "",
  });

  useEffect(() => {
    if (companyProducts.length === 1) {
      console.log("companyProducts", companyProducts);
      setImportQuestionnaire((prev) => ({
        ...prev,
        productIds: [companyProducts[0].id],
      }));
    }
  }, [companyProducts]);

  const getDatafromChild = () => {
    let getData;
    if (ValidateComponentRef.current) {
      getData = ValidateComponentRef.current.callChildFunction(); // Call the child's function via ref
    }
    return getData;
  };

  const [currentbaseUrl, setCurrentBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentBaseUrl(window.location.origin);
    }
  }, []);

  function getTitle() {
    switch (stepper) {
      case 0:
        return "Upload a questionnaire and define the settings";
      case 1:
        return "Select header row so we can match columns afterwards";
      case 2:
        return "Identify questions & categories if available";
      case 3:
      case 4:
        return " Remove unnecessary rows and validate the questions to import and to be answered by Komcrest AI";
      default:
        return "";
    }
  }

  const firstStepValidation = () => {
    const newErrors = {};
    if (!importQuestionnaires.fileName) {
      newErrors.fileName = "File is required";
    }
    if (importQuestionnaires.productIds.length == 0) {
      newErrors.products = "Products is required";
    }
    if (!importQuestionnaires.language) {
      newErrors.language = "Language is required";
    }
    if (!importQuestionnaires.returnDate) {
      newErrors.returnDate = "Return Date is required";
    }
    if (!importQuestionnaires.customerName) {
      newErrors.customerName = "Customer Name is required";
    }
    if (!importQuestionnaires.customerDomain) {
      newErrors.customerDomain = "Customer Domain is required";
    }
    if (!importQuestionnaires.questionnaireType) {
      newErrors.questionnaireType = "Questionnaire Type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkValuesLength = () => {
    if (Object.keys(columnMapping).length === 0) {
      return false;
    }
  
    return Object.entries(columnMapping).every(([sheetName, value]) => {
      // Add null safety check for excelFile[sheetName] and excelFile[sheetName][0]
      if (!excelFile[sheetName] || !excelFile[sheetName][0]) {
        return false; // Return false if the sheet or the first row doesn't exist
      }
  
      // For single-column sheets, check if only "Question" is selected
      if (excelFile[sheetName][0].length === 1) {
        return value[0] === "Question";  // Check if the first and only option is "Question"
      }
  
      // For multiple columns, ensure both "Category" and "Question" are selected
      return Object.keys(value).length === 2 && value[0] && value[1];
    });
  };
  

  const handleNextClick = () => {
    if (stepper === 0 && firstStepValidation()) {
      setStepper(stepper + 1);
      setProgressBar(progressBar + 27);
    } else if (stepper === 1) {
      if (Object.keys(excelFile).length === Object.keys(selectedRows).length) {
        setStepper(stepper + 1);
        setProgressBar(progressBar + 27);
      } else {
        toast.error("Please select headers row for each sheet");
      }
    } else if (stepper === 2) {
      if (
        checkValuesLength() &&
        Object.keys(columnMapping).length === Object.keys(selectedRows).length
      ) {
        setStepper(stepper + 1);
        setProgressBar(progressBar + 27);
      } else {
        toast.error("Please choose a mapped options first to proceed.");
      }
    } else if (stepper === 3) {
      const finalData = getDatafromChild();
      setStepper(stepper + 1);
      setProgressBar(progressBar + 27);
      const transformedData = {};
      for (const key in finalData) {
        const rows = excelFile[key];
        const headers = rows[0];
        const dataRows = finalData[key];
        transformedData[key] = dataRows.map((row) => {
          let obj = {};
          const mapping = columnMapping[key];
  
          row.forEach((value, index) => {
            const mappedHeader = mapping[index]; 
            if (mappedHeader) {
              obj[mappedHeader] = value; 
            }
          });
          return obj;
        });
      }
      submitQuestions(transformedData);
      console.log("transformedDatatransformedData", transformedData);
    }
  };
  
  const submitQuestions = (transformedData) => {
    // convert object data in array of object
    let result = [];
    for (const [sheetTag, questions] of Object.entries(transformedData)) {
      questions.forEach((item) => {
        let newObj = {
          Category: item.Category,
          Question: item.Question,
          sheetTag: sheetTag,
        };

        // Push the new object into the result array
        result.push(newObj);
      });
    }
    const questionnaireLink = `${currentbaseUrl}/vendor/questionnaires/view?Questionnair=questionnaireId`;
    const payload = {
      ...importQuestionnaires,
      Questionnaires: result,
      questionnaireLink,
      collaborators: importQuestionnaires.collaborators.filter(
        (id) => id !== userID
      ),
    };

    setQuestionList(result);
    setTotalCount(payload.Questionnaires.length);
    const token = cookiesData.token;

    console.log("questionnire payloadllllllllll", payload);

    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      redirect: "follow",
    };
    // Introduce a 2-second delay before making the API call
    setTimeout(() => {
      setImportSuccessfully(true);
    }, 1500);

    setTimeout(() => {
      // setImportSuccessfully(true)
      fetch(`${baseUrl}/questionnaires`, requestOptions)
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
            toast.success("Questionnaires created successfully");
            localStorage.setItem(
              "QuestionnaireId",
              data?.fullQuestionnaire?.id
            );
            router.push(
              `/vendor/questionnaires/view?name=${data?.fullQuestionnaire?.customerName}`
            );
            uploadFile(data?.fullQuestionnaire?.id);
          } else {
            toast.error(data?.error || "Questionnaires not Created");
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
          }
        });
    }, 3000); // 3-second delay
  };

  const uploadFile = (id) => {
    const formData = new FormData();
    formData.append("file", importQuestionnaires.originalFile);
    const token = cookiesData.token;
    let requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      redirect: "follow",
    };

    fetch(`${baseUrl}/questionnaire/file/${id}`, requestOptions)
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
          setQuestionnaireUpdated((prev) => !prev);
        } else {
          console.error("Error:", data);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error("API Error:", error.response);
          toast.error(
            error.response.data?.error ||
              "An error occurred while Updated  Questionnaires status"
          );
        }
      });
  };

  const handleCancelClick = () => {
    if (stepper > 0) {
      setStepper(stepper - 1);
      setProgressBar(progressBar - 27);
    } else {
      router.push("/vendor/questionnaires");
    }
  };

  return (
    <div className="w-[100%] h-full">
      <div className="w-[90%] mx-auto py-4 mt-[2rem]">
        <h1 className="font-semibold bg-slate-50 px-6 py-1 2xl:text-[20px]">
          {getTitle()}
        </h1>
        <div className="w-full h-auto bg-white p-6">
          <Progress
            aria-label="Loading..."
            value={progressBar}
            className="h-[8px]"
          />

          <div className=" space-y-0 h-full">
            <div className="my-3 flex gap-2">
              {[
                "Add questionnaire",
                "Select header row",
                "Select questions",
                "Validate data",
              ].map((title, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-center flex-1 border-2 py-[6px] px-2 rounded"
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
            <div className="">
              {stepper > 0 && stepper < 4 && (
                <h1 className="font-semibold text-[16px] 2xl:text-[20px]">
                  {importQuestionnaires?.customerName} -{" "}
                  {importQuestionnaires?.fileName?.replace(".xlsx", "")}
                </h1>
              )}
              {stepper === 0 && (
                <Add
                  importQuestionnaires={importQuestionnaires}
                  setImportQuestionnaire={setImportQuestionnaire}
                  setExcelFile={setExcelFile}
                  excelFile={excelFile}
                  errors={errors}
                  setErrors={setErrors}
                />
              )}
              {stepper === 1 && (
                <SelectHeader
                  excelFile={excelFile}
                  setExcelFile={setExcelFile}
                  setSelectedRows={setSelectedRows}
                  selectedRows={selectedRows}
                  columnMapping={columnMapping}          
                  setColumnMapping={setColumnMapping}   
                />
              )}
              {stepper === 2 && (
                <SelectQuestion
                  excelFile={excelFile}
                  selectedRows={selectedRows}
                  setColumnMapping={setColumnMapping}
                  columnMapping={columnMapping}
                />
              )}
              {stepper === 3 && (
                <ValidateData
                  columnMapping={columnMapping}
                  excelFile={excelFile}
                  ref={ValidateComponentRef}
                  setExcelFile={setExcelFile}
                  setReamingData={setReamingData}
                />
              )}
              {stepper === 4 && (
                <Completed content={`Importing ${totalCount} questions`} />
              )}
            </div>

            {stepper < 4 && (
              <div className="flex justify-end !mt-15">
                <Button
                  onClick={handleCancelClick}
                  radius="none"
                  size="sm"
                  className="px-3 mx-3 text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-red-200 py-0 text-red-500 w-max rounded-[4px]"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Import;
