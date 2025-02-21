import React, { useEffect, useState } from 'react';
import VendorLayout from "../../../components/vendor/shared/vendorLayout";
import QuestionnairesView from '@/components/vendor/questionnaires/questionnairesList/questionnaireView';
import { useMyContext } from "@/context";
import SocketQuestionnairesList from "@/components/vendor/questionnaires/questionnairesList/qustionGetWithSocket";

const QuestionnairView = () => {
  const [id, setId] = useState(null);
  const [currentQuestionnaireImportId , setCurrentQuestionnaireImportId] = useState(null)
  // const { currentQuestionnaireImportId } = useMyContext();

  useEffect(() => {
    const storedId = sessionStorage.getItem("QuestionnaireId");
    const QuestionnaireImportId = sessionStorage.getItem("CurrentQuestionnaireImportId");
    setCurrentQuestionnaireImportId(QuestionnaireImportId)
    setId(storedId);
  }, []);

  return (
    <VendorLayout>
     {currentQuestionnaireImportId == id ?  <SocketQuestionnairesList /> :  <QuestionnairesView />}
    </VendorLayout>
  );
};

export default QuestionnairView;
