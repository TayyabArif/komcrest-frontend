import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import UsersDetailsCard from "./UsersDetailsCard";
import UsersSettingsCard from "./UsersSettingsCard";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useDisclosure } from "@nextui-org/react";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { useCookies } from "react-cookie";

const modalData = {
  heading: "Create User",
  desc: "Verify information before confirming",
  confirmText: "Send invitation",
};
const CreateUser = () => {
  const [cookies] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [isClick, setClick] = useState(false);
  const [allCompanies, setAllCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    role: "Contributor",
    companyId: null,
  });

  useEffect(() => {
    const ids = products && products.map((item) => item.id);
    setSelectedProducts(ids);
  }, [products]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        role: checked ? name : "",
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    if (name === "companyId") {
      const company = allCompanies.find(
        (company) => company.id.toString() === value
      );
      setProducts(company?.Products || []);
    }
  };
  const handleProductsChange = (e) => {
    const { name, value, type, checked } = e.target;
    const convertedValue = parseInt(value);
    setSelectedProducts((prevProducts) => {
      if (checked) {
        return [...prevProducts, convertedValue];
      } else {
        return prevProducts.filter((item) => item !== convertedValue);
      }
    });
  };

  useEffect(() => {
    getAllCompanies();
  }, []);

  const getAllCompanies = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Host", "");
    const token = cookiesData.token;
    const formdata = new FormData();

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    fetch(`${baseUrl}/companies`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const response = JSON.parse(result);
        setAllCompanies(response);
      })
      .catch((error) => console.error(error));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const token = cookiesData.token;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    const raw = JSON.stringify({
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      email: formData?.email,
      position: formData?.position,
      role: formData?.role,
      companyId: parseInt(formData?.companyId),
      products: selectedProducts,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${baseUrl}/users`, requestOptions)
      .then((response) => {
        return response.json().then((data) => ({
          status: response.status,
          ok: response.ok,
          data,
        }));
      })
      .then(({ status, ok, data }) => {
        if (ok) {
          toast.success("User created successfully");
          router.push("/admin/user-management");
        } else {
          toast.error(data?.error);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex flex-col justify-between w-full gap-5 pl-20 pr-10 py-10 bg-gray-200 min-h-screen ">
        <div className="flex items-start justify-start w-full gap-10 pl-20 h-full">
          <UsersDetailsCard
            action="create"
            isDisabled={false}
            formData={formData}
            handleChange={(value) => handleChange(value)}
            allCompanies={allCompanies}
          />
          <UsersSettingsCard
            action="create"
            formData={formData}
            handleChange={(value) => handleChange(value)}
            products={products}
            handleProductsChange={handleProductsChange}
            selectedProducts={selectedProducts}
          />
        </div>
        <div className="flex justify-end mb-5 pr-16">
          <div>
            <div className="flex items-center gap-5">
              <Button
                radius="none"
                size="sm"
                className="text-[#c51317] px-5 h-[28px] text-sm bg-[#f5c8d1] font-bold w-max rounded-[4px]"
                onClick={() => router.push("/admin/user-management")}
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
                  !formData?.firstName ||
                  !formData?.lastName ||
                  !formData?.position ||
                  !formData?.role ||
                  !formData?.email ||
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

export default CreateUser;
