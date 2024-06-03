import React, { useState } from 'react'
import {Input, Checkbox} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { X } from 'lucide-react';

const CompanyProductCard = ({action}) => {
  const [products, setProducts] = useState(["Intranet", "Email Marketing", "Mobile App"])
  const [product,setProduct] = useState("")
  const handleAddProduct = () => {
    if (product) { // Check if product input is not empty
      setProducts([...products, product]);
      setProduct(""); // Clear input field after adding
    }
  };

  const handleRemoveProduct = (index) => {
    const newProducts = products.filter((_, idx) => idx !== index);
    setProducts(newProducts);
  };
  return (
    <div className='flex flex-col bg-white shadow-md w-[45%] min-h-[480px] mt-12'>
      <p className='px-4 py-4 border border-1.5 border-b-gray-200 border-r-0 border-l-0 border-t-0 font-semibold'>Company products</p>
      <p className='mt-4 px-4'>Add products</p>
      <div className='flex items-center gap-4 mt-2 px-4'>
        <Input
        isRequired
        type="text"
        placeholder="Intranet"
        variant="bordered"
        className="max-w-md"
        classNames={{inputWrapper: "rounded-md"}}
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />
      <Button
          radius="none"
          size="sm"
          className="text-white px-[10px] text-sm bg-btn-primary w-max rounded-[4px]"
          onPress={handleAddProduct}
        >
          Add
        </Button>
      </div>
      <div className='flex flex-col mt-6 px-4 gap-2'>
          {products?.map((product, index) => (
            <div key={index} className='flex items-center gap-2 cursor-pointer'>
                <X color="#e91616" strokeWidth={4} size={16}
                 onClick={() => handleRemoveProduct(index)}
                />
                <p>{product}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default CompanyProductCard
