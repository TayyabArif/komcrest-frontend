import React, { useEffect, useState } from "react";
import { Input, Textarea, Button, Checkbox } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../helper";
import { Select, SelectItem } from "@nextui-org/react";
import { useMyContext } from "@/context";
import { addDocuments ,updateDocuments  ,singleDocument} from "@/apis/vendor/documentApis";

const language = [
  { key: "French", label: "French" },
  { key: "English", label: "English" },
  { key: "Spanish", label: "Spanish" },
  { key: "German", label: "German" },
];

const NewDocument = () => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles),
  });
  const {companyProducts } = useMyContext();
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;


  const router = useRouter();
  const { id } = router.query;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataIsLoaded, setDataIsLoaded] = useState(true);

  const [documentData, setDocumentData] = useState({
    title: "",
    description: "",
    language,
    file: null,
    productIds: [],
    documentLink: "",
  });


  useEffect(() => {
    if (companyProducts.length === 1) {
      console.log("companyProducts", companyProducts);
      setDocumentData((prev) => ({
        ...prev,
        productIds: [companyProducts[0].id], 
      }));
    }
  }, [companyProducts]);

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
    formData.append("language", documentData.language);
    try {
      let response;
      if (id) {
        response = await updateDocuments(id, formData);
      } else {
        response = await addDocuments(formData);
      }
      if (response.status === 200 || response.status === 201) {
        router.push("/vendor/document");
        toast.success(`Document ${id ? "Updated" : "Created"}`);
      } else {
        toast.error("Failed to process the document");
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error submitting document:", error);
      toast.error("An error occurred while submitting the document.");
    }
  };
  

  useEffect(() => {
    if (id) {
      setDataIsLoaded(false);
      const fetchDocument = async () => {
        try {
          const response = await singleDocument(id);
          const data = response.data;
          if (response.status === 200) {
            setDocumentData({
              ...data,
              productIds: data.Products.map((product) => product.id),
            });
            setDataIsLoaded(true);
          } else {
            toast.error(data?.error || "Failed to load document");
            console.error("Error:", data);
          }
        } catch (error) {
          toast.error("An error occurred while fetching the document.");
          console.error("Fetch document error:", error);
        }
      };
  
      fetchDocument(); 
    }
  }, [id]);

  const isDescriptionInvalid = React.useMemo(() => {
    if (documentData.description === "") return false;
    return documentData.description.length > 150;
  }, [documentData.description]);

  const isTitleInvalid = React.useMemo(() => {
    if (documentData.title === "") return false;
    return documentData.title.length > 50;
  }, [documentData.title]);

  function filePath(filePath) {
    const path = filePath.split("-");
    return path[1];
  }

  return (
    <div className="w-[100%] h-full">
      <div className="w-[80%] mx-auto py-4 mt-[4rem]">
        <h1 className="font-semibold bg-slate-50 px-4 py-1 2xl:text-[20px]">
          Dropzone
        </h1>
        {dataIsLoaded &&  <div className="px-4 bg-white pb-6">
          <h1 className="py-1 border-b-2 text-[16px] 2xl:text-[20px]">
            {id ? "Update Document" : "Add New Document"}
          </h1>
          <div className="my-3">
            <div className="flex  space-y-3 items-center gap-2">
              <div className="w-[50%]">
                <p className="text-[15px] leading-7 2xl:text-[20px]">
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
                  {documentData.file || documentData.filePath ? (
                    <div className="mt-2">
                      <p>
                        {documentData.file
                          ? documentData.file?.name
                          : filePath(documentData.filePath)}
                      </p>
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
                <label className="text-[16px] 2xl:text-[20px]">
                  Title(max 50 characters)
                </label>
                <Input
                  type="text"
                  variant="bordered"
                  size="md"
                  name="title"
                  radius="sm"
                  isInvalid={isTitleInvalid}
                  color={isTitleInvalid ? "danger" : ""}
                  errorMessage="Title should be less than 50 characters"
                  value={documentData.title}
                  onChange={handleData}
                  classNames={{
                    input: "text-base 2xl:text-[20px]",
                  }}
                />
              </div>

              <div className="w-[50%]">
                <label className="text-[16px] 2xl:text-[20px]">
                  Document link
                </label>
                <Input
                  type="text"
                  variant="bordered"
                  size="md"
                  radius="sm"
                  name="documentLink"
                  value={documentData.documentLink}
                  onChange={handleData}
                  classNames={{
                    input: "text-base 2xl:text-[20px]",
                  }}
                />
              </div>
            </div>
            <div className="flex gap-5">
              <div className="my-2 w-[49%]">
                <label className="text-[16px] 2xl:text-[20px]">
                  Description(max 150 characters)
                </label>
                <Textarea
                  variant="bordered"
                  size="sm"
                  radius="sm"
                  isInvalid={isDescriptionInvalid}
                  color={isDescriptionInvalid ? "danger" : ""}
                  errorMessage="Description should be less than 150 characters"
                  name="description"
                  value={documentData.description}
                  onChange={handleData}
                  classNames={{
                    input: "text-base 2xl:text-[20px]",
                  }}
                />
              </div>
              <div className="flex-1 mt-2">
                <label className="text-[16px] 2xl:text-[20px]">Language</label>
                <Select
                  variant="bordered"
                  className="w-full bg-transparent text-[15px]"
                  size="md"
                  radius="sm"
                  placeholder="language"
                  name="language"
                  value={documentData?.language}
                  onChange={handleData}
                  defaultSelectedKeys={
                    documentData?.language ? [documentData?.language] : []
                  }
                  classNames={{ value: "text-[16px] 2xl:text-[20px]" }}
                >
                  {language?.map((option) => (
                    <SelectItem
                      key={option.key}
                      value={option.key}
                      classNames={{ title: "text-[16px] 2xl:text-[20px]" }}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <h1 className="text-[16px] 2xl:text-[20px]">
                Select associated product(s)
              </h1>
              <div className="gap-x-6 gap-y-2 flex flex-wrap my-1 ">
                {companyProducts.map((item, index) => (
                  <Checkbox
                    key={index}
                    radius="sm"
                    size="lg"
                    // isSelected={item.check}
                    isSelected={documentData.productIds.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                    className="2xl:text-[20px] text-[16px] "
                  >
                    {item.name}
                  </Checkbox>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4  gap-3">
              <Button
                size="md"
                className="rounded-md 2xl:text-[20px] bg-red-200 py-0 text-red-500 text-[13px] font-semibold"
                onClick={() => router.push("/vendor/document")}
              >
                Cancel
              </Button>
              <Button
                size="md"
                color="primary"
                onPress={SubmitDocument}
                className="rounded-md 2xl:text-[20px]"
                isDisabled={isDescriptionInvalid || isTitleInvalid}
              >
                {id ? "Update Document" : "Add Document"}
              </Button>
            </div>
          </div>
        </div>}
       
      </div>
    </div>
  );
};

export default NewDocument;
