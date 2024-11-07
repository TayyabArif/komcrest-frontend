// context/MyContext.js
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { handleResponse } from "@/helper";
import { useCookies } from "react-cookie";
import useSocket from "@/customHook/useSocket";

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const socket = useSocket();

  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const companyId = cookiesData?.companyId;
  const userId = cookiesData?.userId;
  const token = cookiesData && cookiesData.token;
  const [dataUpdated, setDataUpdated] = useState(false);
  const [questionnaireUpdated, setQuestionnaireUpdated] = useState(false);

  const [questionnaireData, setQuestionnaireData] = useState({
    filename: "",
    customerName: "",
  });
  const [questionList, setQuestionList] = useState([]);
  const [allQuestionnaireList, setAllQuestionnireList] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isFirstResponse, setIsFirstResponse] = useState(true);
  const isFirstResponseRef = useRef(isFirstResponse);
  const [currentQuestionnaireImportId , setCurrentQuestionnaireImportId] = useState()

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
  const [questionnaireList, setQuestionnaireList] = useState([]);

  useEffect(() => {
    if (token) {
      getCompanyUser();
      getCompanyProducts();
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

  const getCompanyProducts = async () => {
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
          setCurrentQuestionnaireImportId(questionnaireRecord.questionnaireId)
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

  return (
    <MyContext.Provider
      value={{
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
        setCurrentQuestionnaireImportId
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
