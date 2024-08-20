import React,{useState} from "react";
import Import from "@/components/vendor/questionnaires/importQuestionnaires";
import VendorLayout from "../../../components/vendor/shared/vendorLayout";
import QuestionnairesList from "@/components/vendor/questionnaires/questionnairesList";
const ImportQuestionnaire = () => {
  const [importSuccessfully ,setImportSuccessfully] = useState(false)
  return (
    <VendorLayout>
      {importSuccessfully ? <QuestionnairesList /> : <Import setImportSuccessfully={setImportSuccessfully}/>}
    </VendorLayout>
  );
};

export default ImportQuestionnaire;
