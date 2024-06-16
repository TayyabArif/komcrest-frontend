import React, { useEffect, useState } from "react";
import { Input, Textarea, Button, Checkbox } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

const NewDocument = () => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles),
  });

  const [cookies, setCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  console.log("<<<<<<<<<<<,", cookiesData?.companyId);

  const [companyProducts, setCompanyProducts] = useState([]);

  const router = useRouter();
  const { id } = router.query;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [documentData, setDocumentData] = useState({
    title: "",
    description: "",
    file: null,
    productIds: [],
    documentLink: "",
  });

  const handleData = (e) => {
    const { name, value } = e.target;
    setDocumentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDrop = (acceptedFiles) => {
    const allowedTypes = [
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/json",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const file = acceptedFiles[0];
    if (file && allowedTypes.includes(file.type)) {
      setDocumentData((prevData) => ({
        ...prevData,
        file: file,
      }));
    } else {
      toast.error("Invalid file type. Please upload a valid file.");
    }
  };

  const handleCheckboxChange = (index) => {
    const newCheckBoxData = [...companyProducts];
    newCheckBoxData[index].check = !newCheckBoxData[index].check;
    setCompanyProducts(newCheckBoxData);

    const selectedProducts = newCheckBoxData
      .filter((item) => item.check)
      .map((item) => item.id);

    setDocumentData((prevData) => ({
      ...prevData,
      productIds: selectedProducts,
    }));
  };

  const SubmitDocument = async () => {
    const formData = new FormData();
    formData.append("title", documentData.title);
    formData.append("description", documentData.description);
    formData.append("file", documentData.file);
    formData.append("productIds", JSON.stringify(documentData.productIds));
    formData.append("documentLink", documentData.documentLink);

    const token = cookiesData.token;
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

      fetch(`${baseUrl}/documents/${id}`, requestOptions)
        .then((response) => {
          return response.json().then((data) => ({
            status: response.status,
            ok: response.ok,
            data,
          }));
        })
        .then(({ status, ok, data }) => {
          if (ok) {
            toast.success("Document updated successfully");
            router.push("/vendor/document");
          } else {
            toast.error(data?.error);
            console.error("Error:", data);
          }
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

      fetch(`${baseUrl}/documents`, requestOptions)
        .then((response) => {
          console.log(">>>>>>>>>", response);
          return response.json().then((data) => ({
            status: response.status,
            ok: response.ok,
            data,
          }));
        })
        .then(({ status, ok, data }) => {
          if (ok) {
            console.log("Success:", data);
            toast.success("Document created successfully");
            router.push("/vendor/document");
          } else {
            toast.error(data?.error || "Document not Created");
            console.error("Error:", data);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const getCompanyProducts = async () => {
    const token = cookiesData.token;
    const companyId = cookiesData?.companyId;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };
    fetch(`${baseUrl}/companies/${companyId}`, requestOptions)
      .then((response) => {
        return response.json().then((data) => ({
          status: response.status,
          ok: response.ok,
          data,
        }));
      })
      .then(({ status, ok, data }) => {
        if (ok) {
          setCompanyProducts(data?.Products);
          console.log(">>>>>>>", data?.Products);
        } else {
          toast.error(data?.error);
          console.error("Error:", data);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getCompanyProducts();
    if (id) {
      const token = cookiesData.token;
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
      };
      fetch(`${baseUrl}/documents/${id}`, requestOptions)
        .then((response) => {
          return response.json().then((data) => ({
            status: response.status,
            ok: response.ok,
            data,
          }));
        })
        .then(({ status, ok, data }) => {
          if (ok) {
            setDocumentData(data);
          } else {
            toast.error(data?.error);
            console.error("Error:", data);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [id]);

  return (
    <div className="w-[100%]  h-full">
      <div className="w-[80%] mx-auto py-4 mt-[4rem]">
        <h1 className="font-semibold bg-slate-50 px-4 py-1">Dropzone</h1>
        <div className="px-4 bg-white pb-6">
          <h1 className="py-1 border-b-2">Add New Documents</h1>
          <div className=" my-3">
            <div className="flex pr-4 space-y-3 items-center gap-2">
              <div className="w-[50%]">
                <p className="text-[14px] leading-5">
                  Drag and drop sections for your file uploads or click and
                  select file to upload to be indexed by Komcrest AI.
                  Alternatively, you can add the link to the document, but it
                  won’t be indexed.
                  <br />
                  Accepted files: pdf (recommended), txt, csv, json, doc, docx,
                  xls, xlsx files smaller than 100 MB
                </p>
              </div>

              <div className="flex-1">
                <div
                  {...getRootProps()}
                  className="flex justify-center items-center border-2 w-[] border-dashed border-gray-300 rounded-lg p-10 bg-gray-100 cursor-pointer"
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
              </div>
            </div>

            <div className="flex my-2 justify-between">
              <div className="w-[45%]">
                <label className="text-[15px]">Title</label>
                <Input
                  type="text"
                  variant="bordered"
                  size="sm"
                  name="title"
                  value={documentData.title}
                  onChange={handleData}
                />
              </div>

              <div className="w-[50%]">
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
            <div className="w-[45%]">
              <Textarea
                label="Description"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your description"
                className="my-5"
                name="description"
                value={documentData.description}
                onChange={handleData}
              />
            </div>
            <div>
              <h1>Select associated product(s)</h1>
              <div className="gap-x-6 gap-y-2 flex flex-wrap my-1">
                {companyProducts.map((item, index) => (
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

            <div className="w-[50%] px-5 space-y-1"></div>
          </div>
          <div className="text-right">
            <Button
              onClick={() => {
                router.push("/vendor/document");
              }}
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
              className="rounded bg-btn-primary text-white"
              isDisabled={!documentData?.title || !documentData?.description}
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
