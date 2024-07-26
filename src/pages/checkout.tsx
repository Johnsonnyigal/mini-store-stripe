"use client";
import Image from "next/image"
import Layout from "@/components/Layout"
import { ProductsContext } from "@/components/ProductsContext"
import { useContext, useEffect, useState } from "react"


export default function CheckOutPage() {


  //@ts-ignore
  const {selectedProducts, setSelectedProducts} = useContext(ProductsContext);
  const [productsInfos, setProductsInfos] = useState([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  
  useEffect(() => {

    const uniqIds = [...new Set(selectedProducts)];
    if (uniqIds.length > 0) {
    fetch("/api/products?ids="+uniqIds.join(","))
    .then(response => response.json())
    .then(json => setProductsInfos(json));
    } else {
      setProductsInfos([]);
    }
  },
  [selectedProducts]
)

function addMore(id: any) {
  //@ts-ignore
  setSelectedProducts(prev => [...prev, id])
}
function lessOfProduct(id: any) {
  const pos = selectedProducts.indexOf(id);
  if(pos !== -1 ){    
    //@ts-ignore
    setSelectedProducts(prev => {
      //@ts-ignore
      return  prev.filter((value, index) => index !== pos)
    })
  }
}

const deliveryPrice = 5;
let subtotal = 0;
if(selectedProducts?.length) {
  for(let id of selectedProducts) {
    //@ts-ignore
    const itemPrice = productsInfos.find(p => p._id === id);
    if(itemPrice) {
      //@ts-ignore
      subtotal += itemPrice.price!
    }
  }
}

let total = subtotal + deliveryPrice;

  return (
    <Layout>
      {!productsInfos.length && (
        <div>no products in your shopping cart</div>
      )
    }
    {productsInfos.length && productsInfos.map((product: any) => (
      <div key={product._id} className="flex mb-5">
        <div className="bg-gray-100 p-3 rounded-xl">
          <Image 
          className="w-24"
          src={product.picture}
          height={250}
          width={150}
          alt=""/>
        </div>
        <div className="pl-4">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="text-sm leading-4 text-gray-500">{product.description}</p>
          <div className="flex">
            <div className="grow">
            ${product.price}
            </div>
            <div>
              <button 
              className="border border-emerald-500 px-2 rounded-lg text-emerald-500"
              onClick={() => lessOfProduct(product._id)}
              >-</button>
              <span className="px-2">
              {/* @ts-ignore */}
              {selectedProducts.filter(id => id === product._id).length}
              </span>
              <button 
              className="bg-emerald-500 px-2 rounded-lg text-white"
              onClick={() => addMore(product._id)}
              >+</button>
            </div>
          </div>          
        </div>
      </div>
    ))}
    <form action="/api/checkout" method="POST">
      <div className="mt-4">
        <input
        name="address"
        className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" 
        placeholder="Street address, number" 
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        />
        <input 
        name="city"
        className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" 
        type="text" 
        placeholder="City and postal code"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        />
        <input 
        name="name"
        className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" 
        type="text" 
        placeholder="Your name" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        />
        <input 
        name="email"
        className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" 
        type="email" 
        placeholder="Email address" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}      
        />
      </div>
      <div className="mt-4">
        <div className="flex my-3">
        <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
        <h3 className="font-bold">${subtotal}</h3>  
        </div>
        <div className="flex my-3">
        <h3 className="grow font-bold text-gray-400">Delivery:</h3>
        <h3 className="font-bold">${deliveryPrice}</h3>  
        </div>
        <div className="flex my-3 border-t pt-3  border-dashed border-emerald-500">
        <h3 className="grow font-bold text-gray-400">Total:</h3>
        <h3 className="font-bold">${total}</h3>  
        </div>
      </div>

      <input type="hidden" name="products" value={selectedProducts.join(",")} />
      <button 
        className="bg-emerald-500 px-5 py-2 w-full font-bold 
        rounded-xl text-white my-4 shadow-emerald-300 shadow-lg"
        type="submit"
        >
        Pay ${total}
        
        </button>
    </form>
    </Layout>
  )
}
