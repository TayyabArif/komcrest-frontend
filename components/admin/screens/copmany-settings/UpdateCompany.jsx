import React, { useEffect, useState } from "react";
import CompanyInfoCard from "./CompanyInfoCard";
import CompanyProductCard from "./CompanyProductCard";
import { Button } from "@nextui-org/react";
import { useDisclosure, CircularProgress } from "@nextui-org/react";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

const modalData = {
  heading: "Create Company",
  desc: "Verify information before confirming",
  confirmText: "Update company",
};

const UpdateCompany = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [cookies] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [isLoading, setIsLoading] = useState(false)
  const [isCompanyLoading, setIsCompanyLoading] = useState(true)
  const [products, setProducts] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const { id } = router.query;
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyDomain: "",
    companyType: "",
    displayTOS: false,
    displayPrivacyPolicy: false,
  });
  useEffect(() => {
    if (id) {
      const token = cookiesData.token;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
      };

      fetch(`${baseUrl}/companies/${id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const companyData = JSON.parse(result)
          setFormData({
            companyName: companyData?.name,
            companyEmail: companyData?.email,
            companyDomain: companyData?.subdomain,
            companyType: companyData?.companyType,
            displayTOS: companyData?.termsServices,
            displayPrivacyPolicy: companyData?.privacyPolicy,
          });
          const filteredProducts = companyData?.Products.map((item) => item.name)
          setProducts(filteredProducts || [])
          console.log(companyData);
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setTimeout(() => {
            setIsCompanyLoading(false);
          }, 500);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if(name==="vendor" || name === "purchaser") {
        setFormData((prevState) => ({
          ...prevState,
          companyType: name === "vendor" ? 'vendor' : 'purchaser',
        }));
      } else if (name==="displayTOSYes" || name === "displayTOSNo") {
        setFormData((prevState) => ({
          ...prevState,
          displayTOS: name === "displayTOSYes" ? checked : !checked,
        }));
      }
      else if (name==="displayPrivacyPolicyYes" || name === "displayPrivacyPolicyNo") {
        setFormData((prevState) => ({
          ...prevState,
          displayPrivacyPolicy: name === "displayPrivacyPolicyYes" ? checked : !checked,
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async () => {
    const token = cookiesData.token;
    setIsLoading(true)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      name: formData?.companyName,
      subdomain: formData?.companyDomain,
      companyType: formData?.companyType,
      email: formData?.companyEmail,
      products,
      termsServices: formData?.displayTOS,
      privacyPolicy: formData?.displayPrivacyPolicy
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${baseUrl}/companies/${id}`, requestOptions)
      .then((response) => {
        return response.json().then((data) => ({
          status: response.status,
          ok: response.ok,
          data,
        }));
      })
      .then(({ status, ok, data }) => {
        if (ok){
          toast.success("Company updated successfully")
          router.push("/admin/company-settings")
        }else{
          toast.error(data?.details?.errors[0]?.message)
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col w-full bg-white">
      {isCompanyLoading ?
      <div className='flex flex-col gap-2 bg-gray-200 items-center justify-center pl-20 pr-10 py-3 min-h-screen'>
        <CircularProgress label="Fetching Company......" size="lg"/>
      </div>
      :
        <>
          <div className="flex flex-col justify-between w-full gap-5 pl-20 pr-10 py-10 bg-gray-200 min-h-screen ">
            <div className="flex justify-start w-full gap-10 pl-20">
              <CompanyInfoCard
                action="update"
                formData={formData}
                handleChange={(value) => handleChange(value)}
              />
              <CompanyProductCard
                action="update"
                setProducts={setProducts}
                products={products}
              />
            </div>
            <div className="flex justify-end mb-5 pr-16">
              <div>
                <div className="flex items-center gap-5">
                  <Button
                    radius="none"
                    size="sm"
                    className="text-[#c51317] px-5 h-[28px] text-sm bg-[#f5c8d1] font-bold w-max rounded-[4px]"
                    onPress={() => router.push("/admin/company-settings")}
                  >
                    Cancel
                  </Button>
                  <Button
                    radius="none"
                    size="sm"
                    className="text-white px-5 h-[28px] text-sm bg-btn-primary w-max rounded-[4px]"
                    onPress={onOpen}
                    isDisabled={!formData?.companyName || !formData?.companyDomain || !formData?.companyEmail}
                  >
                    Update Company
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <ConfirmationModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            data={modalData}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </>
      }
    </div>
  );
};

export default UpdateCompany;
