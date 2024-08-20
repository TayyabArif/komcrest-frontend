import React from 'react'
import { Settings } from "lucide-react";
import KnowledgeHeader from '../shared/KnowledgeHeader'
import { FilePenLine, Check,Eye,TriangleAlert  } from "lucide-react";
const data = [
  {
    status: false,
    question: "Do you use industry standards to build in security for your Systems/Software Development Lifecycle (SDLC)?",
    compliance: "faCog",
    answer: "faCog",
    actions: ["faCheckCircle", "faExclamationTriangle", "faEye"],
  },
  {
    status: false,
    question: "Do you use an automated source code analysis tool to detect security defects in code prior to production?",
    compliance: "faCog",
    answer: "faCog",
    actions: ["faCheckCircle", "faExclamationTriangle", "faEye"],
  },
  {
    status: false,
    question: "Do you use manual source-code analysis to detect security defects in code prior to production?",
    compliance: "faCog",
    answer: "faCog",
    actions: ["faCheckCircle", "faExclamationTriangle", "faEye"],
  },
  {
    status: false,
    question: "Do you verify that all of your software suppliers adhere to industry standards for Systems/Software Development Lifecycle (SDLC) security?",
    compliance: "faCog",
    answer: "faCog",
    actions: ["faCheckCircle", "faExclamationTriangle", "faEye"],
  },
  {
    status: false,
    question: "(SaaS only) Do you review your applications for security vulnerabilities and address any issues prior to deployment to production?",
    compliance: "faCog",
    answer: "faCog",
    actions: ["faCheckCircle", "faExclamationTriangle", "faEye"],
  },
  {
    status: false,
    question: "Are all identified security, contractual and regulatory requirements for customer access contractually addressed and remediated prior to granting customers access to data, assets, and information systems?",
    compliance: "faCog",
    answer: "faCog",
    actions: ["faCheckCircle", "faExclamationTriangle", "faEye"],
  },
  {
    status: false,
    question: "Are all requirements and trust levels for customers’ access defined and documented?",
    compliance: "faCog",
    answer: "faCog",
    actions: ["faCheckCircle", "faExclamationTriangle", "faEye"],
  }
];


const headerData = {
    title: "Questionnaires",
    desc1: "Streamline the process of responding to complex IT security assessments thanks to our AI-powered assistant.",
    desc2:
      "Upload your questionnaire and Komcrest will provides accurate and tailored answers, saving time and ensuring consistency.",
    addSingle: "Add questionnaire",
    singlePath: "/vendor/questionnaires/import",
  };

const Questionnaires = () => {

  return (
    <div>
        <KnowledgeHeader headerData={headerData} buttonShow={true}/>
        <div className="w-[86%] mx-auto py-2 px-2">
          <div className='flex gap-5 text-[16px] 2xl:text-[20px] py-2 '>
            <h1>In progress</h1>
            <h1>Completed</h1>
          </div>
          <div className="my-3 flex gap-2 ">
              {[
                "To process",
                "Started",
                "For Review",
                "Approved",
              ].map((title, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-center flex-1 border-2 py-[6px] px-2 rounded-lg bg-white"
                >
                  <span
                    className={`flex items-center justify-center rounded-full w-[27px] h-[27px] text-center border-2 bg-[#EBEEF2]`}
                  >
                    {index +1}
                  </span>
                  <h1
                    className="text-[16px] 2xl:text-[20px]"
                  >
                    {title}
                  </h1>
                </div>
              ))}
            </div>



        </div>


        {/* //////// */}
        <div className="overflow-x-auto w-[86%] mx-auto bg-white">
  <table className="min-w-full border-collapse border text-gray-700">
    <thead className="border">
      <tr className='2xl:text-[20px] text-[16px]'>
      <th className="px-4 py-2 text-left text-gray-600 border"></th>
        <th className="px-4 py-2 text-left text-gray-600 border">Status</th>
        <th className="px-4 py-2 text-left text-gray-600 border">Question</th>
        <th className="px-4 py-2 text-left text-gray-600 border">Compliance</th>
        <th className="px-4 py-2 text-left text-gray-600 border">Answer</th>
        <th className="px-4 py-2 text-center text-gray-600 border">Actions</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <tr key={index} className="border-b 2xl:text-[20px] text-[16px]">
          <td className="px-4 py-2 text-center border w-[70px]">
            <input type="checkbox" className="form-checkbox h-4 w-4" checked={item.status} />
          </td>
          <td className="px-4 py-2 text-center border w-[70px]">
            {/* Status Circle */}
            <div className={`h-5 w-5 mx-auto rounded-full ${item.status ? 'bg-green-500' : 'bg-[#F2F2F2]'}`}></div>
          </td>
          <td className="px-4 py-2 border w-[500px]">{item.question}</td>
          <td className="px-4 py-2 text-center border w-[100px]">
            <Settings className="text-blue-600" />
          </td>
          <td className="px-4 py-2 text-center border">
            <Settings className="text-blue-600" />
          </td>
          <td className="px-4 py-2 text-center border w-[100px]">
            <div className="inline-flex space-x-2 text-[#A5A5A5]">
              <Check size={17} />
              <TriangleAlert size={17} />
              <Eye size={17} />
              <FilePenLine size={17} />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


        
    </div>
  )
}

export default Questionnaires