// import React, { useState, useEffect } from "react";
// import { Select, SelectItem } from "@nextui-org/react";
// import { Input, Textarea, Button } from "@nextui-org/react";
// import { useCookies } from "react-cookie";
// import { useRouter } from "next/router";
// import { Checkbox } from "@nextui-org/react";
// import { useDropzone } from "react-dropzone";
// import { DatePicker } from "@nextui-org/react";
// import { now, getLocalTimeZone } from "@internationalized/date";
// import { handleResponse } from "@/helper";
// import Dropzone from "react-dropzone";
// import { toast } from "react-toastify";
// import { handleDownload } from "@/helper";

// const UpdateComponent = () => {
//   const languageOptions = [
//     { key: "French", label: "French" },
//     { key: "English", label: "English" },
//     { key: "Spanish", label: "Spanish" },
//     { key: "German", label: "German" },
//   ];

//   const reIndexationMethods = [
//     { key: "weekly", label: "Weekly" },
//     { key: "monthly", label: "Monthly" },
//     { key: "quarterly", label: "Quarterly" },
//     { key: "onDemand", label: "On demand" },
//     { key: "manual", label: "Manual" },
//   ];

//   const [dataLoaded, setDataIsLoaded] = useState(true);
//   const [companyProducts, setCompanyProducts] = useState([]);
//   const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
//   const cookiesData = cookies.myCookie;
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//   const router = useRouter();
//   const { id } = router.query;
//   const [IsIndexing, setIndexing] = useState(false);
//   const [onlineResource, setOnlineResource] = useState({
//     title: "",
//     url: "",
//     file: "",
//     productIds: [],
//     updated: now(getLocalTimeZone()),
//     indexing: "",
//     language: "",
//   });

//   const handleDrop = (acceptedFiles) => {
//     console.log("acceptedFiles[0]", acceptedFiles[0]);
//     setOnlineResource({
//       ...onlineResource,
//       file: acceptedFiles[0], // Correctly set the file property
//     });
//   };

//   const getCompanyProducts = async () => {
//     const token = cookiesData?.token;
//     const companyId = cookiesData?.companyId;
//     const requestOptions = {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       redirect: "follow",
//     };
//     fetch(`${baseUrl}/companies/${companyId}`, requestOptions)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data) {
//           setCompanyProducts(data?.Products);
//           console.log("Products:", data?.Products);
//         } else {
//           toast.error(data?.error);
//           console.error("Error:", data);
//         }
//       })
//       .catch((error) => console.error(error));
//   };

//   useEffect(() => {
//     getCompanyProducts();
//     fetchResourceData();
//   }, [id]);

//   const handleData = (e) => {
//     const { name, value } = e.target;
//     setOnlineResource((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleCheckboxChange = (id) => {
//     setOnlineResource((prevData) => {
//       const productIds = prevData.productIds.includes(id)
//         ? prevData.productIds.filter((productId) => productId !== id)
//         : [...prevData.productIds, id];

//       return {
//         ...prevData,
//         productIds,
//       };
//     });
//   };

//   const handleIndexationMethodChange = (key) => {
//     setOnlineResource((prevData) => ({
//       ...prevData,
//       indexing: prevData.indexing === key ? "" : key,
//     }));
//   };

//   const fetchResourceData = () => {
//     if (id) {
//       setDataIsLoaded(false);
//       const token = cookiesData?.token;
//       const requestOptions = {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         redirect: "follow",
//       };
//       fetch(`${baseUrl}/resources/${id}`, requestOptions)
//         .then(async (response) => {
//           const data = await handleResponse(
//             response,
//             router,
//             cookies,
//             removeCookie
//           );
//           return {
//             status: response.status,
//             ok: response.ok,
//             data,
//           };
//         })
//         .then(({ status, ok, data }) => {
//           if (ok) {
//             setOnlineResource({
//               ...data,
//               productIds: data.Products.map((product) => product.id),
//             });
//             setDataIsLoaded(true);
//           } else {
//             toast.error(data?.error);
//             console.error("Error:", data);
//           }
//         })
//         .catch((error) => console.error(error));
//     }
//   };

