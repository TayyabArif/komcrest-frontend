import React, { useState } from "react";
import { Euro, X } from "lucide-react";
import { Input, Button, Checkbox } from "@nextui-org/react";
import ChoosePlan from "./ChoosePlan";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Image from "next/image";
import { publicDomain } from "@/constants";

const RegistrationForm = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [planId, setPlanId] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
      setFormErrors((prev) => ({
        ...prev,
        products: "",
      }));
      setProducts([...products, product]);
      setProduct("");
    }
  };

  const handleRemoveProduct = (index) => {
    const newProducts = products.filter((_, idx) => idx !== index);
    setProducts(newProducts);
  };

  const handleFormSubmit = () => {
    if (publicDomain.includes(registerFormData.subdomain)) {
      setFormErrors({ subdomain: "Domain not Available" });
      return;
    }

    if (!planId) {
      setFormErrors({ plan: "Please select a subscription plan." });
      return;
    }
    if (products.length == 0) {
      setFormErrors({ products: "Please add products." });
      return;
    }
    setIsLoading(true);
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
          router.push(
            `http://app.komcrest.com/registration/thank-you`
          );
        } else {
          setFormErrors({
            ...formErrors,
            subdomain: data.message.subdomain,
            email: data.message.email,
          });
        }
      })
      .catch((error) => console.error("+++", error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="w-[90%] lg:w-[80%] xl:w-[70%]  mx-auto my-10">
      {/* {JSON.stringify(companyPlan)} */}
      <div className="text-center">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Komcrest Logo" width={230} height={230} />
        </div>
        <h1 className="md:text-[35px] text-[30px]">Essai gratuit</h1>
        <p className="text-standard">
    Merci pour l&apos;intérêt que vous portez à notre solution de réponse automatisée aux questionnaires de sécurité et de conformité.
</p>
<p className="text-standard">
    Dans quelques instants vous allez pouvoir tester gratuitement l&apos;intégralité des fonctionnalités qu&apos;offre Komcrest, et ce pendant 7 jours.
</p>

      </div>
      <div className="bg-blue-600 my-10">
        <div className="w-full relative bottom-2  -ml-2 border-2 bg-white border-black text-center md:p-5 p-2  lg:px-10">
          <ChoosePlan setPlanId={setPlanId} planId={planId} />
          {formErrors.plan && <p className="text-red-500">{formErrors.plan}</p>}
          <div className="text-left mt-10 space-y-10 ">
            <div>
              <h1 className="md:text-[30px] text-[25px] font-bold">Name of your company</h1>
              <p>
                Your company name will be used for your domain
                societe.komcrest.com
              </p>
              <div className="md:flex gap-10">
                <div className="md:w-[30%]">
                  <div className="flex items-end gap-4">
                    <Input
                      label="Domain Name"
                      name="subdomain"
                      value={registerFormData.subdomain}
                      onChange={handleInputChange}
                      type="text"
                      variant="underlined"
                      size="md"
                      radius="sm"
                      classNames={{
                        input: "text-standard",
                      }}
                    />
                    <span className="text-standard">komcrest.com</span>
                  </div>
                  {formErrors.subdomain && (
                    <p className="text-red-500 text-sm">
                      {formErrors.subdomain}
                    </p>
                  )}
                </div>
                <div className="flex md:w-[30%] items-end gap-4">
                  <Input
                    label="Company Name"
                    name="name"
                    value={registerFormData.name}
                    onChange={handleInputChange}
                    type="text"
                    variant="underlined"
                    size="md"
                    classNames={{
                      input: "text-standard",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="text-standard">
              <h1 className="md:text-[30px] text-[25px] font-bold">Your information</h1>
              <p className="text-standard">
                To ensure your request is processed quickly, please provide your
                email and professional telephone number.
              </p>
              <div className="md:flex md:w-[70%] gap-4">
                <Input
                  label="Your first name"
                  name="firstName"
                  value={registerFormData.firstName}
                  onChange={handleInputChange}
                  type="text"
                  size="md"
                  classNames={{
                    input: "text-standard",
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
                    input: "text-standard",
                  }}
                />
              </div>
              <div className="md:flex md:w-[70%] gap-4">
                <div className="w-full">
                  <Input
                    label="Your professional email"
                    name="email"
                    value={registerFormData.email}
                    onChange={handleInputChange}
                    type="email"
                    variant="underlined"
                    size="md"
                    classNames={{
                      input: "text-standard w-full",
                    }}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm">{formErrors.email}</p>
                  )}
                </div>
                <Input
                  label="Your phone number"
                  name="phoneNumber"
                  value={registerFormData.phoneNumber}
                  onChange={handleInputChange}
                  type="text"
                  variant="underlined"
                  size="md"
                  classNames={{
                    input: "text-standard",
                  }}
                />
              </div>
            </div>

            <div>
              <h1 className="md:text-[30px] text-[25px] font-bold">Your products</h1>
              <p className="text-standard">
                Provide information on the different products you sell that
                require you to answer dedicated questionnaires.
              </p>
              <div className="flex items-center gap-4 mt-2 md:w-[70%]">
                <Input
                  type="text"
                  placeholder="Enter Product"
                  variant="underlined"
                  value={product}
                  size="md"
                  classNames={{
                    input: "text-standard",
                  }}
                  onChange={(e) => setProduct(e.target.value)}
                />
                <Button
                  className="text-white px-[10px] text-sm bg-btn-primary w-max rounded-[4px]"
                  onPress={handleAddProduct}
                  size="sm"
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
              isSelected={
                registerFormData.termsServices && registerFormData.privacyPolicy
              }
              onChange={handleCheckboxChange}
              radius="none"
              size="lg"
              classNames={{
                label: "!rounded-[3px] text-standard",
                wrapper: "!rounded-[3px]" 
              }}
             
            >
              I accept the general conditions of sale and use
            </Checkbox>

            <div className="flex justify-center">
              <Button
                isDisabled={
                  !registerFormData.email ||
                  !registerFormData.termsServices ||
                  !registerFormData.privacyPolicy ||
                  !registerFormData.subdomain
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
