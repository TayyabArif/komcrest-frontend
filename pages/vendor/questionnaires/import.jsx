import React,{useState, useEffect} from "react";
import Import from "@/components/vendor/questionnaires/importQuestionnaires";
import VendorLayout from "../../../components/vendor/shared/vendorLayout";
import SocketQuestionnairesList from "@/components/vendor/questionnaires/questionnairesList/qustionGetWithSocket";
import { useMyContext } from "@/context";
const ImportQuestionnaire = () => {
  const [newQuestionnaireCreated , setNewQuestionnaireCreated] = useState(true)
  
  return (
    <VendorLayout>
      {newQuestionnaireCreated ?  <Import  setNewQuestionnaireCreated={setNewQuestionnaireCreated} /> : <SocketQuestionnairesList />}
    </VendorLayout>
  );
};

export default ImportQuestionnaire;
