import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import VendorHeader from "../shared/VendorHeader";
import DocumentCard from "./shared/DocumentCard";
import { useRouter } from "next/router";
import ExampleCard from "./shared/ExampleCard";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import {handleResponse} from "../../../helper"


const AddDocument = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['myCookie']); 
  const cookiesData = cookies.myCookie;
  

  const router = useRouter();
  const [documentData, setDocumentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
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
      const data = await handleResponse(response, router, cookies,removeCookie);
      // const data = await response.json();
      if (response.ok) {
        setDocumentData(data);
        setDataIsLoaded(true);
      } else {
        toast.error(data?.error);
        
      }
    } catch (error) {
      console.error("Error fetching user documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <VendorHeader buttonShow={documentData.length > 0} />
      {dataIsLoaded &&
        (documentData.length <= 0 ? (
          <DocumentCard
            cardData={documentData}
            setIsDeleted={setIsDeleted}
            isDeleted={isDeleted}
          />
        ) : (
          <div className="text-center space-y-[3rem] py-7">
            <div className="text-center w-[36%] mx-auto my-5">
              <div className="flex justify-center items-center">
                <svg
                  height="100px"
                  width="100px"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 476.465 476.465"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <path
                        style={{ fill: "#2457d7" }}
                        d="M156.069,234.513c-6.73,0-12.193-7.275-12.193-16.257V110.512c0-8.982-4.178-20.435-9.34-25.597s-9.34-2.065-9.34,6.917v89.496c0,8.982-5.682,11.705-12.681,6.088l-2.642-2.113c-7.007-5.617-12.681-17.444-12.681-26.426V55.839c0,0,0-1.853,0-4.137c0-2.284-4.105-8.242-9.169-13.306c-5.064-5.064-9.169-1.894-9.169,7.088v172.781c0,8.982-5.462,16.257-12.193,16.257H54.47H29.994C13.428,234.522,0,247.95,0,264.516v169.969c0,16.566,13.428,29.994,29.994,29.994h169.968c16.566,0,29.994-13.428,29.994-29.994v-0.488c0,0,0-5.462,0-12.193c0-6.73,7.275-12.193,16.257-12.193h213.993c8.982,0,16.257-7.275,16.257-16.257V117.657c0-8.982-7.275-16.257-16.257-16.257H184.519c-8.982,0-16.257,7.275-16.257,16.257v100.607C168.262,227.238,162.799,234.513,156.069,234.513z M305.22,155.504c8.161-8.161,21.386-8.161,29.539,0l64.013,64.004c8.161,8.161,5.422,14.77-6.121,14.77c0,0-6.909,0-15.444,0c-8.535,0-15.444,7.275-15.444,16.257v46.414c0,11.534-9.356,20.89-20.89,20.89h-41.781c-11.534,0-20.89-9.356-20.89-20.89v-46.414c0-8.982-6.909-16.257-15.444-16.257h-15.444c-11.534,0-14.274-6.617-6.121-14.77L305.22,155.504z M229.957,355.459c0.341-8.681,7.43-15.631,16.192-15.631h140.893c8.974,0,16.257,7.283,16.257,16.257c0,8.974-7.283,16.257-16.257,16.257H246.158c-8.763,0-15.859-6.95-16.192-15.631v-1.252H229.957z M213.7,264.508v145.095v24.386v0.488c0,7.576-6.161,13.737-13.737,13.737H29.994c-7.576,0-13.737-6.161-13.737-13.737V264.508c0-7.576,6.161-13.737,13.737-13.737h24.459h24.386h65.029h24.386h31.71C207.539,250.771,213.7,256.94,213.7,264.508z"
                      ></path>
                      <path
                        style={{ fill: "#2457d7" }}
                        d="M401.698,18.505c-3.959-3.601-14.453-6.519-23.427-6.519H112.345c-8.982,0-13.339,2.918-9.738,6.519s13.794,6.519,22.776,6.519h267.235C401.592,25.024,405.657,22.106,401.698,18.505z"
                      ></path>
                      <path
                        style={{ fill: "#2457d7" }}
                        d="M177.374,77.014h272.429c8.982,0,11.047-4.739,4.617-10.583c-6.43-5.844-18.923-10.583-27.897-10.583H156.199c-8.982,0-11.518,4.739-5.674,10.583C156.369,72.275,168.392,77.014,177.374,77.014z"
                      ></path>
                      <path
                        style={{ fill: "#2457d7" }}
                        d="M74.791,329.854c-3.381,0-6.121,5.08-6.121,11.347v11.348v53.681c0,8.982,7.275,16.257,16.257,16.257h48.381c0,0,6.267,0,13.989,0s13.989-7.275,13.989-16.257v-60.111c0-8.982-3.902-16.257-8.714-16.257h-8.714H80.912C80.912,329.854,78.173,329.854,74.791,329.854z M121.482,400.946h-8.072c0,0-2.91,0-6.495,0s-5.674-2.252-4.65-5.032l1.845-5.032c0,0,0.853-2.325,1.91-5.194c1.057-2.869-1.463-6.852-3.707-10.575c-1.317-2.187-2.081-4.747-2.081-7.503c0-4.503,2.065-8.486,5.243-11.193c2.577-2.187,5.869-3.56,9.51-3.56c8.145,0,14.753,6.6,14.753,14.753c0,4.064-1.642,7.738-4.3,10.405c-0.504,0.504-1.04,0.951-1.609,1.357c-0.943,0.675-0.106,5.698,1.967,11.348C127.871,396.37,125.936,400.946,121.482,400.946z"
                      ></path>
                      <path
                        style={{ fill: "#2457d7" }}
                        d="M92.219,306.126v-15.948c0-3.048,2.487-5.536,5.536-5.536h33.408c3.048,0,5.536,2.487,5.536,5.536c0,0,0,7.137,0,15.948c0,8.811,1.609,15.948,3.585,15.948h3.585c0,0,2.032,0,4.544,0c2.512,0,4.544-7.137,4.544-15.948v-15.948c0-7.259-3.601-13.664-9.08-17.623c-3.585-2.593-8.022-4.155-12.888-4.155H90.614c-4.867,0-9.304,1.562-12.888,4.155c-5.48,3.959-9.08,10.364-9.08,17.623v15.948c0,8.811,2.032,15.948,4.544,15.948h3.585C90.609,322.073,92.219,314.937,92.219,306.126z"
                      ></path>
                    </g>
                  </g>
                </svg>
                {/* <Image
                  src="/document.png"
                  alt="document"
                  className="dark:invert"
                  width={100}
                  height={24}
                  priority
                /> */}
              </div>
              <span className="font-semibold text-[18px] 2xl:text-[20px]">
                It appears that you haven’t uploaded any documents yet.
              </span>
              <p className="text-[15px] leading-7 2xl:text-[20px] my-1">
                We encourage you to add key documents that you frequently share
                with your prospects and clients. We will index them to improve
                the accuracy of Komcrest Generative AI.
              </p>
              <Button
                radius="none"
                size="sm"
                className="text-white px-[10px] text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-btn-primary w-max rounded-[4px] my-4"
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
        ))}
    </div>
  );
};

export default AddDocument;
