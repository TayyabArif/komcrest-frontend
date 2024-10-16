import React,{useState} from "react";
import Import from "@/components/vendor/questionnaires/importQuestionnaires";
import VendorLayout from "../../../components/vendor/shared/vendorLayout";
import DummyQuestionnairesList from "@/components/vendor/questionnaires/questionnairesList/dummyTable";
const ImportQuestionnaire = () => {
  const [importSuccessfully ,setImportSuccessfully] = useState(false)
  const [questionList , setQuestionList] = useState()
  const [questionnaireData , setQuestionnaireData] = useState({
    filename:"",
    customerName : ""
  })
  console.log("KKKKKKK",questionList)
  return (
    <VendorLayout>
      {importSuccessfully ? <DummyQuestionnairesList questionList={questionList} questionnaireData={questionnaireData} /> : <Import setImportSuccessfully={setImportSuccessfully} setQuestionList={setQuestionList} questionList={questionList} setQuestionnaireData={setQuestionnaireData}/>}
    </VendorLayout>
  );
};

export default ImportQuestionnaire;
