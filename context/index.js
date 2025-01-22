// context/MyContext.js
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { handleResponse } from "@/helper";
import { useCookies } from "react-cookie";
import useSocket from "@/customHook/useSocket";
import { toast } from "react-toastify";

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
  const [activePlanDetail , setActivePlanDetail] = useState({})
  const [reCallPlanDetailApi , setReCallPlanDetailApi] = useState(false)

  // knowledge base module states
  const [knowledgeBasePayloadData, setKnowledgeBasePayloadData] = useState({});
  const [knowledgeBaseStepperStart, setKnowledgeBaseStepperStart] = useState(0);
  const [isKnowledgeBaseOpenDirect, setIsKnowledgeBaseOpenDirect] =
    useState(true);
  const [dataUpdate, setDataUpdate] = useState(false);

  // questionnaire module states
  const [questionnaireData, setQuestionnaireData] = useState({
    filename: "",
    customerName: "",
  });
  const [questionList, setQuestionList] = useState([]);
  const [allQuestionnaireList, setAllQuestionnireList] = useState([]);
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
    }
  };
  useEffect(() => {
    if (token) {
      fetchAllQuestionnaires();
    }
  }, [questionnaireUpdated]);

  useEffect(() => {
    if (isSocketConnected) {
      setQuestionnaireUpdated((prev) => !prev);
      socket?.on("Question", (questionnaireRecord) => {
        console.log("::::", questionnaireRecord);
        if (isFirstResponseRef.current && questionnaireRecord.questionnaireId) {
          setIsFirstResponse(false);
          uploadFile(questionnaireRecord.questionnaireId);
          setCurrentQuestionnaireImportId(questionnaireRecord.questionnaireId);
        }
        setAllQuestionnireList((prevState) => {
          // Map over the previous state to update it with the new incoming data
          let updateData = prevState.map((data) =>
            data.Question === questionnaireRecord.question
              ? {
                  ...data,
                  compliance: questionnaireRecord.compliance,
                  answer: questionnaireRecord.answer,
                }
              : data
          );
          // Return the updated state
          return updateData;
        });
      });
    }

    // Clean up on component unmount
    return () => {
      if (socket) {
        socket.off("Question");
      }
    };
  }, [isSocketConnected]);

  // questionnaire file upload

  const uploadFile = (id) => {
    const formData = new FormData();
    formData.append("file", questionnaireData.originalFile);
    const token = cookiesData.token;
    let requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      redirect: "follow",
    };

    fetch(`${baseUrl}/questionnaire/file/${id}`, requestOptions)
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
          setQuestionnaireUpdated((prev) => !prev);
        } else {
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

  // get all online resource
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

  // get all documnets

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
          setActivePlanDetail(data)
          console.log("}}}}}}}}}}}}}}}",data);
        } else {
          toast.error(data?.error);
          console.error("Error:", data);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    checkAccountLimitation()
  },[reCallPlanDetailApi])



  const handleCreateCheckout = async (data) => {
    try {
      // setIsLoading({
      //   success: true,
      //   id: data.id
      // })
      setIsLoading(true);
      const item = {
        priceId: data?.billingCycle === "monthly" ? data?.monthlyStripePriceId : data?.yearlyStripePriceId,
        billingCycle: data?.billingCycle,
        plan_id: data?.id
      }
      const token = cookiesData?.token;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({item}),
        redirect: "follow",
      };
  
      const response = await fetch(`${baseUrl}/stripe/create-checkout`, requestOptions);
  
      const createdSession = await response.json()
      if (response.ok) {
        // toast.success(data.message);
        console.log(">>>>>>>>>>>>",createdSession?.session?.url)
        window.open(createdSession?.session?.url, "_blank");
      } else {
        toast.error(createdSession?.message);
      }
    } catch (error) {
      toast.error("error");
      console.error("Error updating Resource:", error);
    } finally{
      setIsLoading(false);
    }
  }

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
        handleCreateCheckout
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
