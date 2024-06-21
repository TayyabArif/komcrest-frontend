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

  const [cookies] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [companyProducts, setCompanyProducts] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [dataIsLoaded , setDataIsLoaded] = useState(false)

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

  const handleCheckboxChange = (id) => {
    setDocumentData((prevData) => {
      const productIds = prevData.productIds.includes(id)
        ? prevData.productIds.filter((productId) => productId !== id)
        : [...prevData.productIds, id];

      return {
        ...prevData,
        productIds,
      };
    });
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
            setDocumentData({
              ...data,
              productIds: data.Products.map((product) => product.id),
            });
            setDataIsLoaded(true)
          } else {
            toast.error(data?.error);
            console.error("Error:", data);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [id]);

  const isDescriptionInvalid = React.useMemo(() => {
    if (documentData.description === "") return false;
    return documentData.description.length > 100;
  }, [documentData.description]);

  const isTitleInvalid = React.useMemo(() => {
    if (documentData.title === "") return false;
    return documentData.title.length > 50;
  }, [documentData.title]);

  return (
    <div className="w-[100%] h-full">
      <div className="w-[80%] mx-auto py-4 mt-[4rem]">
        <h1 className="font-semibold bg-slate-50 px-4 py-1 2xl:text-[20px]">Dropzone</h1>
        <div className="px-4 bg-white pb-6">
          <h1 className="py-1 border-b-2 text-[16px] 2xl:text-[20px]">{id ? "Update Document" :"Add New Document"}</h1>
          <div className="my-3">
            <div className="flex  space-y-3 items-center gap-2">
              <div className="w-[50%]">
                <p className="text-[15px] leading-5 2xl:text-[20px]">
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
                  className="flex justify-center items-center border-2  border-dashed border-gray-300 rounded-lg p-10 bg-gray-100 cursor-pointer"
                >
                  <input {...getInputProps()} />
                  {documentData.file ? (
                    <div className="mt-2">
                      <p>{documentData.file.name}</p>
                    </div>
                  ) : (
                    <p className="text-center text-gray-700 font-bold italic 2xl:text-[20px]">
                      Drop file or click here to upload file
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex my-2 mt-4 justify-between gap-4">
              <div className="w-[50%]">
                <label className="text-[16px] 2xl:text-[20px]">Title</label>
                <Input
                  type="text"
                  variant="bordered"
                  size="sm"
                  name="title"
                  isInvalid={isTitleInvalid}
                  color={isTitleInvalid ? "danger" : ""}
                  errorMessage="Title Should be less than 50 words"
                  value={documentData.title}
                  onChange={handleData}
                />
              </div>

              <div className="w-[50%]">
                <label className="text-[16px] 2xl:text-[20px]">Document link</label>
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

            <div className="my-2 w-[49%]">
              <label className="text-[16px] 2xl:text-[20px]">Description</label>
              <Textarea
                variant="bordered"
                size="sm"
                isInvalid={isDescriptionInvalid}
                color={isDescriptionInvalid ? "danger" : ""}
                errorMessage="Description Should be less than 100 words"
                name="description"
                value={documentData.description}
                onChange={handleData}
              />
            </div>
            <div>
          <h1 className="text-[16px] 2xl:text-[20px]">Select associated product(s)</h1>
          <div className="gap-x-6 gap-y-2 flex flex-wrap my-1 ">
            {companyProducts.map((item, index) => (
              <Checkbox
                key={index}
                radius="sm"
                // isSelected={item.check}
                isSelected={documentData.productIds.includes(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
                className="2xl:text-[20px]"
              >
                {item.name}
              </Checkbox>
            ))}
          </div>
        </div>
            <div className="flex justify-end mt-4 ">
              <Button color="primary" onPress={SubmitDocument} className="rounded-md 2xl:text-[20px]">
                {id ? "Update Document" : "Add Document"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDocument;
