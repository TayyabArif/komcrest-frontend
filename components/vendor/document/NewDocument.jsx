import React, { useState } from "react";
import { Input, Textarea, Button, Checkbox } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";

const NewDocument = () => {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles),
  });

  const [documentData, setDocumentData] = useState({
    title: "",
    description: "",
    file: null,
    associated_product: [],
    document_link: ""
  });

  const [checkBoxData, setCheckBoxData] = useState([
    { name: "product 1", check: false },
    { name: "product 2", check: false },
    { name: "product 3", check: false },
    { name: "product 4", check: false },
    { name: "product 5", check: false },
  ]);

  const id = null

  const handleData = (e) => {
    const { name, value } = e.target;
    setDocumentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDrop = (acceptedFiles) => {
    setDocumentData((prevData) => ({
      ...prevData,
      file: acceptedFiles[0],
    }));
  };

  const handleCheckboxChange = (index) => {
    const newCheckBoxData = [...checkBoxData];
    newCheckBoxData[index].check = !newCheckBoxData[index].check;
    setCheckBoxData(newCheckBoxData);

    const selectedProducts = newCheckBoxData
      .filter((item) => item.check)
      .map((item) => item.name);

    setDocumentData((prevData) => ({
      ...prevData,
      associated_product: selectedProducts,
    }));
  };

  const SubmitDocument = () => {
    console.log(documentData);
  };

  return (
    <div className="w-[100%] h-[80vh] flex justify-center items-center">
      <div className="w-[80%] mx-auto">
        <h1 className="font-semibold bg-slate-50 px-4 py-1">Dropzone</h1>

        <div className="px-4 bg-white pb-6">
          <h1 className="py-1 border-b-2">{ id ? "Update" :"Add New" } Documents</h1>

          <div className="flex my-3">
            <div className="w-[50%] pr-4 space-y-3">
              <p className="text-[15px] leading-5">
                Drag and drop sections for your file uploads or click and select
                file to upload to be indexed by Komcrest AI. Alternatively, you
                can add the link to the document, but it won’t be indexed.
                <br></br>
                <br></br>
                Accepted files: pdf (recommended), txt, csv, json, doc, docx,
                xls, xlsx files smaller than 100 MB
              </p>
              <div>
                <label className="text-[15px]">Title</label>
                <Input
                  type="text"
                  variant="bordered"
                  size="sm"
                  className="w-[80%]"
                  name="title"
                  value={documentData.title}
                  onChange={handleData}
                />
              </div>
              <Textarea
                label="Description"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your description"
                className="w-[80%] my-5"
                name="description"
                value={documentData.description}
                onChange={handleData}
              />

              <div>
                <h1>Select associated product(s)</h1>
                <div className="gap-x-6 gap-y-2 flex flex-wrap my-1">
                  {checkBoxData &&
                    checkBoxData.map((item, index) => (
                      <Checkbox
                        key={index}
                        radius="sm"
                        isSelected={item.check}
                        onChange={() => handleCheckboxChange(index)}
                      >
                        {item.name}
                      </Checkbox>
                    ))}
                </div>
              </div>
            </div>

            <div className="w-[50%] px-5 space-y-6">
              <div
                {...getRootProps()}
                className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-100 cursor-pointer"
              >
                <input {...getInputProps()} />

                {documentData.file ? (
                  <div className="mt-2">
                    <p>{documentData.file.name}</p>
                  </div>
                ) : (
                  <p className="text-center text-gray-700 font-bold italic">
                    Drop file or click here to upload file
                  </p>
                )}
              </div>

              <div>
                <label className="text-[15px]">Document link</label>
                <Input
                  type="text"
                  variant="bordered"
                  size="sm"
                  name="document_link"
                  value={documentData.document_link}
                  onChange={handleData}
                />
              </div>
            </div>
          </div>
          <div className="text-right">
            <Button
              color="danger"
              size="sm"
              className="bg-red-100 rounded mx-3"
              variant="light"
            >
              Cancel
            </Button>
            <Button
              onClick={SubmitDocument}
              size="sm"
              className="bg-blue-300 rounded"
            >
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDocument;
