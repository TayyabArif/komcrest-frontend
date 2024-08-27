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
    const token = cookiesData && cookiesData.token;
    const [dataUpdated ,setDataUpdated] = useState(false)

   // all states
    const [companyUserData, setCompanyUserData] = useState([]);
    const [companyProducts, setCompanyProducts] = useState([]);


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
        setCompanyUserData(curatorOptions);
        console.log("user Listttttttttttttttttttttttt,", curatorOptions);
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

  return (
    <MyContext.Provider value={{ companyUserData ,companyProducts ,setDataUpdated ,dataUpdated }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
