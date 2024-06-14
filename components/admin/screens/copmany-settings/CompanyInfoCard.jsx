import React from "react";
import { Input, Checkbox } from "@nextui-org/react";

const CompanyInfoCard = ({ action, handleChange, formData }) => {
  return (
    <div className="flex flex-col bg-white shadow-md w-[45%] min-h-[500px] pb-10 mt-12">
      <p className="px-4 py-4 border border-1.5 border-b-gray-200 border-r-0 border-l-0 border-t-0 font-semibold">
        Company info
      </p>
      <div className="mt-6 px-4">
        <Input
          isRequired
          value={formData.companyName}
          onChange={handleChange}
          name="companyName"
          type="text"
          label="Company name"
          labelPlacement="outside"
          placeholder="Google"
          variant="bordered"
          className="max-w-sm"
          classNames={{ inputWrapper: "rounded-md" }}
        />
      </div>
      <div className="mt-6 px-4">
        <Input
          isRequired
          type="email"
          value={formData.companyEmail}
          onChange={handleChange}
          name="companyEmail"
          label="Company email"
          labelPlacement="outside"
          placeholder="xyz@gmail.com"
          variant="bordered"
          className="max-w-sm"
          classNames={{ inputWrapper: "rounded-md" }}
        />
      </div>
      <div className="mt-6 px-4">
        <Input
          isRequired
          type="text"
          value={formData.companyDomain}
          onChange={handleChange}
          name="companyDomain"
          label="Company domain"
          labelPlacement="outside"
          placeholder="Google.com"
          variant="bordered"
          className="max-w-sm"
          classNames={{ inputWrapper: "rounded-md" }}
        />
      </div>
      {action === "create" && 
        <div className="mt-6 px-4">
          <Input
            isRequired
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            name="firstName"
            label="First name"
            labelPlacement="outside"
            placeholder="John"
            variant="bordered"
            className="max-w-sm"
            classNames={{ inputWrapper: "rounded-md" }}
          />
        </div>
      }
      {action === "create" && 
        <div className="mt-6 px-4">
          <Input
            isRequired
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            name="lastName"
            label="Last name"
            labelPlacement="outside"
            placeholder="Smith"
            variant="bordered"
            className="max-w-sm"
            classNames={{ inputWrapper: "rounded-md" }}
          />
        </div>
      }
      <div className="mt-6 px-4">
        <p className="">
          Company type<span className="text-red-500 ml-0.5">*</span>
        </p>
        <div className="flex itemx-center gap-12 mt-3">
          <Checkbox isSelected={formData.companyType === "vendor"}
          onChange={handleChange}
          value="vendor"
          name="vendor" radius="none" classNames={{ wrapper: "!rounded-[3px]" }}>
            Vendor
          </Checkbox>
          <Checkbox
          isSelected={formData.companyType === "purchaser"}
          onChange={handleChange}
          value="purchaser"
          name="purchaser"
            radius="none"
            classNames={{ wrapper: "!rounded-[3px]" }}
          >
            Purchaser
          </Checkbox>
        </div>
      </div>
      <div className="flex items-center mt-6 px-4">
        <p className="">Display Terms of Services</p>
        <div className="flex itemx-center gap-10 ml-7">
          <Checkbox
          isSelected={formData.displayTOS}
          onChange={handleChange}
          name="displayTOSYes"
          value={true}
           radius="none" classNames={{ wrapper: "!rounded-[3px]" }}>
            Yes
          </Checkbox>
          <Checkbox
            isSelected={!formData.displayTOS}
            onChange={handleChange}
            value={false}
            name="displayTOSNo"
            radius="none"
            classNames={{ wrapper: "!rounded-[3px]" }}
          >
            No
          </Checkbox>
        </div>
      </div>
      <div className="flex items-center mt-8 px-4">
        <p className="">Display Privacy Policies</p>
        <div className="flex itemx-center gap-10 ml-10">
          <Checkbox
          isSelected={formData.displayPrivacyPolicy}
          onChange={handleChange}
          name="displayPrivacyPolicyYes"
          value={true}
          radius="none" classNames={{ wrapper: "!rounded-[3px]" }}>
            Yes
          </Checkbox>
          <Checkbox
            isSelected={!formData.displayPrivacyPolicy}
            onChange={handleChange}
            name="displayPrivacyPolicyNo"
            radius="none"
            value={false}
            classNames={{ wrapper: "!rounded-[3px]" }}
          >
            No
          </Checkbox>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoCard;
