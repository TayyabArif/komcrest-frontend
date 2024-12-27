import React, { useState } from "react";
import CompanyInfoCard from "./CompanyInfoCard";
import CompanyProductCard from "./CompanyProductCard";
import { Button } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import CompanyPlan from "./CompanyPlan";

const modalData = {
  heading: "Create Company",
  desc: "Verify information before confirming",
  confirmText: "Send invitation",
};

const CreateCompany = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cookies] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyDomain: "",
    firstName: "",
    lastName: "",
    companyType: "vendor",
    displayTOS: false,
    displayPrivacyPolicy: false,
    companyPlan : ""
  });
  const [products, setProducts] = useState([]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "vendor" || name === "purchaser") {
        setFormData((prevState) => ({
          ...prevState,
          companyType: name === "vendor" ? "vendor" : "purchaser",
        }));
      } else if (name === "displayTOSYes" || name === "displayTOSNo") {
        setFormData((prevState) => ({
          ...prevState,
          displayTOS: name === "displayTOSYes" ? checked : !checked,
        }));
      } else if (
        name === "displayPrivacyPolicyYes" ||
        name === "displayPrivacyPolicyNo"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          displayPrivacyPolicy:
            name === "displayPrivacyPolicyYes" ? checked : !checked,
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
    setIsLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      name: formData?.companyName,
      subdomain: formData?.companyDomain,
      companyType: formData?.companyType,
      email: formData?.companyEmail,
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      products,
      termsServices: formData?.displayTOS,
      privacyPolicy: formData?.displayPrivacyPolicy,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${baseUrl}/companies-with-products`, requestOptions)
      .then((response) => {
        return response.json().then((data) => ({
          status: response.status,
          ok: response.ok,
          data,
        }));
      })
      .then(({ status, ok, data }) => {
        if (ok) {
          toast.success("Company created successfully");
          router.push("/admin/company-settings");
        } else {
          toast.error(data?.details?.errors[0]?.message);
        }
      })
      .catch((error) => console.error(">>>>>>", error))
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="flex flex-col w-full bg-gray-200">
      <div className="flex flex-col justify-between w-[80%] mx-auto gap-5   bg-gray-200 min-h-screen ">
      
          <div className="flex justify-center  gap-10 w-full">
            <CompanyInfoCard
              action="create"
              formData={formData}
              handleChange={(value) => handleChange(value)}
            />

            <CompanyProductCard
              action="create"
              setProducts={setProducts}
              products={products}
            />
          </div>
          <div>
            <CompanyPlan setFormData={setFormData} formData={formData}/>
          </div>
        
        <div className="flex justify-end mb-5 ">
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
                isLoading={isLoading}
                isDisabled={
                  !formData?.companyName ||
                  !formData?.companyDomain ||
                  !formData?.companyEmail ||
                  isLoading
                }
              >
                Send invitation
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
    </div>
  );
};

export default CreateCompany;
