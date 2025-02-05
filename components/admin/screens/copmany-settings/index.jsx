import React, { useEffect, useState } from "react";
import { Button, CircularProgress } from "@nextui-org/react";
import CompaniesTable from "./CompaniesTable";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

const CompanySettings = () => {
  const [allCompanies, setAllCompanies] = useState([])
  const [cookies] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  useEffect(() => {
    getAllCompanies();
  }, [isDeleted]);

  const getAllCompanies = async () => {
    const token = cookiesData.token;
    setIsLoading(true)
    const myHeaders = new Headers();
    myHeaders.append("Host", "");

    const formdata = new FormData();

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    fetch(`${baseUrl}/companies`, requestOptions)
      .then((response) => {
        return response.json().then((data) => ({
          status: response.status,
          ok: response.ok,
          data,
        }));
      })
      .then(({ status, ok, data }) => {
        if (ok) {
          setAllCompanies(data.sort((a, b) =>  b.id - a.id))
        } else {
          toast.error("Error while fetching companies, please contact support team")
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      })
  };
  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex justify-between items-start bg-gray-50 pl-20 pr-10 py-6">
        <div>
          <p className="font-semibold">Setup companies in Komcrest</p>
          <p>
            Fill in company information to create company profile and tenant
          </p>
        </div>
        <Button
          radius="none"
          size="sm"
          className="text-white px-[25px] text-sm bg-btn-primary w-max rounded-[4px] -ml-1"
          onClick={() =>
            router.push("/admin/company-settings/create-new-company")
          }
        >
          Activate company
        </Button>
      </div>
      {isLoading ?
        <div className='flex flex-col gap-2 bg-gray-200 items-center justify-center pl-20 pr-10 py-3 min-h-screen'>
          <CircularProgress label="Fetching Companies..." size="lg" />
        </div>
        :
        <CompaniesTable allCompanies={allCompanies} setAllCompanies={setAllCompanies} isDeleted={isDeleted} setIsDeleted={setIsDeleted} />
      }
    </div>
  );
};

export default CompanySettings;
