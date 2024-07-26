"use client"
import Image from "next/image";
import { useContext } from "react";
import { ProductsContext } from "./ProductsContext";

 // @ts-ignore
const ProductItem = ({_id, name, price, description, picture}) => {
   // @ts-ignore
  const {setSelectedProducts} = useContext(ProductsContext)
  function addProduct() {
     // @ts-ignore
    setSelectedProducts(prev => [...prev,_id]);
  }


  return (
        <div className="w-64">
          <div className="bg-blue-100 p-5 rounded-xl">
            <Image 
            height={300}
            width={250}
            src={picture} alt="" />
          </div>
          <div className="mt-2">
            <h3 className="font-bold text-lg">{name}</h3>
          </div>
          <p className="text-sm mt-1 leading-4 text-gray-500">{description}</p>
          <div className="flex mt-1">
            <div className="text-2xl font-bold grow">${price}</div>
            <button className="bg-emerald-400 text-white py-1 px-3 rounded-xl"
            onClick={ addProduct}
            >+</button>
          </div>
        </div>
    
  )
}

export default ProductItem