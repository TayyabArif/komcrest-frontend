import React, { useEffect, useState, useRef } from "react";
import KnowledgeHeader from "../shared/KnowledgeHeader";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../helper";
import FilterStatus from "./FilterStatus";
import QuestionnairCard from "./QuestionnairCard";
import { QuestionnaireStepsContent } from "@/constants";
import { CircularProgress } from "@nextui-org/react";
import { toast } from "react-toastify";

import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useMyContext } from "@/context";

const headerData = {
  title: "Questionnaires",
  desc1:
    "Streamline the process of responding to complex IT security assessments thanks to our AI-powered assistant.",
  desc2:
    "Upload your questionnaire and Komcrest will provides accurate and tailored answers, saving time and ensuring consistency.",
  rightButtonText: "Add questionnaire",
  rightButtonPath: "/vendor/questionnaires/import",
  leftButtonText: "Ask a Question",
  leftButtonPath: "/vendor/questionnaires/askQuestion",
};

const Questionnaires = () => {
  const [filterValue, setFilterValue] = useState("progress");
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataUpdate, setDataUpdate] = useState(false);
  // const [questionnaireList , setQuestionnaireList] = useState([])
  const [questionnaireProgressBar, setQuestionnaireProgressBar] = useState({});
  const [dataLoaded, setDataLoaded] = useState(true);
  const {
    questionnaireList,
    setQuestionnaireList,
    setQuestionnaireUpdated,
    isFetchingAllQuestionnaire,
  } = useMyContext();

  const filterStatus = (status) => {
    const filteredData = questionnaireList?.filter(
      (item) => item.status === status
    );
    return filteredData?.sort((a, b) => b.id - a.id);
  };

  const handleCardDrop = (id, newStatus) => {
    // instantly drop
    setQuestionnaireList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    //call api to change status

    const jsonPayload = JSON.stringify({
      status: newStatus,
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

  const divRef = useRef(null);
  const [divHeight, setDivHeight] = useState(0);
  // get scrollable hight of parent div
  useEffect(() => {
    const updateDivHeight = () => {
      if (divRef.current) {
        setDivHeight(divRef.current.scrollHeight);
      }
    };

    updateDivHeight();
    window.addEventListener("resize", updateDivHeight);
    divRef?.current?.addEventListener("scroll", updateDivHeight);
    return () => {
      window.removeEventListener("resize", updateDivHeight);
      if (divRef.current) {
        divRef.current.removeEventListener("scroll", updateDivHeight);
      }
    };
  }, [dataUpdate]);

  return (
    <>
      {dataLoaded ? (
        <div className="h-full flex flex-col">
          <KnowledgeHeader headerData={headerData} buttonShow={true} />
          <div className="w-[86%] mx-auto pt-2 px-2 flex flex-col h-[0vh] flex-1">
            <div className="flex gap-5 text-[16px] 2xl:text-[20px] py-2 ">
              <h1
                className={`${
                  filterValue == "progress" ? "text-blue-700 " : ""
                } cursor-pointer`}
                onClick={() => setFilterValue("progress")}
              >
                In progress
              </h1>
              <h1
                className={`${
                  filterValue == "completed" ? "text-blue-700 " : ""
                } cursor-pointer`}
                onClick={() => setFilterValue("completed")}
              >
                Completed
              </h1>
            </div>
            {filterValue == "progress" ? (
              <div ref={divRef} className="flex flex-1  gap-3 overflow-auto">
                {isFetchingAllQuestionnaire ? (
                  <div className="flex items-center justify-center w-full">
                    <h1 className="text-center text-standard">
                      Fetching data please wait...
                    </h1>
                  </div>
                ) : (
                  <DndProvider backend={HTML5Backend}>
                    <FilterStatus
                      onCardDrop={handleCardDrop}
                      title="To Process"
                      data={filterStatus("To Process")}
                      stepsContent={QuestionnaireStepsContent.process}
                      setDataUpdate={setDataUpdate}
                      divHeight={divHeight}
                    />

                    <FilterStatus
                      onCardDrop={handleCardDrop}
                      title="Started"
                      data={filterStatus("Started")}
                      stepsContent={QuestionnaireStepsContent.Started}
                      setDataUpdate={setDataUpdate}
                      divHeight={divHeight}
                    />

                    <FilterStatus
                      onCardDrop={handleCardDrop}
                      title="For Review"
                      data={filterStatus("For Review")}
                      stepsContent={QuestionnaireStepsContent.Review}
                      setDataUpdate={setDataUpdate}
                      divHeight={divHeight}
                    />

                    <FilterStatus
                      onCardDrop={handleCardDrop}
                      title="Approved"
                      data={filterStatus("Approved")}
                      stepsContent={QuestionnaireStepsContent.Approved}
                      setDataUpdate={setDataUpdate}
                      divHeight={divHeight}
                    />
                  </DndProvider>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-5 w-[25%] overflow-auto">
                {filterStatus("Completed").length > 0
                  ? filterStatus("Completed")?.map((data, index) => {
                      return (
                        <DndProvider key={index} backend={HTML5Backend}>
                          <QuestionnairCard
                            data={data}
                            setDataUpdate={setDataUpdate}
                            dataUpdate={dataUpdate}
                          />
                        </DndProvider>
                      );
                    })
                  : "No Questionnaire is completed yet"}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 bg-gray-200 items-center justify-center pl-20 pr-10 py-3 min-h-screen">
          <CircularProgress label="Fetching Questionnaires..." size="lg" />
        </div>
      )}
    </>
  );
};

export default Questionnaires;
