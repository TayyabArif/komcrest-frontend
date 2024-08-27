import React from "react";
import { Button } from "@nextui-org/react";
import { Settings } from "lucide-react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "@/helper";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';



const QuestionnairsListHeader = ({currentStatus ,questionnaireData}) => {  
  const router = useRouter();
  const { id } = router.query;
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


  const questionnaireUpdated = (value) => {
    const jsonPayload = JSON.stringify({
      status : value
      });
    const token = cookiesData.token;
    let requestOptions = {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: jsonPayload,
      redirect: "follow",
    };
  
    
      fetch(`${baseUrl}/questionnaires/${id}`, requestOptions)
        .then(async (response) => {
          const data = await handleResponse(response, router, cookies, removeCookie);
          return {
            status: response.status,
            ok: response.ok,
            data,
          };
        })
        .then(({ status, ok, data }) => {
          if (ok) {
            
            toast.success(data.message);
          } else {
            toast.error(data?.error || "Questionnaires status not Updated");
            console.error("Error:", data);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.error("API Error:", error.response);
            toast.error(error.response.data?.error || "An error occurred while Updated  Questionnaires status");
          }
        });
  }

  const data = [
    {
        "id": 848,
        "questionnaireId": 30,
        "category": "4. STORAGE, ENCRYPTION AND DISPOSAL. ",
        "question": "4.1.        Separation. The Vendor shall separate the Production Environment for Sodexo from other The Vendor customers. Sodexo would require a fully dedicated and isolated environment (production)",
        "sheetTag": "IT Security",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.437Z",
        "updatedAt": "2024-08-24T17:09:50.437Z"
    },
    {
        "id": 849,
        "questionnaireId": 30,
        "category": "",
        "question": "4.2.        Encryption Technologies. The Vendor shall encrypt Customer Data in accordance with industry best practice standards. All access and transfer of data to and from The Vendor’s solution shall be via encrypted transit on TLS 1.2 at minimum and The Vendor shall only support industry recognized and best practice cipher suites. The Vendor shall encrypt all data persisted on the Production Environment with an AES 256-bit, or equivalent, encryption key.",
        "sheetTag": "IT Security",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.526Z",
        "updatedAt": "2024-08-24T17:09:50.526Z"
    },
    {
        "id": 850,
        "questionnaireId": 30,
        "category": "",
        "question": "4.3.        Authentication. The Vendor shall integrate with the customers’ identity provider (Microsoft ADFS) through federated authentication using SAML v2.0.",
        "sheetTag": "IT Security",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.528Z",
        "updatedAt": "2024-08-24T17:09:50.528Z"
    },
    {
        "id": 851,
        "questionnaireId": 30,
        "category": "",
        "question": "4.4.        Keys. The Vendor must be able to allow Sodexo to use its own keys to encrypt golden data within the databases. The Vendor must implement and facilitate access to a key management service where Sodexo can manage keys, secrets, certificates and any crypto resources securely.",
        "sheetTag": "IT Security",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.529Z",
        "updatedAt": "2024-08-24T17:09:50.529Z"
    },
    {
        "id": 852,
        "questionnaireId": 30,
        "category": "5. INCIDENT RESPONSE AND BREACH NOTIFICATION. ",
        "question": "5.1.        Incident response. The Vendor shall maintain a tested incident response program, which shall be managed and run by The Vendor’s Incident Response Team. The Vendor’s Incident Response Team shall operate to a mature framework that includes incident management and breach notification policies and associated processes. The Vendor’s incident response program shall include, at a minimum, initial detection; initial tactical response; initial briefing; incident briefing; refined response; communication and message; formal containment; formal incident report; and post mortem/trend analysis.",
        "sheetTag": "IT Security",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.531Z",
        "updatedAt": "2024-08-24T17:09:50.531Z"
    },
    {
        "id": 853,
        "questionnaireId": 30,
        "category": "",
        "question": "5.2.        Breach Notification. The Vendor shall report to Sodexo any unlawful access or unauthorized acquisition use, or disclosure of Customer Data persisted in The Vendor’s solution (a “Data Breach”) by notifying Customer by email sent to security@sodexo.com without undue delay.",
        "sheetTag": "IT Security",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.564Z",
        "updatedAt": "2024-08-24T17:09:50.564Z"
    },
    {
        "id": 828,
        "questionnaireId": 30,
        "category": "1. SECURITY MANAGEMENT. ",
        "question": "1.1.        Maintenance of Information Security Program. The Vendor shall take and implement appropriate technical and organizational measures to protect Customer Data located in The Vendor’s solution and shall maintain the Information Security Program in accordance with ISO 27001 standards or such other alternative standards that are substantially equivalent to ISO 27001. The Vendor may update or modify the Information Security Program from time to time provided that such updates and modifications do not result in the degradation of the overall security of The Vendor’s solution.",
        "sheetTag": "IT Security",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.410Z",
        "updatedAt": "2024-08-24T17:09:50.410Z"
    },
    {
        "id": 829,
        "questionnaireId": 30,
        "category": "",
        "question": "1.2.        Subcontractors. The Vendor shall evaluate all Subcontractors to ensure that Subcontractors maintain adequate physical, technical, organizational, and administrative controls, based on the risk tier appropriate to their subcontracted services that support The Vendor’s compliance with the requirements of the Agreement. All Subcontractors fall into scope for independent audit assessment as part of, or maintain an independent audit assessment which conforms to, The Vendor’s ISO 27001 audit or an equivalent standard, where their roles and activities are reviewed per control requirements. The Vendor shall remain responsible for the acts and omissions of its Subcontractors as they relate to the services performed under the Agreement as if it had performed the acts or omissions itself and any subcontracting shall not reduce The Vendor’s obligations to Customer under the Agreement.",
        "sheetTag": "IT Security",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.413Z",
        "updatedAt": "2024-08-24T17:09:50.413Z"
    },
    {
        "id": 830,
        "questionnaireId": 30,
        "category": "2. PHYSICAL SECURITY MEASURES. ",
        "question": "2.1.        General. The Vendor shall maintain appropriate physical security measures designed to protect the tangible items, such as physical computer systems, networks, servers, and devices, that Process Customer Data. The Vendor shall utilize commercial grade security software and hardware to protect the The Vendor’s service and the Production Environment.",
        "sheetTag": "Resource",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.414Z",
        "updatedAt": "2024-08-24T17:09:50.414Z"
    },
    {
        "id": 831,
        "questionnaireId": 30,
        "category": "",
        "question": "2.2.        Data Centre Access. The Vendor shall ensure that its commercial-grade data centre service providers used in the provision of The Vendor’s solution maintain an on-site security operation that is responsible for all physical data centre security functions and formal physical access procedures in accordance with SOC1 and SOC 2, or equivalent, standards.  ",
        "sheetTag": "Resource",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.416Z",
        "updatedAt": "2024-08-24T17:09:50.416Z"
    },
    {
        "id": 832,
        "questionnaireId": 30,
        "category": "3. LOGICAL SECURITY. ",
        "question": "3.1.        Administrative Controls. The Vendor shall maintain a formal access control policy and shall control Personnel access to the Production Environment.",
        "sheetTag": "Resource",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.417Z",
        "updatedAt": "2024-08-24T17:09:50.417Z"
    },
    {
        "id": 833,
        "questionnaireId": 30,
        "category": "",
        "question": "a)              The Vendor shall ensure that all access to the Production Environment is subject to successful two-factor authentication globally from both corporate and remote locations and is restricted to authorized Personnel who demonstrate a legitimate business need for such access. The Vendor shall maintain an associated access control process for reviewing and implementing Personnel access requests. The Vendor shall regularly review the access rights of authorized Personnel and, upon change in scope of employment necessitating removal or employment termination, remove or modify such access rights as appropriate.",
        "sheetTag": "Resource",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.419Z",
        "updatedAt": "2024-08-24T17:09:50.419Z"
    },
    {
        "id": 834,
        "questionnaireId": 30,
        "category": "",
        "question": "b)             The Vendor shall monitor and assess the efficacy of access restrictions applicable to the control of The Vendor's system administrators in the Production Environment, which shall entail generating system individual administrator activity information and retaining such information for a period of at least 12 months.",
        "sheetTag": "Resource",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.420Z",
        "updatedAt": "2024-08-24T17:09:50.420Z"
    },
    {
        "id": 835,
        "questionnaireId": 30,
        "category": "",
        "question": "c)              All access and activities on the Production environment must be adequately traced and logged with a retention of at least 12 months. The logs must be immutable and access to the logs must be restricted for access reviews and auditing purposes.",
        "sheetTag": "Legal",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.422Z",
        "updatedAt": "2024-08-24T17:09:50.422Z"
    },
    {
        "id": 836,
        "questionnaireId": 30,
        "category": "",
        "question": "d)             Production environments must be accessible through Privileged Access Management enabled pods. The PAM pods must follow principles of least privileges and just enough access.",
        "sheetTag": "Legal",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.423Z",
        "updatedAt": "2024-08-24T17:09:50.423Z"
    },
    {
        "id": 837,
        "questionnaireId": 30,
        "category": "",
        "question": "e)              Access into Production environments must provide proper isolation to customer golden data. Operators must not be able to read and access these data and any attempts to do so must be properly registered and flagged.",
        "sheetTag": "Legal",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.425Z",
        "updatedAt": "2024-08-24T17:09:50.425Z"
    },
    {
        "id": 838,
        "questionnaireId": 30,
        "category": "",
        "question": "3.2.        Network Security. The Vendor shall maintain a defence-in-depth approach to hardening the Production Environment against exposure and attack. ",
        "sheetTag": "Legal",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.426Z",
        "updatedAt": "2024-08-24T17:09:50.426Z"
    },
    {
        "id": 839,
        "questionnaireId": 30,
        "category": "",
        "question": "a)            The Vendor shall maintain an isolated Production Environment that includes commercial grade network management controls such as load balancers, firewalls, intrusion detection systems distributed across production networks, and malware protections. ",
        "sheetTag": "Legal",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.427Z",
        "updatedAt": "2024-08-24T17:09:50.427Z"
    },
    {
        "id": 840,
        "questionnaireId": 30,
        "category": "",
        "question": "b)           The Vendor shall complement its Production Environment architecture with prevention and detection technologies that monitor all activity generated and send risk-based alerts to the relevant security groups.",
        "sheetTag": "Legal",
        "status": "processed",
        "confidence": null,
        "answer": null,
        "compliance": null,
        "createdAt": "2024-08-24T17:09:50.429Z",
        "updatedAt": "2024-08-24T17:09:50.429Z"
    },
  ]

  const handleExport = () => {
    // Group data by 'sheetTag'
    const groupedData = questionnaireData?.questionnaireRecords?.reduce((acc, record) => {
      const { sheetTag } = record;
      if (!acc[sheetTag]) {
        acc[sheetTag] = [];
      }
      
      // Filter the record to only include the desired properties
      const filteredRecord = {
        category: record.category,
        question: record.question,
        status: record.status,
        answer: record.answer
      };
      
      acc[sheetTag].push(filteredRecord);
      return acc;
    }, {});
  
    // Create a workbook
    const workbook = XLSX.utils.book_new();
  
    // Add sheets to the workbook based on 'sheetTag'
    Object.keys(groupedData).forEach(sheetName => {
      const sheetData = groupedData[sheetName];
      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });
  
    // Convert workbook to binary format
    const workbookBinary = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  
    // Function to create a Blob from the workbook binary
    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    };
  
    // Create a Blob from the workbook binary
    const blob = new Blob([s2ab(workbookBinary)], { type: 'application/octet-stream' });
  
    // Create a link element to download the file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'excel_data.xlsx'; // Use the file name provided
    link.click();
  
    // Clean up and revoke the Object URL
    URL.revokeObjectURL(link.href);
  };
  
  

  return (
    <div className="bg-gray-50 py-2">
      <div className="flex justify-between items-center  w-[85%] mx-auto">
        <div className="leading-7 flex gap-2">
          <p className="text-[16px] 2xl:text-[20px]">Questionnaires</p>
          <p className="text-[16px] 2xl:text-[20px]">- {questionnaireData?.fileName}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <select onChange={(e)=>questionnaireUpdated(e.target.value)}  value={currentStatus} className="w-[150px]  bg-[#D8D8D8] text-[18px] border rounded-lg pr-3 p-[5px]">
              <option  disabled>Change Status</option>
              <option value="To Process">To Process</option>
              <option value="Started">Started</option>
              <option value="For Review">For Review</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
            </select>
            <Button
              radius="none"
              size="sm"
              className="text-white text-sm  2xl:text-[20px] bg-btn-primary w-max rounded-[4px] my-4"
              onClick={handleExport}
            >
              Export .XLS
            </Button>
            <div className="bg-[#D8D8D8] py-1 px-[6px] rounded-md">
              <Settings className="text-[#252525] " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairsListHeader;
