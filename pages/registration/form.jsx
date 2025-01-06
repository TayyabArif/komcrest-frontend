import React, { useState } from "react";
import { Euro, X } from "lucide-react";
import { Input, Button, Checkbox } from "@nextui-org/react";
import ChoosePlan from "./ChoosePlan";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Image from "next/image";




const RegistrationForm = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [planId, setPlanId] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    subdomain: "",
    firstName: "",
    lastName: "",
    companyType: "vendor",
    termsServices: false,
    privacyPolicy: false,
    phoneNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prev) => ({
      ...prev,
      [name]: "", 
    }));
  
    setRegisterFormData((prev) => ({ ...prev, [name]: value }));
  };
  


  const handleCheckboxChange = () => {
    setRegisterFormData((prev) => ({
      ...prev,
      termsServices: !prev.termsServices,
      privacyPolicy: !prev.privacyPolicy,
    }));
  };

  const handleAddProduct = () => {
    if (product) {
      setProducts([...products, product]);
      setProduct("");
    }
  };

  const handleRemoveProduct = (index) => {
    const newProducts = products.filter((_, idx) => idx !== index);
    setProducts(newProducts);
  };

  const handleFormSubmit = () => {

    if (!planId) {
      setFormErrors({ plan: "Please select a subscription plan." });
      return;
    } if (products.length == 0 ) {
      setFormErrors({ products: "Please add products." });
      return;
    }



    setIsLoading(true)


    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const payLoad = JSON.stringify({
      ...registerFormData,
      products,
      planId,
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: payLoad,
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
          router.push(`http://app.${process.env.NEXT_PUBLIC_FRONTEND_URL}/registration/thank-you`);
        } else {
          setFormErrors({ 
            ...formErrors,
            subdomain: "Domain Already Exit" });
        }
      })
      .catch((error) => console.error(">>>>>>", error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="w-[65%] mx-auto my-10">
      {/* {JSON.stringify(companyPlan)} */}
      <div className="text-center">
      <div className="flex justify-center">
          <Image src="/logo.png" alt="Komcrest Logo" width={230} height={230} />
        </div>
        <h1 className="text-[40px]">Free trial</h1>
        <p className="text-[22px]">
          Thank you for your interest in our automated security and compliance
          questionnaire response solution.
        </p>
        <p className="text-[22px]">
          In a few moments, you will be able to test all of the features that
          Komcrest offers for free, for 7 days.
        </p>
      </div>

      <div className="bg-blue-600 my-10">
        <div className="w-full relative bottom-2  -ml-2 border-2 bg-white border-black text-center p-5 px-10">
          <ChoosePlan
            setPlanId={setPlanId}
            planId={planId}
          />
          {formErrors.plan && <p className="text-red-500">{formErrors.plan}</p>}
          <div className="text-left mt-10 space-y-10">
            <div>
              <h1 className="text-[30px] font-bold">Name of your company</h1>
              <p>
                Your company name will be used for your domain
                societe.komcrest.com
              </p>
              <div className="flex gap-10">
                <div className="w-[30%]">

               
                <div className="flex items-end gap-4">
                  <Input
                    label="Domain Name"
                    name="subdomain"
                    value={registerFormData.subdomain}
                    onChange={handleInputChange}
                    type="text"
                    variant="underlined"
                    size="md"
                    classNames={{
                      input: "text-base 2xl:text-[20px]",
                    }}
                  />
                  <span>komcrest.com</span>
                </div>
                {formErrors.subdomain && (
                  <p className="text-red-500 text-sm">{formErrors.subdomain}</p>
                )}
                 </div>
                <div className="flex w-[30%] items-end gap-4">
                  <Input
                    label="Company Name"
                    name="name"
                    value={registerFormData.name}
                    onChange={handleInputChange}
                    type="text"
                    variant="underlined"
                    size="md"
                    classNames={{
                      input: "text-base 2xl:text-[20px]",
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-[30px] font-bold">Your information</h1>
              <p>
                To ensure your request is processed quickly, please provide your
                email and professional telephone number.
              </p>
              <div className="flex w-[70%] gap-4">
                <Input
                  label="Your first name"
                  name="firstName"
                  value={registerFormData.firstName}
                  onChange={handleInputChange}
                  type="text"
                  size="md"
                  classNames={{
                    input: "text-base 2xl:text-[20px]",
                  }}
                  variant="underlined"
                />
                <Input
                  label="Your last name"
                  name="lastName"
                  value={registerFormData.lastName}
                  onChange={handleInputChange}
                  type="text"
                  variant="underlined"
                  size="md"
                  classNames={{
                    input: "text-base 2xl:text-[20px]",
                  }}
                />
              </div>
              <div className="flex w-[70%] gap-4">
                <Input
                  label="Your professional email"
                  name="email"
                  value={registerFormData.email}
                  onChange={handleInputChange}
                  type="email"
                  variant="underlined"
                  size="md"
                  classNames={{
                    input: "text-base 2xl:text-[20px]",
                  }}
                />
                <Input
                  label="Your phone number"
                  name="phoneNumber"
                  value={registerFormData.phoneNumber}
                  onChange={handleInputChange}
                  type="text"
                  variant="underlined"
                  size="md"
                  classNames={{
                    input: "text-base 2xl:text-[20px]",
                  }}
                />
              </div>
            </div>

            <div>
              <h1 className="text-[30px] font-bold">Your products</h1>
              <p>
                Provide information on the different products you sell that
                require you to answer dedicated questionnaires.
              </p>
              <div className="flex items-center gap-4 mt-2 w-[70%]">
                <Input
                  type="text"
                  placeholder="Enter Product"
                  variant="underlined"
                  value={product}
                  size="md"
                  classNames={{
                    input: "text-base 2xl:text-[20px]",
                  }}
                  onChange={(e) => setProduct(e.target.value)}
                />
                <Button
                  className="text-white px-[10px] text-sm bg-btn-primary w-max rounded-[4px]"
                  onPress={handleAddProduct}
                >
                  Add
                </Button>
              </div>
              {formErrors.products && (
                  <p className="text-red-500 text-sm">{formErrors.products}</p>
                )}
              <div className="flex flex-col px-4 gap-2 my-4">
                {products.map((product, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <X
                      color="#e91616"
                      strokeWidth={4}
                      size={16}
                      onClick={() => handleRemoveProduct(index)}
                    />
                    <p>{product}</p>
                  </div>
                ))}
              </div>
            </div>

            <Checkbox
              size="lg"
              isSelected={
                registerFormData.termsServices && registerFormData.privacyPolicy
              }
              onChange={handleCheckboxChange}
              classNames={{ wrapper: "!rounded-[3px]" }}
              radius="none"
            >
              I accept the general conditions of sale and use
            </Checkbox>

            <div className="flex justify-center">
              <Button
                isDisabled={
                  !registerFormData.email &&
                  !registerFormData.termsServices &&
                  !registerFormData.privacyPolicy &&
                  !registerFormData.companyDomain
                }
                isLoading={isLoading}
                className="text-white  2xl:text-[20px] text-[16px] bg-btn-primary w-max rounded-[4px]"
                onPress={handleFormSubmit}
              >
                Confirm registration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
