import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import UsersDetailsCard from "./UsersDetailsCard";
import UsersSettingsCard from "./UsersSettingsCard";
import { useDisclosure } from "@nextui-org/react";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

const UpdateUser = () => {
  const [cookies] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const [isClick, setClick] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false)
  const [allCompanies, setAllCompanies] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const { id } = router.query;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    role: "",
    companyId: null
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevState => ({
          ...prevState,
          role: checked ? name : ''
      }));
  } else {
      setFormData(prevState => ({
          ...prevState,
          [name]: value
      }));
  }
  if (name === 'companyId') {
    const company = allCompanies.find(company => company.id.toString() === value);
    const filteredProducts = company?.Products?.map((item) => item.name)
    setProducts(filteredProducts || [])
}
  };

  const handleProductsChange = (e) => {
    const { name, value, type, checked } = e.target;
    const convertedValue = parseInt(value)
    setSelectedProducts(prevProducts => {
      if (checked) {
        return [...prevProducts, convertedValue];
      } else {
        return prevProducts.filter(item => item !== convertedValue);
      }
    });
  }

  useEffect(() => {
    getAllCompanies();
  }, []);
  useEffect(() => {
    if (formData?.companyId && allCompanies.length > 0) {
      getSelectedCompany(formData?.companyId);
    }
  }, [formData?.companyId , allCompanies]);

  const getSelectedCompany = (companyId) => {
    const selectedCompany = allCompanies.find(company => company.id === companyId);
    
    if (selectedCompany) {
        setProducts( selectedCompany?.Products || [])
    } 
};

  const getAllCompanies = async () => {
    setIsLoading(true)
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
        const response = JSON.parse(result)
        setAllCompanies(response)
      })
      .catch((error) => console.error(error))
      .finally(setIsLoading(false))
      ;
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
          const userData = JSON.parse(result)
          setFormData({
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            email: userData?.email,
            position: userData?.position,
            role: userData?.role,
            companyId: userData?.companyId
          });
          console.log(userData);
          setIsDataLoaded(true)
          const filteredProducts = userData?.Products?.map((item) => item.id)
          // setProducts( userData?.Products || [])
          setSelectedProducts(filteredProducts)
        })
        .catch((error) => console.error(error));
    }
  }, [id]);

  const handleSubmit = async () => {
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
      products: selectedProducts
        });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${baseUrl}/users/${id}`, requestOptions)
      .then((response) => {
        return response.json().then((data) => ({
          status: response.status,
          ok: response.ok,
          data,
        }));
      })
      .then(({ status, ok, data }) => {
        if (ok) {
          toast.success("User updated successfully")
          router.push("/admin/user-management")
        } else {
          toast.error(data?.error)
          console.error("Error:", data);
        }
      })
      .catch((error) => console.error(error));
  };
  const modalData = {
    heading: "Update User",
    desc: "Verify information before confirming",
    confirmText: "Update user",
  }

  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex flex-col justify-between w-full gap-5 pl-20 pr-10 py-10 bg-gray-200 min-h-screen ">
        <div className="flex items-start justify-start w-full gap-10 pl-20">
        {isDataLoaded && formData && (
          <>
            <UsersDetailsCard 
              isDisabled={false}
              formData={formData}
              handleChange={(value) => handleChange(value)}
              allCompanies={allCompanies}
              isEdit={isEdit}
            />
            <UsersSettingsCard 
              formData={formData}
              handleProductsChange={handleProductsChange}
              products={products}
              selectedProducts={selectedProducts}
              isEdit={isEdit}
            />
          </>
        )}
        </div>
        <div className="flex justify-end mb-5 pr-16">
          <div>
            <div className="flex items-center gap-5">
              <Button
                radius="none"
                size="sm"
                className="text-[#c51317] px-5 h-[28px] text-sm bg-[#f5c8d1] font-bold w-max rounded-[4px]"
                onClick={()=>router.push("/admin/user-management")}
              >
                Cancel
              </Button>
              <Button
                radius="none"
                size="sm"
                className="text-white px-5 h-[28px] text-sm bg-btn-primary w-max rounded-[4px]"
                onPress={onOpen}
                isDisabled={!formData?.firstName || !formData?.lastName || !formData?.position || !formData?.role || !formData?.email}
              >
                 Update user
              </Button>
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
    </div>
  );
};

export default UpdateUser;
