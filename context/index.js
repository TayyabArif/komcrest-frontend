// context/MyContext.js
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { handleResponse } from "@/helper";
import { useCookies } from "react-cookie";
import useSocket from "@/customHook/useSocket";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const socket = useSocket();
  const [overAllLoading, setOverAllLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const companyId = cookiesData?.companyId;
  const userId = cookiesData?.userId;
  const token = cookiesData && cookiesData.token;
  const companyType = cookiesData && cookiesData.companyType
  const [dataUpdated, setDataUpdated] = useState(false);
  const [questionnaireUpdated, setQuestionnaireUpdated] = useState(false);
  const [onlineResourceData, setOnlineResourceData] = useState([]);
  const [onlineResourceDataUpdate, setOnlineResourceDataUpdate] =
    useState(false);
  const [documentData, setDocumentData] = useState([]);
  const [documentDataUpdate, setDocumentDataUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [realFormatCompanyUserData, setRealFormatCompanyUserData] = useState(
    []
  );
  const [plansData, setPlansData] = useState([]);
  const [activePlanDetail, setActivePlanDetail] = useState({});
  const [reCallPlanDetailApi, setReCallPlanDetailApi] = useState(false);

  // knowledge base module states
  const [knowledgeBasePayloadData, setKnowledgeBasePayloadData] = useState({});
  const [knowledgeBaseStepperStart, setKnowledgeBaseStepperStart] = useState(0);
  const [isKnowledgeBaseOpenDirect, setIsKnowledgeBaseOpenDirect] =
    useState(true);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [isFetchingAllQuestionnaire, setIsFetchingAllQuestionnaire] =
    useState(false);

  // questionnaire module states
  const [questionnaireData, setQuestionnaireData] = useState({
    filename: "",
    customerName: "",
  });
  const [questionList, setQuestionList] = useState([]);

  const [allQuestionnaireList, setAllQuestionnireList] = useState(() => {
    if (typeof window !== "undefined") {
      const storedQuestions = sessionStorage.getItem("questions");
      console.log("MMMMM", storedQuestions);
  
      if (storedQuestions === null || storedQuestions === undefined) {
        console.log("Session storage key 'questions' does not exist.");
        return [];
      } else {
        try {
          return JSON.parse(storedQuestions);
        } catch (error) {
          console.error("Error parsing sessionStorage data:", error);
          return [];
        }
      }
    }
    return [];
  });
  
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isFirstResponse, setIsFirstResponse] = useState(true);
  const isFirstResponseRef = useRef(isFirstResponse);
  const [currentQuestionnaireImportId, setCurrentQuestionnaireImportId] =
    useState();

  useEffect(() => {
    isFirstResponseRef.current = isFirstResponse;
  }, [isFirstResponse]);

  useEffect(() => {
    if (questionList && questionList.length > 0) {
      setAllQuestionnireList(questionList);
    }
  }, [questionList]);

  // all states

  // company user except loggedin user
  const [companyUserData, setCompanyUserData] = useState([]);
  //all compnay user include loggedin user
  const [allCompanyUserData, setAllCompanyUserData] = useState([]);
  const [companyProducts, setCompanyProducts] = useState([]);
  const [allCompanyProducts, setAllCompanyProducts] = useState([]);
  const [questionnaireList, setQuestionnaireList] = useState([]);

  useEffect(() => {
    if (token) {
      getCompanyUser();
      // getUserCompanyProducts();
      getAllCompanyProducts();
    }
  }, [dataUpdated]);

  const getCompanyUser = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}/get-company-users`,
        requestOptions
      );
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        //remove unapproved user
        setRealFormatCompanyUserData(data);
        const approvedUser = data.filter(
          (user) => user.invitationStatus == "activated"
        );

        const curatorOptions = approvedUser.map((item) => ({
          value: item.id,
          label: item.firstName,
        }));
        setAllCompanyUserData(curatorOptions);
        // remover login user

        const filterData = () => {
          return curatorOptions.filter((user) => user.value !== userId);
        };
        setCompanyUserData(filterData);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching user documents:", error);
    }
  };

  // const getUserCompanyProducts = async () => {
  //   const requestOptions = {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     redirect: "follow",
  //   };
  //   fetch(`${baseUrl}/user/products`, requestOptions)
  //     .then(async (response) => {
  //       const data = await handleResponse(
  //         response,
  //         router,
  //         cookies,
  //         removeCookie
  //       );
  //       return {
  //         status: response.status,
  //         ok: response.ok,
  //         data,
  //       };
  //     })
  //     .then(({ status, ok, data }) => {
  //       if (ok) {
  //         setCompanyProducts(data);
  //       } else {
  //         toast.error(data?.error);
  //         console.error("Error:", data);
  //       }
  //     })
  //     .catch((error) => console.error(error));
  // };

  const getAllCompanyProducts = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };
    fetch(`${baseUrl}/companies/${companyId}`, requestOptions)
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
          setAllCompanyProducts(data?.Products);
          setCompanyProducts(data?.Products);
        } else {
          toast.error(data?.error);
          console.error("Error:", data);
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchAllQuestionnaires = async () => {
    // setOverAllLoading(true);
    setIsFetchingAllQuestionnaire(true);
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
        `${baseUrl}/questionnaires/filtered`,
        requestOptions
      );
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        setQuestionnaireList(data.questionnaires);
        // setDataLoaded(true)
        // console.log("000000000",data.questionnaires)
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching Questionnaire:", error);
    } finally {
      setOverAllLoading(false);
      setIsFetchingAllQuestionnaire(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchAllQuestionnaires();
    }
  }, [questionnaireUpdated]);

  socket?.on("Question", (questionnaireRecord) => {
    const currentQuestionnaireImportId = sessionStorage.getItem(
      "CurrentQuestionnaireImportId"
    );
    if (!currentQuestionnaireImportId) {
      console.log("save in localstorage");
      setQuestionnaireUpdated((prev) => !prev);
      sessionStorage.setItem(
        "QuestionnaireId",
        questionnaireRecord.questionnaireId
      );
      sessionStorage.setItem(
        "CurrentQuestionnaireImportId",
        questionnaireRecord.questionnaireId
      );
      router.push(
        `/vendor/questionnaires/view?name=${questionnaireData.customerName}`
      );
    }
    setAllQuestionnireList((prevState) => {
      // Map over the previous state to update it with the new incoming data
      let updateData = prevState?.map((data) =>
        data.Question === questionnaireRecord.question
          ? {
              ...data,
              compliance: questionnaireRecord.compliance,
              answer: questionnaireRecord.answer,
            }
          : data
      );
      // Return the updated state
      // if (updateData !== undefined && updateData !== null) {
      sessionStorage.setItem("questions", JSON.stringify(updateData));
      // }
      return updateData;
    });
  });

  socket?.on("AllAnswersDone", (data) => {
    sessionStorage.removeItem("CurrentQuestionnaireImportId");
    setQuestionnaireUpdated((prev) => !prev);
    setReCallPlanDetailApi((prev) => !prev);
    sessionStorage.setItem("QuestionnaireId", data?.fullQuestionnaire?.id);
    sessionStorage.removeItem("questions");
    window.location.href = `/vendor/questionnaires/view?name=${data?.fullQuestionnaire?.customerName}`;
  });

  socket?.on("errorInQuestionnaire", (data) => {
    sessionStorage.removeItem("CurrentQuestionnaireImportId");
    setQuestionnaireUpdated((prev) => !prev);
    setReCallPlanDetailApi((prev) => !prev);
    sessionStorage.removeItem("questions");
    // toast.error("Error Please try again")
    router.push("/vendor/questionnaires");
  });

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = cookiesData.token;

    let requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/file-upload`, requestOptions);
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );

      if (response.ok) {
        console.log("File uploaded successfully:", data);
        return data.filePath;
      } else {
        console.error("File upload failed:", data);
        return null;
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("An error occurred while uploading the file. Try Again");
      return null;
    }
  };

  const getAllResourceData = async () => {
    setIsLoading(true);
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/resources`, requestOptions);
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        setOnlineResourceData(data);
      } else {
        toast.error(data?.error);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching user documents:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getAllResourceData();
    }
  }, [onlineResourceDataUpdate, dataUpdated]);

  useEffect(() => {
    const getUserDocument = async () => {
      setIsLoading(true);
      const token = cookiesData && cookiesData.token;
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
      };

      try {
        const response = await fetch(`${baseUrl}/documents`, requestOptions);
        const data = await handleResponse(
          response,
          router,
          cookies,
          removeCookie
        );
        // const data = await response.json();
        if (response.ok) {
          setDocumentData(data);
          setDataIsLoaded(true);
        } else {
          toast.error(data?.error);
        }
      } catch (error) {
        console.error("Error fetching user documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      getUserDocument();
    }
  }, [documentDataUpdate, dataUpdated]);

  const questionnaireStatusUpdated = (value, id) => {
    const jsonPayload = JSON.stringify({
      status: value,
    });
    const token = cookiesData.token;
    let requestOptions = {
      method: "PATCH",
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
          setQuestionnaireUpdated((prev) => !prev);
          setDataUpdate((prev) => !prev);
        } else {
          toast.error(data?.error || "Questionnaires status not Updated");
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

  const removeCompanyUser = async (selectedId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const token = cookiesData.token;
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    fetch(`${baseUrl}/users/${selectedId}`, requestOptions)
      .then((response) => {
        return {
          status: response.status,
          ok: response.ok,
        };
      })
      .then(({ status, ok }) => {
        if (ok) {
          toast.success("User deleted successfully");
          setDataUpdated((prev) => !prev);
          router.push("/vendor/setting/user-management");
        } else {
          toast.error("Error While deactivating company");
        }
      })
      .catch((error) => console.error(error));
  };

  const getPlansData = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/plans`, requestOptions);
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        setPlansData(data);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching user documents:", error);
    }
  };

  useEffect(() => {
    getPlansData();
  }, []);

  const checkAccountLimitation = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };
    fetch(`${baseUrl}/company/check-question-limit`, requestOptions)
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
          setActivePlanDetail(data);
          console.log("}}}}}}}}}}}}}}}", data);
        } else {
          toast.error(data?.error);
          console.error("Error:", data);
        }
      })
      .catch((error) => {
        console.error("Error occurred: ", error);
        setActivePlanDetail({});
      });
  };

  useEffect(() => {
    if(companyType && companyType == "vendor"){
      checkAccountLimitation();
    }
  }, [reCallPlanDetailApi]);

  const handleCreateCheckout = async (data) => {
    try {
      // setIsLoading({
      //   success: true,
      //   id: data.id
      // })
      setIsLoading(true);
      const item = {
        priceId:
          data?.billingCycle === "monthly"
            ? data?.monthlyStripePriceId
            : data?.yearlyStripePriceId,
        billingCycle: data?.billingCycle,
        plan_id: data?.id,
      };
      const token = cookiesData?.token;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item }),
        redirect: "follow",
      };

      const response = await fetch(
        `${baseUrl}/stripe/create-checkout`,
        requestOptions
      );

      const createdSession = await response.json();
      if (response.ok) {
        // toast.success(data.message);
        console.log(">>>>>>>>>>>>", createdSession?.session?.url);
        window.open(createdSession?.session?.url, "_blank");
      } else {
        toast.error(createdSession?.message);
      }
    } catch (error) {
      toast.error("error");
      console.error("Error updating Resource:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const s3FileDownload = async (filePath, getSignedURL) => {
    const token = cookiesData?.token;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ filePath }),
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/file-download`, requestOptions);
      const data = await response.json();

      if (response.ok) {
        if (getSignedURL) {
          return data.url; // Return the signed URL
        } else {
          // Direct file download
          const parts = filePath.split("/");
          const fileName = parts[parts.length - 1];
          const fileResponse = await fetch(data.url);
          const blob = await fileResponse.blob();
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          toast.success("File Downloaded");
          link.click();
          link.remove();
        }
      } else {
        toast.error(data?.error);
        return null; // Return null on error
      }
    } catch (error) {
      console.error(error);
      return null; // Handle errors gracefully
    }
  };

  return (
    <MyContext.Provider
      value={{
        overAllLoading,
        setOverAllLoading,
        companyUserData,
        companyProducts,
        setDataUpdated,
        dataUpdated,
        questionnaireList,
        setQuestionnaireList,
        setQuestionnaireUpdated,
        allCompanyUserData,
        setQuestionList,
        questionList,
        questionnaireData,
        setQuestionnaireData,
        allQuestionnaireList,
        setIsSocketConnected,
        currentQuestionnaireImportId,
        setCurrentQuestionnaireImportId,
        onlineResourceData,
        setOnlineResourceData,
        setOnlineResourceDataUpdate,
        isLoading,
        documentData,
        setDocumentData,
        setDocumentDataUpdate,
        dataIsLoaded,
        setIsFirstResponse,
        knowledgeBasePayloadData,
        setKnowledgeBasePayloadData,
        knowledgeBaseStepperStart,
        setKnowledgeBaseStepperStart,
        isKnowledgeBaseOpenDirect,
        setIsKnowledgeBaseOpenDirect,
        questionnaireStatusUpdated,
        dataUpdate,
        setDataUpdate,
        realFormatCompanyUserData,
        removeCompanyUser,
        allCompanyProducts,
        plansData,
        activePlanDetail,
        setReCallPlanDetailApi,
        handleCreateCheckout,
        s3FileDownload,
        uploadFile,
        isFetchingAllQuestionnaire,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
