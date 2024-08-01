import React, { useState, useEffect } from "react";
import VendorLayout from "../../../components/vendor/shared/vendorLayout";
import KnowledgeHome from "../../../components/vendor/knowledge";
import KnowledgeBase from "../../../components/vendor/knowledge/knowledge-base";
import { CircularProgress } from "@nextui-org/react";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../helper";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import KnowledgeHeader from "@/components/vendor/shared/KnowledgeHeader";

const headerData = {
  title: "Knowledge",
  desc1: "Quickly add requirements, questions and answers to your account. ",
  desc2:
    "They will be used by Komcrest AI to automatically provide the best answer to your future questions.",
  addSingle: "Add new question",
  addMultiple: "Import questions",
  singlePath: "/vendor/knowledge/AddQuestion",
  multiplelePath: "/vendor/knowledge/Import",
};

const Knowledge = () => {
  const router = useRouter();
  const [questionData, setQuestionData] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [dataLoaded, setDataLoaded] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataUpdate, setDataUpdate] = useState(false);
  const [filters, setFilters] = useState([]);

  const getQuestions = async () => {
    const token = cookiesData && cookiesData.token;

    const filterPayload = {
      filters: filters,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filterPayload),
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/getquestions`, requestOptions);
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      setDataLoaded(true);

      if (response.ok) {
        setQuestionData(data);
        console.log("Fetched data:", data);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      setDataLoaded(true);
      console.error("Error fetching user documents:", error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, [dataUpdate, filters]);

  return (
    <VendorLayout>
      <KnowledgeHeader
        buttonShow={questionData.length > 0 ? true : false}
        headerData={headerData}
      />
      {dataLoaded ? (
        questionData.length > 0 || filters.length > 0 ? (
          <KnowledgeBase
            questionData={questionData}
            setQuestionData={setQuestionData}
            setDataUpdate={setDataUpdate}
            dataUpdate={dataUpdate}
            setFilters={setFilters}
            filters={filters}
            dataLoaded={dataLoaded}
          />
        ) : (
          <KnowledgeHome />
        )
      ) : (
        <div className="flex flex-col gap-2 bg-gray-200 items-center justify-center pl-20 pr-10 py-3 min-h-screen">
          <CircularProgress label="Fetching Data..." size="lg" />
        </div>
      )}
    </VendorLayout>
  );
};

export default Knowledge;
