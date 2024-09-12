import React,{useState} from "react";
import Import from "@/components/vendor/questionnaires/importQuestionnaires";
import VendorLayout from "../../../components/vendor/shared/vendorLayout";
import DummyQuestionnairesList from "@/components/vendor/questionnaires/questionnairesList/dummyTable";
const ImportQuestionnaire = () => {
  const [importSuccessfully ,setImportSuccessfully] = useState(false)
  const [questionList , setQuestionList] = useState()
  console.log("KKKKKKK",questionList)
  return (
    <VendorLayout>
      {importSuccessfully ? <DummyQuestionnairesList questionList={questionList}/> : <Import setImportSuccessfully={setImportSuccessfully} setQuestionList={setQuestionList} questionList={questionList}/>}
    </VendorLayout>
  );
};

export default ImportQuestionnaire;
