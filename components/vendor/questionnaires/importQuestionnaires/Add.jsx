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
import Select from "react-select";
import { multipleSelectStyle } from "@/helper";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { useMyContext } from "@/context";
import { questionnaireTypeList } from "@/constants";
import { format, parse } from 'date-fns';
import { Vault } from "lucide-react";

const Add = ({
  importQuestionnaires,
  setImportQuestionnaire,
  setExcelFile,
  excelFile,
  errors,
  setErrors,
}) => {
  const { companyUserData, companyProducts } = useMyContext();
  const [companyUserDataOptions, setCompanyUserDataOptions] = useState([]);
  const [dataLoaded, setDataIsLoaded] = useState(false);

  const allowedFileTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel
    "text/csv", // CSV
  ];

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImportQuestionnaire({
      ...importQuestionnaires,
      fileName: file.name,
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
    
    if(name == "returnDate"){
      alert(typeof value)
      const formattedDate = format(parse(value, 'yyyy-MM-dd', new Date()), 'dd-MM-yy');
      alert(formattedDate)
      setImportQuestionnaire((prevState) => ({
        ...prevState,
        [name]: formattedDate,
      }));
    }else{
      setImportQuestionnaire((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
   

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

  return (
    <div className="flex justify-between ">
      <div className="w-[45%] space-y-6 ">
        <div>
          <label className="text-[16px] 2xl:text-[20px]">
            Customer or prospect name
          </label>
          <Input
            type="text"
            variant="bordered"
            placeholder=""
            size="md"
            name="customerName"
            value={importQuestionnaires.customerName}
            onChange={handleData}
            classNames={{
              input: "2xl:text-[20px] text-[16px] text-gray-500",
            }}
          />
          {errors.customerName && (
            <p className="text-red-500">{errors.customerName}</p>
          )}
        </div>
        <div>
          <label className="text-[16px] 2xl:text-[20px]">
            Customer or prospect domain name
          </label>
          <Input
            type="text"
            variant="bordered"
            placeholder=""
            size="md"
            name="customerDomain"
            value={importQuestionnaires.customerDomain}
            onChange={handleData}
            classNames={{
              input: "2xl:text-[20px] text-[16px] text-gray-500",
            }}
          />
        </div>
        <div>
          <label className="text-[16px] 2xl:text-[20px]">
            Questionnaire type
          </label>
          <div className="gap-y-2 gap-10 flex flex-wrap my-1">
            {questionnaireTypeList?.map((item, index) => (
              <Checkbox
                key={index}
                isSelected={importQuestionnaires.questionnaireType === item.id}
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
        </div>
        <div className="flex-1">
          <label className="text-[16px] 2xl:text-[20px]">
            Spreadsheet (Excel, CSV)
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
          <label className="text-[16px] 2xl:text-[20px]">
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
            classNames={{
              input: "text-[16px] 2xl:text-[20px] h-[150px] text-gray-500",
            }}
          />
        </div>
      </div>
      <div className="w-[45%] space-y-6 pt-3">
        <div>
          <label className="text-[16px] 2xl:text-[20px]">
            In scope product(s)*
          </label>
          <div className="gap-x-6 gap-y-2 flex flex-wrap my-1">
            {companyProducts?.map((item, index) => (
              <Checkbox
                key={index}
                isSelected={importQuestionnaires.productIds.includes(item.id)}
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
            Date to return the questionnaire to the client or prospect
          </label>
          <div className="">
          <input
          type="date"
          id="dateInput"
          value={importQuestionnaires.returnDate}
          name="returnDate"
          onChange={handleData}
          className=" border-2 px-2 text-gray-500 w-full py-1 border-gray-200 rounded-lg"
        />
          </div>
        </div>
        
        <div>
          <label className="text-[16px] 2xl:text-[20px]">Language</label>
          <SingleSelect
            variant="bordered"
            className="w-full bg-transparent text-[15px]"
            size="md"
            placeholder="language"
            name="language"
            value={importQuestionnaires.language}
            onChange={(e) => handleData(e)}
            defaultSelectedKeys={
              importQuestionnaires.language
                ? [importQuestionnaires.language]
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
          {errors.language && <p className="text-red-500">{errors.language}</p>}
        </div>

        <div>
          <label className="text-[16px] 2xl:text-[20px]">
            Collaborators who will work on this questionnaire
          </label>
          <Select
            isMulti
            options={companyUserData}
            styles={multipleSelectStyle}
            name="collaborators"
            value={companyUserData.filter((option) =>
              importQuestionnaires.collaborators.includes(option.value)
            )}
            onChange={handleMultipleSelect}
          />
        </div>
        <div>
          <label className="text-[16px] 2xl:text-[20px]">
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
        </div>
      </div>
    </div>
  );
};

export default Add;