//   const handleSubmit = async () => {
//     console.log(onlineResource);
//     try {
//       const formData = new FormData();

//       // Add record data
//       formData.append("id", onlineResource.id);
//       formData.append("url", onlineResource.url);
//       formData.append("title", onlineResource.title);
//       formData.append("status", onlineResource.status);
//       formData.append("error", onlineResource.error);
//       formData.append("indexing", onlineResource.indexing);

//       // Add additional data
//       formData.append("language", onlineResource.language);
//       onlineResource.productIds.forEach((id) => {
//         formData.append("productIds[]", id);
//       });

//       // Add file if exists
//       if (onlineResource.file) {
//         formData.append("file", onlineResource.file);
//       }
//       const token = cookiesData?.token;
//       const requestOptions = {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//         redirect: "follow",
//       };

//       const response = await fetch(`${baseUrl}/resources`, requestOptions);
//       const data = await handleResponse(
//         response,
//         router,
//         cookies,
//         removeCookie
//       );

//       if (response.ok) {
//         toast.success("Resource Updated");
//         router.push("/vendor/onlineResource");
//       } else {
//         toast.error(data?.error);
//         console.error("Error:", data);
//       }
//     } catch (error) {
//       console.error("Error updating Resource:", error);
//     }
//   };

//   const reIndexation = async () => {
//     setIndexing(true);
//     const token = cookiesData?.token;
//     const requestOptions = {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       redirect: "follow",
//     };

//     try {
//       const response = await fetch(
//         `${baseUrl}/resources/${id}/re-index`,
//         requestOptions
//       );
//       const data = await handleResponse(
//         response,
//         router,
//         cookies,
//         removeCookie
//       );

//       if (response.ok) {
//         setOnlineResource({
//           ...onlineResource,
//           file: data.file,
//         });
//       } else {
//         toast.error(data?.error);
//         console.error("Error:", data);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       toast.error("An unexpected error occurred.");
//     } finally {
//       setIndexing(false);
//     }
//   };

//   const getNextIndexationData = () => {
//     const updatedDate = onlineResource.indexing;
//     const updatedAt = new Date(onlineResource.updatedAt);

//     if (isNaN(updatedAt)) {
//       // Handle invalid date
//       return "Invalid Date";
//     }

//     let nextIndexationDate = new Date(updatedAt);
//     switch (updatedDate) {
//       case "Weekly":
//         nextIndexationDate.setDate(nextIndexationDate.getDate() + 7);
//         break;
//       case "Monthly":
//         nextIndexationDate.setMonth(nextIndexationDate.getMonth() + 1);
//         break;
//       case "Quarterly":
//         nextIndexationDate.setMonth(nextIndexationDate.getMonth() + 3);
//         break;
//       default:
//         // If there's no match, return the original date
//         return nextIndexationDate.toISOString().split("T")[0]; // Return the date as a string
//     }
//     return nextIndexationDate.toISOString().split("T")[0]; // Return the date as a string
//   };

