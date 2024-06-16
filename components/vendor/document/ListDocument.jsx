import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import DocumentHeader from "./shared/DocumentHeader";
import DocumentCard from "./shared/DocumentCard";
import { useRouter } from "next/router";
import ExampleCard from "./shared/ExampleCard";
import { Document_Data } from "@/utlis/data";
import { useCookies } from "react-cookie";

const AddDocument = () => {
  const [cookies, setCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;

  const router = useRouter();
  const [Document_Data, setDocument_Data] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    getUserDocument();
  }, [isDeleted]);

  const getUserDocument = async () => {
    setIsLoading(true);
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/userdocuments`, requestOptions);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setDocument_Data(result);
      console.log("result of all", result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <DocumentHeader buttonShow={Document_Data.length > 0 ? true : false} />
      {Document_Data.length > 0 ? (
        <DocumentCard cardData={Document_Data} setIsDeleted={setIsDeleted} />
      ) : (

        <div className="text-center space-y-5 my-5">
          <div className="text-center w-[35%] mx-auto ">
            <div className="flex justify-center items-center">
              <Image
                src="/document.png"
                alt="document"
                className="dark:invert"
                width={100}
                height={24}
                priority
              />
             
            </div>

            <span className="font-semibold">
              It appears that you haven’t uploaded any documents yet.
            </span>
            <p className="text-[15px] leading-4">
              We encourage you to add key documents that you frequently share
              with your prospects and clients. We will index them to improve the
              accuracy of Komcrest Generative AI.
            </p>
            <Button
              radius="none"
              size="sm"
              className="text-white px-[10px] text-sm bg-btn-primary w-max rounded-[4px] my-4"
              onClick={() => {
                router.push("/vendor/document/AddDocument");
              }}
            >
              Add documents
            </Button>
          </div>
          <div className="space-y-2">
            <ExampleCard />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDocument;
