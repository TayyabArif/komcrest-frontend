import React, { useState, useEffect } from 'react';
import VendorLayout from "../../../components/vendor/shared/vendorLayout";
import KnowledgeHome from "../../../components/vendor/knowledge";
import KnowledgeBase from "../../../components/vendor/knowledge/knowledge-base";
import { Popover, PopoverTrigger, PopoverContent, CircularProgress } from "@nextui-org/react";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../helper";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';

const Index = () => {
  const router = useRouter();
  const [questionData, setQuestionData] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [dataLoaded, setDataLoaded] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [isDeleted , setIsDeleted] = useState(false)

  const getQuestions = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/document-files`, requestOptions);
      const data = await handleResponse(response, router, cookies, removeCookie);
      if (response.ok) {
        setQuestionData(data);
        setDataLoaded(true);
        console.log("Fetched data:", data);
      } else {
        setDataLoaded(true);
        toast.error(data?.error);
      }
    } catch (error) {
      setDataLoaded(true);
      console.error("Error fetching user documents:", error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, [isDeleted]);

  return (
    <VendorLayout>
      {dataLoaded ? (
        questionData.length > 0 ? (
          <KnowledgeBase questionData={questionData} setQuestionData={setQuestionData} setIsDeleted={setIsDeleted} isDeleted ={isDeleted } />
        ) : (
          <KnowledgeHome />
        )
      )
      :
        <div className='flex flex-col gap-2 bg-gray-200 items-center justify-center pl-20 pr-10 py-3 min-h-screen'>
            <CircularProgress label="Fetching Data..." size="lg" />
          </div>
      }
    </VendorLayout>
  );
}

export default Index;
