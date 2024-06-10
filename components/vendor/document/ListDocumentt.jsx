import React from "react";
import Image from "next/image";
import DocumentHeader from "./shared/DocumentHeader";
import DocumentCard from "./shared/DocumentCard";
import AddDocumentModal from "./NewDocument";


const ListDocument = () => {
    
  const cardData = [
    {
      title: "SOC 2 TYPE II REPORT",
      name: "Product",
      description: "Description",
    },
    {
      title: "SOC 2 TYPE II REPORT",
      name: "Product",
      description: "Description",
    },
    {
      title: "SOC 2 TYPE II REPORT",
      name: "Product",
      description: "Description",
    },
    {
      title: "SOC 2 TYPE II REPORT",
      name: "Product",
      description: "Description",
    },
    {
      title: "SOC 2 TYPE II REPORT",
      name: "Product",
      description: "Description",
    },
    {
      title: "SOC 2 TYPE II REPORT",
      name: "Product",
      description: "Description",
    },
    {
      title: "SOC 2 TYPE II REPORT",
      name: "Product",
      description: "Description",
    },
    {
      title: "SOC 2 TYPE II REPORT",
      name: "Product",
      description: "Description",
    },
    {
      title: "SOC 2 TYPE II REPORT",
      name: "Product",
      description: "Description",
    },
    {
      title: "SOC 2 TYPE II REPORT",
      name: "Product",
      description: "Description",
    },
    {
      title: "SOC 2 TYPE II REPORT",
      name: "Product",
      description: "Description",
    },
    {
      title: "SOC 2 TYPE II REPORT",
      name: "Product",
      description: "Description",
    },
  ];
  return (
    <div>
      <DocumentHeader />
      <DocumentCard cardData={cardData}/>
      <AddDocumentModal />
      

    </div>
  );
};

export default ListDocument;
