// context/MyContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { handleResponse } from '@/helper';
import { useCookies } from "react-cookie";


const MyContext = createContext();

export const MyProvider = ({ children }) => {

    const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
    const cookiesData = cookies.myCookie;
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const router = useRouter();
    const companyId = cookiesData?.companyId;
    const userId = cookiesData?.userId;
    const token = cookiesData && cookiesData.token;
    const [dataUpdated ,setDataUpdated] = useState(false)
    const [questionnaireUpdated ,setQuestionnaireUpdated] = useState(false)

   // all states
    const [companyUserData, setCompanyUserData] = useState([]);
    const [companyProducts, setCompanyProducts] = useState([]);
    const [questionnaireList , setQuestionnaireList] = useState([])
  


  useEffect(()=>{
    if(token){
      getCompanyUser()
      getCompanyProducts()
    }
   
  },[dataUpdated])

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
        const curatorOptions = data.map((item) => ({
            value: item.id,
            label: item.firstName,
        }));

        // remover login user and save

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
      const response = await fetch(`${baseUrl}/questionnaires/filtered`, requestOptions);
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        setQuestionnaireList(data.questionnaires);
        // setDataLoaded(true)
        console.log("000000000",data.questionnaires)

      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching Questionnaire:", error);
    }
  };
  useEffect(()=>{
    fetchAllQuestionnaires()
  },[questionnaireUpdated])


  return (
    <MyContext.Provider value={{ companyUserData ,companyProducts ,setDataUpdated ,dataUpdated , questionnaireList,setQuestionnaireList ,setQuestionnaireUpdated }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
