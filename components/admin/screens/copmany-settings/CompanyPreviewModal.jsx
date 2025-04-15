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
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody>
              <div className="my-2 flex gap-10">
                <div className="">
                  <p className="text-gray-600 font-bold text-xl">
                    Company Detail:
                  </p>
                  <h1>
                    <span className="font-bold text-gray-600">
                      Company Name:
                    </span>{" "}
                    {companyFullDetail?.company?.name}
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600">
                      Company Domain:
                    </span>{" "}
                    {companyFullDetail?.company?.subdomain}
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600">
                      Company Type:
                    </span>{" "}
                    {companyFullDetail?.company?.companyType}
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600">
                      Company Email:
                    </span>{" "}
                    {companyFullDetail?.company?.email}
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600">
                      Company Phone Number:
                    </span>{" "}
                    {companyFullDetail?.company?.phoneNumber
                      ? companyFullDetail?.company?.phoneNumber
                      : "- -"}
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600">
                      Company Created:
                    </span>{" "}
                    {new Date(
                      companyFullDetail?.company?.createdAt
                    ).toLocaleDateString()}
                  </h1>
                </div>

                <div className="">
                  <p className="text-gray-600 font-bold text-xl">
                    Plan Detail:
                  </p>
                  <h1>
                    <span className="font-bold text-gray-600">Plan Name :</span>{" "}
                    {companyFullDetail?.subscriptionDetails?.planName}
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600">
                      Plan Start :
                    </span>{" "}
                    {new Date(
                      companyFullDetail?.subscriptionDetails?.startDate
                    ).toLocaleDateString()}
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600">Plan End :</span>{" "}
                    {new Date(
                      companyFullDetail?.subscriptionDetails?.endDate
                    ).toLocaleDateString()}
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600">
                      Billing Cycle :
                    </span>{" "}
                    {companyFullDetail?.subscriptionDetails?.billingCycle}
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600">
                      Free Trail Completed ?
                    </span>{" "}
                    {companyFullDetail?.subscriptionDetails?.isTrial
                      ? "YES"
                      : "NO"}
                  </h1>
                </div>

                <div className="">
                  <p className="text-gray-600 font-bold text-xl">
                    Questionnaire Detail:
                  </p>
                  <h1>
                    <span className="font-bold text-gray-600">
                      Total Allowed Questions :{" "}
                    </span>{" "}
                    {
                      companyFullDetail?.questionLimitDetails
                        ?.totalAllowedQuestions
                    }
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600">
                      Created Questions :{" "}
                    </span>{" "}
                    {
                      companyFullDetail?.questionLimitDetails
                        ?.currentCreatedQuestions
                    }
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600">
                      Questions Left :{" "}
                    </span>{" "}
                    {companyFullDetail?.questionLimitDetails?.questionsLeft}
                  </h1>
                </div>

                <div className="">
                  <p className="text-gray-600 font-bold text-xl">
                    User Detail:
                  </p>
                  <h1>
                    <span className="font-bold text-gray-600">Admin : </span>{" "}
                    {
                      companyFullDetail?.users?.filter(
                        (item) => item.role == "Admin"
                      ).length
                    }
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600">
                      Contributor :{" "}
                    </span>{" "}
                    {
                      companyFullDetail?.users?.filter(
                        (item) => item.role == "Contributor"
                      ).length
                    }
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600">Viewer : </span>{" "}
                    {
                      companyFullDetail?.users?.filter(
                        (item) => item.role == "Viewer"
                      ).length
                    }
                  </h1>
                  <h1>
                    <span className="font-bold text-gray-600 border-t-2">
                      Total Users :{" "}
                    </span>{" "}
                    {companyFullDetail?.users?.length}
                  </h1>
                </div>

                {/* {JSON.stringify(companyFullDetail)} */}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CompanyPreviewModal;
