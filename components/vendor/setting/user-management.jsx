import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import UsersDetailsCard from "@/components/admin/screens/user-management/UsersDetailsCard";
import UsersSettingsCard from "@/components/admin/screens/user-management/UsersSettingsCard";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useDisclosure } from "@nextui-org/react";
import ConfirmationModal from "@/components/admin/shared/ConfirmationModal";
import { useCookies } from "react-cookie";
import { useMyContext } from "@/context";


const UserManagement = ({role,showRemoveBtn ,isEdit}) => {
  const { companyProducts, setDataUpdated } = useMyContext();
  const [cookies] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [isClick, setClick] = useState(false);
  const [allCompanies, setAllCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isMounted, setIsMounted] = useState(false);
  const modalData = {
    heading: id ? "Update User" : "Create User",
    desc: id ? "Verify information before updating" : "Verify information before confirming",
    confirmText: id ? "Update User" : "Send Invitation",
  };
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    role: "Contributor",
    companyId: "",
  });

  useEffect(() => {
    if (cookiesData?.companyId) {
      setFormData((prevState) => ({
        ...prevState,
        companyId: cookiesData?.companyId,
      }));
      setIsMounted(true);
    }
  }, [cookiesData]);

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

    // const isUpdating = !!id; // Check if "id" exists
    const requestOptions = {
      method: id ? "PUT" : "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = id
      ? `${baseUrl}/users/${id}` // Update URL
      : `${baseUrl}/users`; // Create URL

    fetch(url, requestOptions)
      .then((response) =>
        response.json().then((data) => ({
          status: response.status,
          ok: response.ok,
          data,
        }))
      )
      .then(({ status, ok, data }) => {
        if (ok) {
          setDataUpdated((prev) => !prev);
          toast.success(
            id ? "User updated successfully" : "User created successfully"
          );
          router.push("/vendor/setting/user-management");
        } else {
          toast.error(data?.error);
          console.error("Error:", data);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const token = cookiesData.token;
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
      };

      fetch(`${baseUrl}/users/${id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const userData = JSON.parse(result);
          console.log("+++++++++++++++++++")
          setFormData({
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            email: userData?.email,
            position: userData?.position,
            role: userData?.role,
            companyId: userData?.companyId,
          });
          console.log(userData);
          // setIsDataLoaded(true);
          const filteredProducts = userData?.Products?.map((item) => item.id);
         
          setProducts( userData?.Products || [])
          setSelectedProducts(filteredProducts);
        })
        .catch((error) => console.error(error));
    }
  }, [id]);

  return (
    <>
      {isMounted && (
        <div className="flex flex-col   w-[80%] mx-auto">
          <div className="flex flex-col w-full gap-5   py-10  min-h-screen">
            <div className="flex items-start justify-between w-full h-full">
              <UsersDetailsCard
                isDisabled={true}
                formData={formData}
                handleChange={(value) => handleChange(value)}
                allCompanies={allCompanies}
                role={role}
                isEdit={isEdit}
              />
              <UsersSettingsCard
                formData={formData}
                handleChange={(value) => handleChange(value)}
                products={companyProducts}
                handleProductsChange={handleProductsChange}
                selectedProducts={selectedProducts}
                role={role}
                showRemoveBtn={showRemoveBtn}
                isEdit={isEdit}
              />
            </div>
            <div className="flex justify-end mb-5 ">
              <div>
                <div className="flex items-center gap-5">
                  <Button
                    radius="none"
                    size="md"
                    className="rounded-md 2xl:text-[20px] text-[16px] bg-red-200 text-red-500 font-semibold"
                    onClick={() => router.push("/vendor/setting/user-management")}
                  >
                    Cancel
                  </Button>
                  <Button
                    radius="none"
                    size="md"
                    className="text-white rounded-md 2xl:text-[20px] text-[16px]  bg-btn-primary"
                    onPress={onOpen}
                    isLoading={isLoading}
                    isDisabled={
                      !formData?.firstName ||
                      !formData?.lastName ||
                      !formData?.role ||
                      !formData?.email ||
                      isLoading
                    }
                  >
                    {id ? "Update" : "Send invitation"}
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
      )}
    </>
  );
};

export default UserManagement;
