import React, { useEffect, useState } from "react";
import { Input, Textarea, Button, Checkbox } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const NewDocument = () => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles),
  });

  const router = useRouter();
  const { id } = router.query;

  const [documentData, setDocumentData] = useState({
    title: "",
    description: "",
    file: null,
    associated_product: [],
    documentLink: "",
  });

  const [checkBoxData, setCheckBoxData] = useState([
    { name: "product 1", check: false },
    { name: "product 2", check: false },
    { name: "product 3", check: false },
    { name: "product 4", check: false },
    { name: "product 5", check: false },
  ]);

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

  const SubmitDocument = async () => {
    const formData = new FormData();
    formData.append("title", documentData.title);
    formData.append("description", documentData.description);
    formData.append("file", documentData.file);
    formData.append(
      "associated_product",
      JSON.stringify(documentData.associated_product)
    );
    formData.append("documentLink", documentData.documentLink);

    const token = localStorage.getItem("token");

    let requestOptions;

    if (id) {
      requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        redirect: "follow",
      };

      fetch(`http://localhost:3001/api/documents/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          toast.success("Document updated successfully");
          console, log("", result);
          router.push("/vendor/document");
        })
        .catch((error) => console.error(error));
    } else {
      requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        redirect: "follow",
      };

      fetch("http://localhost:3001/api/documents", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          toast.success("Document created successfully");
          router.push("/vendor/document");
        })
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
      };

      fetch(`http://localhost:3001/api/documents/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setDocumentData(result);
          console.log(result);
        })
        .catch((error) => console.error(error));
    }
  }, [id]);

  return (
    <div className="w-[100%] h-[80vh] flex justify-center items-center">
      <div className="w-[80%] mx-auto">
        <h1 className="font-semibold bg-slate-50 px-4 py-1">Dropzone</h1>
        <div className="px-4 bg-white pb-6">
          <h1 className="py-1 border-b-2">Add New Documents</h1>
          <div className="flex my-3">
            <div className="w-[50%] pr-4 space-y-3">
              <p className="text-[15px] leading-5">
                Drag and drop sections for your file uploads or click and select
                file to upload to be indexed by Komcrest AI. Alternatively, you
                can add the link to the document, but it won’t be indexed.
                <br />
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
                  {checkBoxData.map((item, index) => (
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
                  name="documentLink"
                  value={documentData.documentLink}
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