//   return (
//     <div className="w-[100%] h-full">
//       {dataLoaded && (
//         <div className="w-[80%] mx-auto py-4 mt-[4rem]">
//           <div className="px-4 bg-white pb-6">
//             <h1 className="py-2 border-b-2 text-[16px] 2xl:text-[20px] font-bold">
//               Update online resource
//             </h1>
//             <div className="flex justify-between">
//               <div className="w-[45%] space-y-4 pt-3">
//                 <div>
//                   <label className="text-[16px] 2xl:text-[20px]">Title</label>
//                   <Input
//                     type="text"
//                     variant="bordered"
//                     placeholder=""
//                     size="md"
//                     name="title"
//                     value={onlineResource.title}
//                     onChange={handleData}
//                     classNames={{
//                       input: "2xl:text-[20px] text-[16px] text-gray-500",
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[16px] 2xl:text-[20px]">URL</label>
//                   <Input
//                     type="text"
//                     variant="bordered"
//                     placeholder=""
//                     size="md"
//                     name="url"
//                     isReadOnly
//                     value={onlineResource.url}
//                     onChange={handleData}
//                     classNames={{
//                       input: "2xl:text-[20px] text-[16px] text-gray-500",
//                     }}
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <label className="text-[16px] 2xl:text-[20px]">
//                     Docx file
//                   </label>
//                   <Dropzone onDrop={handleDrop}>
//                     {({ getRootProps, getInputProps }) => (
//                       <div
//                         {...getRootProps()}
//                         className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-100 cursor-pointer"
//                       >
//                         <input {...getInputProps()} />
//                         <p className="text-center text-blue-700 font-bold italic 2xl:text-[20px] ">
//                           <div className="text-gray-700 "
//                           onClick={()=>handleDownload(onlineResource.file)}
                          
//                           >
//                             Click here to download File
//                           </div>
//                           {typeof onlineResource.file === "object" &&
//                           onlineResource.file !== null
//                             ? onlineResource.file.name
//                             : onlineResource.file?.split("/").pop() ||
//                               "Drop file or click here to upload docx"}
//                         </p>
//                       </div>
//                     )}
//                   </Dropzone>
//                 </div>
//                 <div>
//                   <label className="text-[16px] 2xl:text-[20px]">
//                     Associated Products
//                   </label>
//                   <div className="gap-x-6 gap-y-2 flex flex-wrap my-1">
//                     {companyProducts?.map((item, index) => (
//                       <Checkbox
//                         key={index}
//                         isSelected={onlineResource.productIds.includes(item.id)}
//                         onChange={() => handleCheckboxChange(item.id)}
//                         className="2xl:text-[20px] !text-[50px]"
//                         radius="none"
//                         size="lg"
//                         classNames={{ wrapper: "!rounded-[3px]" }}
//                       >
//                         {item.name}
//                       </Checkbox>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-[16px] 2xl:text-[20px]">
//                     Language
//                   </label>
//                   <Select
//                     variant="bordered"
//                     className="w-full bg-transparent text-[15px]"
//                     size="md"
//                     placeholder="language"
//                     name="language"
//                     value={onlineResource.language}
//                     onChange={(e) => handleData(e)}
//                     defaultSelectedKeys={
//                       onlineResource.language ? [onlineResource.language] : []
//                     }
//                     classNames={{ value: "text-[16px] 2xl:text-[20px]" }}
//                   >
//                     {languageOptions?.map((option) => (
//                       <SelectItem
//                         key={option.key}
//                         value={option.key}
//                         classNames={{ title: "text-[16px] 2xl:text-[20px]" }}
//                       >
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </Select>
//                 </div>
//               </div>
//               <div className="w-[45%] space-y-4 pt-3">
//                 <div>
//                   <label className="text-[16px] 2xl:text-[20px]">
//                     Last Indexation Date {onlineResource.updatedAt}
//                   </label>
//                   <div className="">
//                     <input
//                       type="date"
//                       value={
//                         onlineResource.updatedAt
//                           ? new Date(onlineResource.updatedAt)
//                               .toISOString()
//                               .split("T")[0]
//                           : ""
//                       }
//                       className="border-2 px-2 text-gray-500 w-full py-1 border-gray-200 rounded-lg"
//                     />
//                   </div>
//                 </div>
//                 {onlineResource.indexing !== "On demand" &&
//                   onlineResource.indexing !== "Manual" && (
//                     <div>
//                       <label className="text-[16px] 2xl:text-[20px]">
//                         Next Indexation Date
//                       </label>
//                       <div className="">
//                         <input
//                           type="date"
//                           value={getNextIndexationData()}
//                           className="border-2 px-2 text-gray-500 w-full py-1 border-gray-200 rounded-lg"
//                         />
//                       </div>
//                     </div>
//                   )}

