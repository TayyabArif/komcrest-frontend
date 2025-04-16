import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const CompanyPreviewModal = ({ isOpen, onOpenChange, companyFullDetail }) => {
  return (
    <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-center bg-gray-100 py-4 rounded-t-md">
              <h2 className="text-xl font-semibold text-gray-700">Company Details</h2>
            </ModalHeader>
            <ModalBody className="bg-gray-50 py-6 px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Company Detail Section */}
                <div className="space-y-4">
                  <p className="text-gray-600 font-bold text-xl">Company Detail:</p>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Company Name:</span> {companyFullDetail?.company?.name}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Company Domain:</span> {companyFullDetail?.company?.subdomain}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Company Type:</span> {companyFullDetail?.company?.companyType}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Company Email:</span> {companyFullDetail?.company?.email}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Company Phone Number:</span> {companyFullDetail?.company?.phoneNumber || "- -"}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Company Created:</span> {new Date(companyFullDetail?.company?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Plan Detail Section */}
                <div className="space-y-4">
                  <p className="text-gray-600 font-bold text-xl">Plan Detail:</p>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Plan Name:</span> {companyFullDetail?.subscriptionDetails?.planName}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Plan Start:</span> {new Date(companyFullDetail?.subscriptionDetails?.startDate).toLocaleDateString()}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Plan End:</span> {new Date(companyFullDetail?.subscriptionDetails?.endDate).toLocaleDateString()}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Billing Cycle:</span> {companyFullDetail?.subscriptionDetails?.billingCycle}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Free Trial Completed:</span> {companyFullDetail?.subscriptionDetails?.isTrial ? "NO" : "YES"}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Total Amount:</span> {companyFullDetail?.allSubscriptionsAmount}$
                    </p>
                  </div>
                </div>

                {/* Questionnaire Detail Section */}
                <div className="space-y-4">
                  <p className="text-gray-600 font-bold text-xl">Questionnaire Detail:</p>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Total Allowed Questions:</span> {companyFullDetail?.questionLimitDetails?.totalAllowedQuestions}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Created Questions:</span> {companyFullDetail?.questionLimitDetails?.currentCreatedQuestions}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Questions Left:</span> {companyFullDetail?.questionLimitDetails?.questionsLeft}
                    </p>
                  </div>
                </div>

                {/* User Detail Section */}
                <div className="space-y-4">
                  <p className="text-gray-600 font-bold text-xl">Users Detail:</p>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Admin:</span> {companyFullDetail?.users?.filter((item) => item.role === "Admin").length}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Contributor:</span> {companyFullDetail?.users?.filter((item) => item.role === "Contributor").length}
                    </p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-gray-500">Viewer:</span> {companyFullDetail?.users?.filter((item) => item.role === "Viewer").length}
                    </p>
                    <p className="font-semibold text-gray-700 ">
                      <span className="text-gray-500">Total Users:</span> {companyFullDetail?.users?.length}
                    </p>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="bg-gray-100 py-4 rounded-b-md">
              <Button color="danger" variant="light" onPress={onClose} className="">Close</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CompanyPreviewModal;
