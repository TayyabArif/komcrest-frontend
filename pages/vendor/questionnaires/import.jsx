import React,{useState} from "react";
import Import from "@/components/vendor/questionnaires/importQuestionnaires";
import VendorLayout from "../../../components/vendor/shared/vendorLayout";
import DummyQuestionnairesList from "@/components/vendor/questionnaires/questionnairesList/dummyTable";
const ImportQuestionnaire = () => {
  const [importSuccessfully ,setImportSuccessfully] = useState(false)
  return (
    <VendorLayout>
      {importSuccessfully ? <DummyQuestionnairesList /> : <Import setImportSuccessfully={setImportSuccessfully} />}
    </VendorLayout>
  );
};

export default ImportQuestionnaire;