//                 <div>
//                   <label className="text-[16px] 2xl:text-[20px]">
//                     Re-indexation method
//                   </label>
//                   <div className="gap-y-2 gap-10 flex flex-wrap my-1">
//                     {reIndexationMethods?.map((item, index) => (
//                       <Checkbox
//                         key={index}
//                         isSelected={onlineResource.indexing === item.label}
//                         onChange={() =>
//                           handleIndexationMethodChange(item.label)
//                         }
//                         className="2xl:text-[20px] !text-[50px]"
//                         name="indexationMethod"
//                         radius="none"
//                         size="lg"
//                         classNames={{ wrapper: "!rounded-[3px]" }}
//                       >
//                         {item.label}
//                       </Checkbox>
//                     ))}
//                   </div>

//                   {onlineResource.indexing === "On demand" && (
//                     <Button
//                       radius="none"
//                       size="sm"
//                       className="text-white text-sm 2xl:text-[20px] bg-btn-primary w-max rounded-[4px] my-4"
//                       onClick={reIndexation}
//                     >
//                       {IsIndexing ? "Indexing..." : " Start Indexation"}
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end mt-4 gap-3">
//               <Button
//                 size="md"
//                 className="rounded-md 2xl:text-[20px] cursor-pointer bg-red-200 py-0 text-red-500 text-[13px] font-semibold"
//                 onClick={() => router.push("/vendor/onlineResource")}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 size="md"
//                 color="primary"
//                 className="rounded-md 2xl:text-[20px] cursor-pointer text-[13px] font-semibold"
//                 onClick={handleSubmit}
//               >
//                 Update
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpdateComponent;


