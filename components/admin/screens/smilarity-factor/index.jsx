import React, { useEffect, useState } from "react";
import { FilePenLine } from "lucide-react";
import UpdateSimilarityFactor from "./UpdateSimilartyFactor";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { handleResponse } from "../../../../helper/index";

const SimilarityFactorComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataUpdate ,setDataUpdate] = useState(false)

  const [similarityValues, setSimilarityValues] = useState();

  const getSimilarityFactorData = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}/settings`,
        requestOptions
      );
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        setSimilarityValues(data)
      }
    } catch (error) {
      console.error("Error get Similarity Factor Data:", error);
      toast.error("Failed to get Similarity Factor Data");
    }
  };
  useEffect(()=>{
    getSimilarityFactorData()
  },[dataUpdate])


  return (
    <div className="bg-[#E5E7EB] h-screen">
      <div className="flex justify-between items-start bg-gray-50 pl-20 pr-10 py-6">
        <div>
          <p className="font-semibold">AI Prompt for better Experience</p>
          <p>Update Update similarity factor values according your requirement.</p>
        </div>
      </div>
      <div className="w-[90%] mx-auto p-3 rounded-2xl border">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-300 rounded-lg">
              <th className="py-3 px-4 border-b text-gray-600 border-gray-300">
                Documents Similarity factor
              </th>
              <th className="py-3 px-4 border-b text-gray-600 border-gray-300">
                Online resources similarity factor
              </th>
              <th className="py-3 px-4 border-b text-gray-600 border-gray-300">
                {" "}
                Knowledge Base Similarity factor
              </th>
              <th className="py-3 px-4 border-b text-gray-600 border-gray-300">
                {" "}
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-300">
              <td className="py-3 px-4 text-center text-gray-600">
                {similarityValues?.documentThreshold}
              </td>
              <td className="py-3 px-4 text-center text-gray-600">
                {similarityValues?.resourceThreshold}
              </td>
              <td className="py-3 px-10 text-center text-gray-600 ">
                {similarityValues?.questionThreshold}
              </td>
              <td className="py-3 px-10 text-center flex justify-center items-center  text-gray-600 ">
                <FilePenLine onClick={() => setIsModalOpen(true)} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <UpdateSimilarityFactor
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        similarityValues={similarityValues}
        setSimilarityValues={setSimilarityValues}
        setDataUpdate={setDataUpdate}
      />
    </div>
  );
};

export default SimilarityFactorComponent;
