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
import { format, parse } from 'date-fns';
import { Vault } from "lucide-react";
import { useCookies } from "react-cookie";

const Add = ({
  importQuestionnaires,
  setImportQuestionnaire,
  setExcelFile,
  excelFile,
  errors,
  setErrors,
}) => {
  const { companyUserData, companyProducts ,allCompanyUserData } = useMyContext();
  const [companyUserDataOptions, setCompanyUserDataOptions] = useState([]);
  const [dataLoaded, setDataIsLoaded] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const userID = cookiesData?.userId;




  const allowedFileTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel
    "text/csv", // CSV
  ];

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImportQuestionnaire({
      ...importQuestionnaires,
      fileName: file.name,
      originalFile:file 
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetsData = {};

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        let sheetData = XLSX.utils.sheet_to_json(sheet, {
          header: 1, // Output an array of arrays, instead of objects
          defval: "", // Default value for empty cells
          blankrows: false, // Skip blank rows
        });

        // Filter out empty rows
        sheetData = sheetData.filter((row) => row.some((cell) => cell !== ""));

        // Filter out empty columns
        if (sheetData.length > 0) {
          const nonEmptyCols = sheetData[0].map((_, colIndex) =>
            sheetData.some((row) => row[colIndex] !== "")
          );
          sheetData = sheetData.map((row) =>
            row.filter((_, colIndex) => nonEmptyCols[colIndex])
          );
        }

        sheetsData[sheetName] = sheetData;
      });

      setExcelFile(sheetsData);

      if (errors.fileName) {
        setErrors({
          ...errors,
          fileName: "",
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleData = (e) => {
    const { name, value } = e.target;
      setImportQuestionnaire((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleCheckboxChange = (property, id) => {
    if (property == "type") {
      setImportQuestionnaire((prevData) => ({
        ...prevData,
        questionnaireType: prevData.questionnaireType === id ? "" : id,
      }));
    } else if (property == "products") {
      setImportQuestionnaire((prevData) => {
        const productIds = prevData.productIds.includes(id)
          ? prevData.productIds.filter((productId) => productId !== id)
          : [...prevData.productIds, id];

        return {
          ...prevData,
          productIds,
        };
      });
    }

    if (errors[property]) {
      setErrors({
        ...errors,
        [property]: "",
      });
    }
  };

  const handleMultipleSelect = (selectedOptions, actionMeta) => {
    const { name } = actionMeta;
    setImportQuestionnaire((prevState) => ({
      ...prevState,
      [name]: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  useEffect(()=>{
    const filterCollaborator = allCompanyUserData?.map((item) => {
      if (item.value === userID) {
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

    setCompanyUserDataOptions(filterCollaborator)
    console.log("filterCollaboratorfilterCollaborator",filterCollaborator)
    setDataIsLoaded(true)
  },[allCompanyUserData ,userID])


  const { MultiValueRemove } = components;
  const CustomMultiValueRemove = (props) => {
    if (props.data.isFixed) {
      return null;
    }
    return <MultiValueRemove {...props} />;
  };

  return (
    <>
    {dataLoaded && (
      <div className="flex justify-between">
      <div className="w-[45%] space-y-3 ">
        <div>
          <label className="text-standard">
            Customer or prospect name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            variant="bordered"
            placeholder=""
            size="md"
            radius="sm"
            name="customerName"
            value={importQuestionnaires.customerName}
            onChange={handleData}
            classNames={{
              input: "text-standard",
            }}
          />
          {errors.customerName && <p className="text-red-500">{errors.customerName}</p>}
        </div>
        <div>
          <label className="text-standard">
            Customer or prospect domain name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            variant="bordered"
            placeholder=""
            size="md"
            radius="sm"
            name="customerDomain"
            value={importQuestionnaires.customerDomain}
            onChange={handleData}
            classNames={{
              input: "text-standard",
            }}
          />
            {errors.customerDomain && <p className="text-red-500">{errors.customerDomain}</p>}
        </div>
        <div>
          <label className="text-standard">
            Questionnaire type <span className="text-red-500">*</span>
          </label>
          <div className="gap-y-2 gap-10 flex flex-wrap">
            {questionnaireTypeList?.map((item, index) => (
              <Checkbox
                key={index}
                isSelected={importQuestionnaires.questionnaireType === item.id}
                onChange={() => handleCheckboxChange("type", item.id)}
                name="indexationMethod"
                radius="none"
                size="lg"
                classNames={{
                  label: "!rounded-[3px] text-standard",
                  wrapper: "!rounded-[3px]" 
                }}
              >
                {item.label}
              </Checkbox>
            ))}

          </div>
          {errors.questionnaireType && <p className="text-red-500">{errors.questionnaireType}</p>}
        </div>
        <div className="flex-1">
          <label className="text-standard">
            Spreadsheet (Excel, CSV) <span className="text-red-500">*</span>
          </label>
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-100 cursor-pointer"
              >
                <input {...getInputProps()} />
                <p className="text-center text-blue-700 font-bold italic 2xl:text-[20px]">
                  {importQuestionnaires.fileName
                    ? importQuestionnaires.fileName
                    : "Drop file or click here to upload Excel or CSV file"}
                </p>
              </div>
            )}
          </Dropzone>
          {errors.fileName && <p className="text-red-500">{errors.fileName}</p>}
        </div>
        <div className="mt-2 mb-3">
          <label className="text-standard">
            Add a description to help identify it in the future
          </label>
          <Textarea
            variant="bordered"
            // size="sm"
            maxRows={5}
            placeholder="Type the question here"
            name="description"
            value={importQuestionnaires.description}
            onChange={handleData}
            radius="sm"
            classNames={{
              input: "text-standard h-[150px]",
            }}
          />
        </div>
      </div>
      <div className="w-[45%] space-y-3 pt-3">
        <div>
          <label className="text-standard">
            In scope product(s) <span className="text-red-500">*</span>
          </label>
          <div className="gap-x-6 gap-y-2 flex flex-wrap">
            {companyProducts?.map((item, index) => (
              <Checkbox
                key={index}
                isSelected={importQuestionnaires.productIds.includes(item.id)}
                onChange={() => handleCheckboxChange("products", item.id)}
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
          {errors.products && <p className="text-red-500">{errors.products}</p>}
        </div>

        <div>
          <label className="text-standard">
            Date to return the questionnaire to the client or prospect <span className="text-red-500">*</span>
          </label>
          <div className="">
          <input
          type="date"
          id="dateInput"
          value={importQuestionnaires.returnDate}
          name="returnDate"
          onChange={(e) => {
            const value = e.target.value;
            const year = value.split('-')[0];
            if (year.length > 4) {
              // Trigger an error if year exceeds 4 characters
              setErrors((prev) => ({
                ...prev,
                returnDate: "Year cannot exceed 4 characters.",
              }));
            } else {
              // Reset errors and update the value
              setErrors((prev) => ({
                ...prev,
                returnDate: "",
              }));
              handleData(e);
            }
          }}
          min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}  
          className=" border-2 px-2  w-full py-1 border-gray-200 rounded-lg text-standard"
        />
          </div>
          {errors.returnDate && <p className="text-red-500">{errors.returnDate}</p>}
        </div>
        
        <div>
          <label className="text-standard">Language <span className="text-red-500">*</span></label>
          <SingleSelect
            variant="bordered"
            className="w-full bg-transparent text-[15px]"
            size="md"
            placeholder="language"
            name="language"
            radius="sm"
            value={importQuestionnaires.language}
            onChange={(e) => handleData(e)}
            defaultSelectedKeys={
              importQuestionnaires.language
                ? [importQuestionnaires.language]
                : []
            }
            classNames={{ value: "text-standard" }}
          >
            {languageOptions?.map((option) => (
              <SelectItem
                key={option.key}
                value={option.key}
                classNames={{ title: "text-standard" }}
              >
                {option.label}
              </SelectItem>
            ))}
          </SingleSelect>
          {errors.language && <p className="text-red-500">{errors.language}</p>}
        </div>

        <div>
          <label className="text-standard">
            Collaborators who will work on this questionnaire 
          </label>
          <Select
            isMulti
            options={companyUserDataOptions}
            styles={multipleSelectStyle}
            name="collaborators"
            className="text-standard"
            value={companyUserDataOptions.filter((option) =>
              importQuestionnaires.collaborators.includes(option.value)
            )}
            onChange={handleMultipleSelect}
            components={{ MultiValueRemove: CustomMultiValueRemove }}
          />
        </div>
        {/* <div>
          <label className="text-standard">
            Assignees – Who will review and validate the questionnaire
          </label>
          <Select
            isMulti
            options={companyUserData}
            name="assignees"
            value={companyUserData.filter((option) =>
              importQuestionnaires.assignees.includes(option.value)
            )}
            onChange={handleMultipleSelect}
            styles={multipleSelectStyle}
          />
        </div> */}
      </div>
    </div>
    )}
    </>
    
  );
};

export default Add;
