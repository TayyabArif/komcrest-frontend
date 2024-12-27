import React, { useState } from "react";
import { Euro, X } from "lucide-react";
import { Input, Button, Checkbox } from "@nextui-org/react";
import ChoosePlan from "./ChoosePlan";

const RegistrationForm = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [registerFormData, setRegisterFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyDomain: "",
    firstName: "",
    lastName: "",
    companyType: "vendor",
    displayTOS: false,
    displayPrivacyPolicy: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setRegisterFormData((prev) => ({
      ...prev,
      displayTOS: !prev.displayTOS,
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
    if (!selectedPlan) {
      setFormErrors({ plan: "Please select a subscription plan." });
      return;
    }
    console.log("Registration Data:", {
      ...registerFormData,
      products,
      selectedPlan,
    });
  };

  return (
    <div className="w-[65%] mx-auto my-10">
      <div className="text-center">
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
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
          />
          {formErrors.plan && <p className="text-red-500">{formErrors.plan}</p>}
          <div className="text-left mt-10 space-y-10">
            <div>
              <h1 className="text-[30px] font-bold">Name of your company</h1>
              <p>
                Your company name will be used for your domain
                societe.komcrest.com
              </p>
              <div className="flex w-[30%] items-end gap-4">
                <Input
                  label="Society (no accent)"
                  name="companyDomain"
                  value={registerFormData.companyDomain}
                  onChange={handleInputChange}
                  type="text"
                  variant="underlined"
                />
                <span>komcrest.com</span>
              </div>
            </div>

            <div>
              <h1 className="text-[30px] font-bold">Your information</h1>
              <p>
                To ensure your request is processed quickly, please provide your
                email and professional telephone number.
              </p>
              <div className="flex w-[50%] gap-4">
                <Input
                  label="Your first name"
                  name="firstName"
                  value={registerFormData.firstName}
                  onChange={handleInputChange}
                  type="text"
                  variant="underlined"
                />
                <Input
                  label="Your last name"
                  name="lastName"
                  value={registerFormData.lastName}
                  onChange={handleInputChange}
                  type="text"
                  variant="underlined"
                />
              </div>
              <div className="flex w-[50%] gap-4">
                <Input
                  label="Your professional email"
                  name="companyEmail"
                  value={registerFormData.companyEmail}
                  onChange={handleInputChange}
                  type="email"
                  variant="underlined"
                />
                <Input
                  label="Your phone number"
                  name="companyDomain"
                  value={registerFormData.companyDomain}
                  onChange={handleInputChange}
                  type="text"
                  variant="underlined"
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
                  onChange={(e) => setProduct(e.target.value)}
                />
                <Button
                  className="text-white px-[10px] text-sm bg-btn-primary w-max rounded-[4px]"
                  onPress={handleAddProduct}
                >
                  Add
                </Button>
              </div>
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
              size="md"
              isSelected={registerFormData.displayTOS}
              onChange={handleCheckboxChange}
              classNames={{ wrapper: "!rounded-[3px]" }}
              radius="none"
            >
              I accept the general conditions of sale and use
            </Checkbox>

            <div className="flex justify-center">
              <Button
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