import React, { useState, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { Input, Textarea, Button, Checkbox } from "@nextui-org/react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { DatePicker } from "@nextui-org/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import { handleResponse } from "@/helper";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { handleDownload } from "@/helper";

const UpdateComponent = () => {
  const languageOptions = [
    { key: "French", label: "French" },
    { key: "English", label: "English" },
    { key: "Spanish", label: "Spanish" },
    { key: "German", label: "German" },
  ];

  const reIndexationMethods = [
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "quarterly", label: "Quarterly" },
    { key: "onDemand", label: "On demand" },
    { key: "manual", label: "Manual" },
  ];

  const [dataLoaded, setDataIsLoaded] = useState(false);
  const [companyProducts, setCompanyProducts] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { id } = router.query;
  const [IsIndexing, setIndexing] = useState(false);
  const [onlineResource, setOnlineResource] = useState({
    title: "",
    url: "",
    file: "",
    productIds: [],
    updated: now(getLocalTimeZone()),
    indexing: "",
    language: "",
  });

  const handleDrop = (acceptedFiles) => {
    setOnlineResource((prevData) => ({
      ...prevData,
      file: acceptedFiles[0],
    }));
  };

  const getCompanyProducts = async () => {
    const token = cookiesData?.token;
    const companyId = cookiesData?.companyId;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };
    fetch(`${baseUrl}/companies/${companyId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setCompanyProducts(data?.Products);
        } else {
          toast.error(data?.error);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (id) {
      getCompanyProducts();
      fetchResourceData();
    }
  }, [id]);

  const handleData = (e) => {
    const { name, value } = e.target;
    setOnlineResource((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (id) => {
    setOnlineResource((prevData) => {
      const productIds = prevData.productIds.includes(id)
        ? prevData.productIds.filter((productId) => productId !== id)
        : [...prevData.productIds, id];

      return {
        ...prevData,
        productIds,
      };
    });
  };

  const handleIndexationMethodChange = (key) => {
    setOnlineResource((prevData) => ({
      ...prevData,
      indexing: prevData.indexing === key ? "" : key,
    }));
  };

  const fetchResourceData = () => {
    if (id) {
      setDataIsLoaded(false);
      const token = cookiesData?.token;
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
      };
      fetch(`${baseUrl}/resources/${id}`, requestOptions)
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
            setOnlineResource({
              ...data,
              productIds: data.Products.map((product) => product.id),
            });
            setDataIsLoaded(true);
          } else {
            toast.error(data?.error);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("id", onlineResource.id);
      formData.append("url", onlineResource.url);
      formData.append("title", onlineResource.title);
      formData.append("status", onlineResource.status);
      formData.append("error", onlineResource.error);
      formData.append("indexing", onlineResource.indexing);
      formData.append("language", onlineResource.language);
      onlineResource.productIds.forEach((id) => {
        formData.append("productIds[]", id);
      });
      if (onlineResource.file) {
        formData.append("file", onlineResource.file);
      }
      const token = cookiesData?.token;
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        redirect: "follow",
      };

      const response = await fetch(`${baseUrl}/resources`, requestOptions);
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );

      if (response.ok) {
        toast.success("Resource Updated");
        router.push("/vendor/onlineResource");
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error updating Resource:", error);
    }
  };

  const reIndexation = async () => {
    setIndexing(true);
    const token = cookiesData?.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}/resources/${id}/re-index`,
        requestOptions
      );
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );

      if (response.ok) {
        setOnlineResource((prevData) => ({
          ...prevData,
          file: data.file,
        }));
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIndexing(false);
    }
  };

  const getNextIndexationData = () => {
    const updatedDate = onlineResource.indexing;
    const updatedAt = new Date(onlineResource.updatedAt);

    if (isNaN(updatedAt)) {
      return "Invalid Date";
    }

    let nextIndexationDate = new Date(updatedAt);
    switch (updatedDate) {
      case "Weekly":
        nextIndexationDate.setDate(nextIndexationDate.getDate() + 7);
        break;
      case "Monthly":
        nextIndexationDate.setMonth(nextIndexationDate.getMonth() + 1);
        break;
      case "Quarterly":
        nextIndexationDate.setMonth(nextIndexationDate.getMonth() + 3);
        break;
      default:
        return nextIndexationDate.toISOString().split("T")[0];
    }
    return nextIndexationDate.toISOString().split("T")[0];
  };

  return (
    <div className="w-[100%] h-full">
      {dataLoaded && (
        <div className="w-[80%] mx-auto py-4 mt-[4rem]">
          <div className="px-4 bg-white pb-6">
            <h1 className="py-2 border-b-2 text-[16px] 2xl:text-[20px] font-bold">
              Update online resource
            </h1>
            <div className="flex justify-between">
              <div className="w-[45%] space-y-4 pt-3">
                <div>
                  <label className="text-[16px] 2xl:text-[20px]">Title</label>
                  <Input
                    type="text"
                    variant="bordered"
                    placeholder=""
                    size="md"
                    name="title"
                    value={onlineResource.title}
                    onChange={handleData}
                    classNames={{
                      input: "2xl:text-[20px] text-[16px] text-gray-500",
                    }}
                  />
                </div>
                <div>
                  <label className="text-[16px] 2xl:text-[20px]">URL</label>
                  <Input
                    type="text"
                    variant="bordered"
                    placeholder=""
                    size="md"
                    name="url"
                    isReadOnly
                    value={onlineResource.url}
                    onChange={handleData}
                    classNames={{
                      input: "2xl:text-[20px] text-[16px] text-gray-500",
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[16px] 2xl:text-[20px]">Docx file</label>
                  <Dropzone onDrop={handleDrop}>
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps()}
                        className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-100 cursor-pointer"
                      >
                        <input {...getInputProps()} />
                        <p className="text-center text-blue-700 font-bold italic 2xl:text-[20px] ">
                          {onlineResource.indexing == "Manual" ||
                  onlineResource.indexing == "On demand" ||
                 (

                    <div
                    className="text-gray-700"
                    onClick={() => handleDownload(onlineResource.file)}
                  >
                    Click here to download File
                  </div>
                  )}
                          {typeof onlineResource.file === "object" &&
                          onlineResource.file !== null
                            ? onlineResource.file.name
                            : onlineResource.file?.split("/").pop() ||
                              "Drop file or click here to upload docx"}
                        </p>
                      </div>
                    )}
                  </Dropzone>
                </div>
                <div>
                  <label className="text-[16px] 2xl:text-[20px]">
                    Associated Products
                  </label>
                  <div className="gap-x-6 gap-y-2 flex flex-wrap my-1">
                    {companyProducts?.map((item, index) => (
                      <Checkbox
                        key={index}
                        isSelected={onlineResource.productIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                        className="2xl:text-[20px] !text-[50px]"
                        radius="none"
                        size="lg"
                        classNames={{ wrapper: "!rounded-[3px]" }}
                      >
                        {item.name}
                      </Checkbox>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[16px] 2xl:text-[20px]">Language</label>
                  <Select
                    variant="bordered"
                    className="w-full bg-transparent text-[15px]"
                    size="md"
                    placeholder="language"
                    name="language"
                    value={onlineResource.language}
                    onChange={(e) => handleData(e)}
                    defaultSelectedKeys={
                      onlineResource.language ? [onlineResource.language] : []
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
                  </Select>
                </div>
              </div>
              <div className="w-[45%] space-y-4 pt-3">
                <div>
                  <label className="text-[16px] 2xl:text-[20px]">
                    Last Indexation Date {onlineResource.updatedAt}
                  </label>
                  <div className="">
                    <input
                      type="date"
                      value={
                        onlineResource.updatedAt
                          ? new Date(onlineResource.updatedAt)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      className="border-2 px-2 text-gray-500 w-full py-1 border-gray-200 rounded-lg"
                      readOnly
                    />
                  </div>
                </div>
                {onlineResource.indexing !== "On demand" &&
                  onlineResource.indexing !== "Manual" && (
                    <div>
                      <label className="text-[16px] 2xl:text-[20px]">
                        Next Indexation Date
                      </label>
                      <div className="">
                        <input
                          type="date"
                          value={getNextIndexationData()}
                          className="border-2 px-2 text-gray-500 w-full py-1 border-gray-200 rounded-lg"
                          readOnly
                        />
                      </div>
                    </div>
                  )}

                <div>
                  <label className="text-[16px] 2xl:text-[20px]">
                    Re-indexation method
                  </label>
                  <div className="gap-y-2 gap-10 flex flex-wrap my-1">
                    {reIndexationMethods?.map((item, index) => (
                      <Checkbox
                        key={index}
                        isSelected={onlineResource.indexing === item.label}
                        onChange={() =>
                          handleIndexationMethodChange(item.label)
                        }
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

                  {onlineResource.indexing === "On demand" && (
                    <Button
                      radius="none"
                      size="sm"
                      className="text-white text-sm 2xl:text-[20px] bg-btn-primary w-max rounded-[4px] my-4"
                      onClick={reIndexation}
                    >
                      {IsIndexing ? "Indexing..." : " Start Indexation"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-3">
              <Button
                size="md"
                className="rounded-md 2xl:text-[20px] cursor-pointer bg-red-200 py-0 text-red-500 text-[13px] font-semibold"
                onClick={() => router.push("/vendor/onlineResource")}
              >
                Cancel
              </Button>
              <Button
                size="md"
                color="primary"
                className="rounded-md 2xl:text-[20px] cursor-pointer text-[13px] font-semibold"
                onClick={handleSubmit}
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

export default UpdateComponent;
