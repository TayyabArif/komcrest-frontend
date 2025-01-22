import React from "react";
import { Input, Checkbox, Button } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import ConfirmationModal from "../../shared/ConfirmationModal";
import DeleteModal from "@/components/vendor/shared/DeleteModal";
import { useRouter } from "next/router";
import { useMyContext } from "@/context";

const UsersSettingsCard = ({
  action,
  handleChange,
  formData,
  products,
  handleProductsChange,
  selectedProducts,
  role,
  showRemoveBtn,
  isEdit,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const deleteModalContent = "Are you sure to delete user?";
  const { removeCompanyUser } = useMyContext();

  const handleDelete = async () => {
    removeCompanyUser(id);
  };
  return (
    <div className="w-[45%]">
      <div className="flex flex-col bg-white rounded w-full pb-20 mt-12  min-h-[550px]">
        <p className="px-6 py-4  border-1.5 text-standard border-b-gray-200 border-r-0 border-l-0 border-t-0 font-semibold">
          {`${isEdit ? "Update" : ""}`} User settings
        </p>
        <div className="flex flex-col mt-7 px-6">
          <p className="mb-2  text-standard">User role</p>
          <div className="flex flex-col gap-5">
            {/* <Checkbox radius="none" classNames={{wrapper: "!rounded-[3px] bg-gray-100"}}>Admin</Checkbox>
            <Checkbox defaultSelected radius="none" classNames={{wrapper: "!rounded-[3px] bg-gray-100"}}>Contributor</Checkbox>
            <Checkbox radius="none" classNames={{wrapper: "!rounded-[3px] bg-gray-100"}}>Viewer</Checkbox> */}
            <Checkbox
              name="Admin"
              isSelected={formData.role === "Admin"}
              onChange={handleChange}
              isDisabled={role ? true : false}
              radius="none"
              size="lg"
              classNames={{
                label: "!rounded-[3px] text-standard",
                wrapper: "!rounded-[3px]",
              }}
            >
              Admin
            </Checkbox>
            <Checkbox
              name="Contributor"
              isSelected={formData.role === "Contributor"}
              onChange={handleChange}
              isDisabled={role ? true : false}
              radius="none"
              size="lg"
              classNames={{
                label: "!rounded-[3px] text-standard",
                wrapper: "!rounded-[3px]",
              }}
            >
              Contributor
            </Checkbox>
            <Checkbox
              name="Viewer"
              isSelected={formData.role === "Viewer"}
              onChange={handleChange}
              isDisabled={role ? true : false}
              radius="none"
              size="lg"
              classNames={{
                label: "!rounded-[3px] text-standard",
                wrapper: "!rounded-[3px]",
              }}
            >
              Viewer
            </Checkbox>
          </div>
        </div>
        <div className="flex flex-col mt-8 px-6">
          <p className="mb-2 text-standard">Associated products</p>
          <div className="flex flex-col gap-5">
            {products?.map((item, index) => (
              <Checkbox
                key={index}
                // isDisabled={role && role !== "Admin"}
                isDisabled={true}
                onChange={handleProductsChange}
                value={item.id}
                isSelected={selectedProducts?.includes(item.id)}
                name="products"
                radius="none"
                size="lg"
                classNames={{
                  label: "!rounded-[3px] text-standard",
                  wrapper: "!rounded-[3px]",
                }}
              >
                {item.name}
              </Checkbox>
            ))}
          </div>
        </div>

        {showRemoveBtn && (
          <div className="w-full  flex justify-center mt-[4rem]">
            <Button
              radius="none"
              size="md"
              className="rounded-md 2xl:text-[20px] text-[16px] bg-red-200 text-red-500 w-[80%]  font-semibold"
              onClick={() => {
                // setSelectedQuestion(data);

                onOpen();
                // setOpenPopoverIndex(null);
              }}
            >
              Remove user
            </Button>
          </div>
        )}
      </div>
      <DeleteModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        handleSubmit={handleDelete}
        deleteModalContent={deleteModalContent}
      />
      {/* <div className="flex justify-end mb-5 mt-10">
          <div>
            <div className="flex items-center gap-5">
              <Button
                radius="none"
                size="sm"
                className="text-[#c51317] px-5 h-[28px] text-sm bg-[#f5c8d1] font-bold w-max rounded-[4px]"
              >
                Cancel
              </Button>
              <Button
                radius="none"
                size="sm"
                className="text-white px-5 h-[28px] text-sm bg-btn-primary w-max rounded-[4px]"
                onPress={onOpen}
              >
                {action === "create" ?  "Send invitation" : "Update user"}
              </Button>
            </div>
          </div>
      </div> */}
      {/* <ConfirmationModal isOpen={isOpen} onOpenChange ={onOpenChange} data={modalData}/> */}
    </div>
  );
};

export default UsersSettingsCard;
