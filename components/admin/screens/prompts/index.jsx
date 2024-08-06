import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import UpdatePrompt from "./UpdatePrompt";
import { Eye, FilePenLine, Trash2 } from "lucide-react";
import PreviewModal from "./PreviewModal";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { handleResponse } from "../../../../helper/index";

const PromptsComponent = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [prompts, setPrompts] = useState([]);
  const [dataUpdate , setDataUpdate] = useState(false)

  const prompt_columns = [
    { uid: "title", name: "Title" },
    { uid: "prompt", name: "Prompt" },
    { uid: "actions", name: "Actions" },
  ];

  useEffect(() => {
    getAllPrompts();
  }, [dataUpdate]);

  const getAllPrompts = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/prompts`, requestOptions);
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        console.log(">>>>>>.", data);
        setPrompts(data);
      }
    } catch (error) {
      console.error("Error fetching user documents:", error);
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) {
      return "";
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const handlePreviewOpen = (prompt) => {
    setSelectedPrompt(prompt);
    setIsPreviewOpen(true);
  };

  const handleUpdate = (prompt) => {
    setSelectedPrompt(prompt);
    setIsAddOpen(true);
  };

  return (
    <div className="bg-[#E5E7EB] h-screen">
      <div className="flex justify-between items-start bg-gray-50 pl-20 pr-10 py-6">
        <div>
          <p className="font-semibold">AI Prompt for better Experience</p>
          <p>
            Update the Prompt according your requirement.
          </p>
        </div>
      </div>
      <div className="w-[90%] mx-auto p-3 rounded-2xl border">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead >
            <tr className="bg-gray-300 rounded-lg">
              {prompt_columns.map((column) => (
                <th
                  key={column.uid}
                  className={`py-3 px-4 border-b text-gray-600 border-gray-300 text-${
                    column.uid === "actions" ? "center" : "left"
                  }`}
                >
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prompts.length > 0 ? (
              prompts.map((item) => (
                <tr key={item.id} className="border-t border-gray-300">
                  <td className="py-3 px-4 text-left text-gray-600">
                    {item.title}
                  </td>
                  <td className="py-3 px-4 text-left text-gray-600">
                    {truncateText(item.prompt, 167)}
                  </td>
                  <td className="py-3 px-10 text-gray-600 ">
                    <div className="flex items-center justify-center gap-3 h-full">
                      <Eye onClick={() => handlePreviewOpen(item)} />
                      <FilePenLine onClick={() => handleUpdate(item)} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={prompt_columns.length}
                  className="py-3 px-4 text-center text-gray-500"
                >
                  No Prompts Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UpdatePrompt
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        prompt={selectedPrompt}
        setDataUpdate={setDataUpdate}
      />
      <PreviewModal
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        prompt={selectedPrompt}
      />
    </div>
  );
};

export default PromptsComponent;
