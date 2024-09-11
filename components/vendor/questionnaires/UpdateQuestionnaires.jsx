import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  SelectItem,
  Select as SingleSelect,
  Textarea,
  Checkbox,
} from "@nextui-org/react";
import Dropzone from "react-dropzone";
import { languageOptions } from "@/constants";
import Select, { components } from "react-select";
import { multipleSelectStyle } from "@/helper";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { useMyContext } from "@/context";
import { questionnaireTypeList } from "@/constants";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../helper";
import { parseISO, format, parse } from 'date-fns';



const UpdateQuestionnaires = () => {
  const { allCompanyUserData, companyProducts ,setQuestionnaireUpdated  } = useMyContext();
  const [questionnaireData, setQuestionnaireData] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [filterCollaboratorList , setFilterCollaboratorList] = useState([])
  const [errors, setErrors] = useState({});
  const [InitiaIColaboratorsIds, setInitiaIColaboratorsIds] = useState([]);
  const [dataIsLoaded , setDataIsLoaded] = useState(false)
  const [creatorId , setCreatorId] = useState()
  const [newCollaboratorsList , setNewCollaboratorList] = useState()

  const [currentbaseUrl, setCurrentBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentBaseUrl(window.location.origin);
    }
  }, []);

  const fetchQuestionnaire = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}/questionnaires/${id}`,
        requestOptions
      );
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {

        console.log("data.questionnairedata.questionnaire",data.questionnaire);
        let transformData = {
          customerName: data.questionnaire.customerName,
          customerDomain: data.questionnaire.customerDomain,
          questionnaireType: data.questionnaire.questionnaireType,
          description: data.questionnaire.description,
          productIds: data.questionnaire.products.map((product) => product.id),
          language: data.questionnaire.language,
          collaborators: [
            ...data?.questionnaire?.collaborators.map((collaborator) => collaborator.id),
            data?.questionnaire?.createdBy
          ],
          assignees: data.questionnaire.assignees.map(
            (assignee) => assignee.id
          ),
          returnDate: data?.questionnaire?.returnDate?.split('T')[0],
          // returnDate: format(parseISO(data.questionnaire.returnDate), 'yyyy-MM-dd'),
          fileName: data.questionnaire.fileName,
          
          
        };
        setCreatorId(data?.questionnaire?.createdBy)
        setQuestionnaireData(transformData);

        const initialCollaboratorsIds = [...data?.questionnaire?.collaborators.map(collaborator => ({
          id : collaborator.id,
          isNew:false
        }))];
        setInitiaIColaboratorsIds(initialCollaboratorsIds)
        setNewCollaboratorList(initialCollaboratorsIds)
  
        // escape create id in all user list
        const filterCollaborator = allCompanyUserData?.map((item) => {
          if (item.value === data?.questionnaire?.createdBy) {
            return {
              ...item,
              isFixed: true, // Set isFixed to true for the matching condition
            };
          } else {
            return {
              ...item,
              isFixed: false, // Set isFixed to false for other items
            };
          }
        });
        setFilterCollaboratorList(filterCollaborator)
        setDataIsLoaded(true)
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching Questionnaire:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuestionnaire();
    }
  }, [id]);

  const handleData = (e) => {
    const { name, value } = e.target;
   
      setQuestionnaireData((prevState) => ({
        ...prevState,
        [name]: value,
      })) 
  };

  const handleCheckboxChange = (property, id) => {
    if (property == "type") {
      setQuestionnaireData((prevData) => ({
        ...prevData,
        questionnaireType: prevData.questionnaireType === id ? "" : id,
      }));
    } else if (property == "products") {
      setQuestionnaireData((prevData) => {
        const productIds = prevData.productIds.includes(id)
          ? prevData.productIds.filter((productId) => productId !== id)
          : [...prevData.productIds, id];

        return {
          ...prevData,
          productIds,
        };
      });
    }
  };

  const handleMultipleSelect = (selectedOptions, actionMeta) => {
    const { name } = actionMeta;
    const newValue = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setQuestionnaireData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    checkNewColaboratorOrNot(newValue);
};

  const checkNewColaboratorOrNot = (newCollaborators) => {
     // add isnNewFiled in the original array

     const transformArray = newCollaborators?.map((data)=>({
      id : data,
      isNew : null
     }))

    console.log(">>>>>LLLLL",newCollaborators)
    let result = [];
    transformArray.filter((data)=> data.id !== creatorId).forEach(item => {
    result.push({
      id: item.id,
      isNew: !InitiaIColaboratorsIds.some(obj => obj.id === item.id)
    });
  });

  setNewCollaboratorList(result)
  return result;
  }

  const checkValidations = () => {
    const newErrors = {};
    if (questionnaireData.productIds.length == 0) {
      newErrors.products = "Products is required";
    }
    if (!questionnaireData.language) {
      newErrors.language = "Language is required";
    }
    if (!questionnaireData.returnDate) {
      newErrors.returnDate = "Return Date is required";
    }
    if (!questionnaireData.customerName) {
      newErrors.customerName = "Customer Name is required";
    }
    if (!questionnaireData.customerDomain) {
      newErrors.customerDomain = "Customer Domain is required";
    }
    if (!questionnaireData.questionnaireType) {
      newErrors.questionnaireType = "Questionnaire Type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const questionnaireUpdated = () => {
    console.log("newCollaboratorsListnewCollaboratorsList",newCollaboratorsList)
    if(checkValidations()){
      const paylaod = {
        ...questionnaireData,
        collaborators : newCollaboratorsList,
        questionnaireLink : `${currentbaseUrl}/vendor/questionnaires/view?Questionnair=${id}`
      }
   
    console.log("questionnaireDataquestionnaireData", questionnaireData);
    const jsonPayload = JSON.stringify(paylaod);
    const token = cookiesData.token;

    let requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: jsonPayload,
      redirect: "follow",
    };

    fetch(`${baseUrl}/questionnaires/${id}`, requestOptions)
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
          toast.success(data.message);
          router.push("/vendor/questionnaires");
          setQuestionnaireUpdated ((prev)=>!prev)
        } else {
          toast.error(data?.error || "Questionnaires not Updated");
          console.error("Error:", data);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error("API Error:", error.response);
          toast.error(
            error.response.data?.error ||
              "An error occurred while Updated Questionnaires"
          );
        }
      });
    }
  };

  const { MultiValueRemove } = components;

  const CustomMultiValueRemove = (props) => {
    if (props.data.isFixed) {
      return null;
    }
    return <MultiValueRemove {...props} />;
  };


  return (
    <div className="w-[100%] h-full ">
      {dataIsLoaded && (
        <div className="w-[90%] mx-auto py-4 mt-[7rem]">
        <h1 className="py-2 px-4 bg-[#F6F7F9] text-[16px] 2xl:text-[20px] font-bold">
          Update questionnaire information 
        </h1>
        <div className="px-4 bg-white py-10">
          <div className="flex justify-between pb-10">
            <div className="w-[45%] space-y-6 ">
              <div>
                <label className="text-[16px] 2xl:text-[20px]">
                  Customer or prospect name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  variant="bordered"
                  placeholder=""
                  size="md"
                  name="customerName"
                  value={questionnaireData.customerName}
                  onChange={handleData}
                  classNames={{
                    input: "2xl:text-[20px] text-[16px] text-gray-500",
                  }}
                />
                 {errors.customerName && <p className="text-red-500">{errors.customerName}</p>}
              </div>
              <div>
                <label className="text-[16px] 2xl:text-[20px]">
                  Customer or prospect domain name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  variant="bordered"
                  placeholder=""
                  size="md"
                  name="customerDomain"
                  value={questionnaireData.customerDomain}
                  onChange={handleData}
                  classNames={{
                    input: "2xl:text-[20px] text-[16px] text-gray-500",
                  }}
                />
                 {errors.customerDomain && <p className="text-red-500">{errors.customerDomain}</p>}
              </div>
              <div>
                <label className="text-[16px] 2xl:text-[20px]">
                  Questionnaire type <span className="text-red-500">*</span>
                </label>
                <div className="gap-y-2 gap-10 flex flex-wrap my-1">
                  {questionnaireTypeList?.map((item, index) => (
                    <Checkbox
                      key={index}
                      isSelected={
                        questionnaireData.questionnaireType === item.id
                      }
                      onChange={() => handleCheckboxChange("type", item.id)}
                      className="2xl:text-[20px] !text-[50px]"
                      name="indexationMethod"
                      radius="none"
                      size="lg"
                      classNames={{ wrapper: "!rounded-[3px]" }}
                    >
                      {item.label}
                    </Checkbox>
                  ))}
                </div>
                {errors.questionnaireType && <p className="text-red-500">{errors.questionnaireType}</p>}
              </div>

              <div className="mt-2 mb-3">
                <label className="text-[16px] 2xl:text-[20px]">
                  Add a description to help identify it in the future
                </label>
                <Textarea
                  variant="bordered"
                  // size="sm"
                  maxRows={5}
                  placeholder="Type the question here"
                  name="description"
                  value={questionnaireData.description}
                  onChange={handleData}
                  classNames={{
                    input:
                      "text-[16px] 2xl:text-[20px] h-[150px] text-gray-500",
                  }}
                />
              </div>
            </div>
            <div className="w-[45%] space-y-6 pt-3">
              <div>
                <label className="text-[16px] 2xl:text-[20px]">
                  In scope product(s) <span className="text-red-500">*</span>
                </label>
                <div className="gap-x-6 gap-y-2 flex flex-wrap my-1">
                  {companyProducts?.map((item, index) => (
                    <Checkbox
                      key={index}
                      isSelected={questionnaireData.productIds?.includes(
                        item.id
                      )}
                      onChange={() => handleCheckboxChange("products", item.id)}
                      className="2xl:text-[20px] !text-[50px]"
                      radius="none"
                      size="lg"
                      classNames={{ wrapper: "!rounded-[3px]" }}
                    >
                      {item.name}
                    </Checkbox>
                  ))}
                </div>
                {errors.products && <p className="text-red-500">{errors.products}</p>}
              </div>

              <div>
                <label className="text-[16px] 2xl:text-[20px]">
                  Date to return the questionnaire to the client or prospect <span className="text-red-500">*</span>
                </label>
                <div className="">
                  <input
                    type="date"
                    id="dateInput"
                    value={questionnaireData.returnDate}
                    name="returnDate"
                    onChange={handleData}
                    className=" border-2 px-2 text-gray-500 w-full py-1 border-gray-200 rounded-lg"
                  />
                </div>
                {errors.returnDate && <p className="text-red-500">{errors.returnDate}</p>}
              </div>
              <div>
                <label className="text-[16px] 2xl:text-[20px]">Language <span className="text-red-500">*</span></label>
                <SingleSelect
                  variant="bordered"
                  className="w-full bg-transparent text-[15px]"
                  size="md"
                  placeholder="language"
                  name="language"
                  value={questionnaireData.language}
                  onChange={(e) => handleData(e)}
                  defaultSelectedKeys={
                    questionnaireData?.language
                      ? [questionnaireData?.language]
                      : []
                  }
                  classNames={{ value: "text-[16px] 2xl:text-[20px]" }}
                >
                  {languageOptions?.map((option) => (
                    <SelectItem
                      key={option.key}
                      value={option.key}
                      classNames={{ title: "text-[16px] 2xl:text-[20px]" }}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SingleSelect>
              </div>
              <div>
                <label className="text-[16px] 2xl:text-[20px]">
                  Collaborators who will work on this questionnaire
                </label>
                <Select
                  isMulti
                  options={filterCollaboratorList}
                  styles={multipleSelectStyle}
                  name="collaborators"
                  value={filterCollaboratorList.filter((option) =>
                    questionnaireData.collaborators?.includes(option.value)
                  )}
                  onChange={handleMultipleSelect}
                  components={{ MultiValueRemove: CustomMultiValueRemove }}
                />
              </div>
              {/* <div>
                <label className="text-[16px] 2xl:text-[20px]">
                  Assignees – Who will review and validate the questionnaire
                </label>
                <Select
                  isMulti
                  options={allCompanyUserData}
                  name="assignees"
                  value={allCompanyUserData.filter((option) =>
                    questionnaireData.assignees?.includes(option.value)
                  )}
                  onChange={handleMultipleSelect}
                  styles={multipleSelectStyle}
                />
              </div> */}
            </div>
          </div>
          <div className="flex justify-end  gap-3">
            <Button
              size="md"
              className="rounded-md 2xl:text-[20px] cursor-pointer bg-red-200 py-0 text-red-500 text-[13px] font-semibold"
              onClick={()=>router.push("/vendor/questionnaires")}
            >
              Cancel
            </Button>
            <Button
              size="md"
              color="primary"
              className="rounded-md 2xl:text-[20px] cursor-pointer text-[13px] font-semibold"
              onClick={questionnaireUpdated}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
      )}
      
    </div>
  );
};

export default UpdateQuestionnaires;












