"use client";
import { useState, useEffect } from "react";
import ProductItem from "@/components/ProductItem";
import { IProduct } from "@/models/Product";
import Layout from "@/components/Layout";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [phrase, setPhrase] = useState<string>("");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await fetch(`${baseUrl}/api/products`, {
        method: "GET",
      });
      const productsData: IProduct[] = await data.json();
      setProducts(productsData);
    } catch (error) {
      console.log("An error occured while fetching data", error);
    }
  };

  let filteredProducts: IProduct[];
  if (phrase) {
    filteredProducts = products.filter((p: IProduct) =>
      p.name.toLowerCase().includes(phrase.toLowerCase())
    );
  } else {
    filteredProducts = products;
  }
  //@ts-ignore
  const categoryNames: string[] = [...new Set(products.map((p) => p.category))];
 

  return (
    <Layout>

      <input
        className="bg-gray-100 w-full py-2 px-4 rounded-xl"
        type="text"
        placeholder="Search for product"
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
      />
      <div>
        {categoryNames.map((categoryName) => (
          <div key={categoryName}>
            {filteredProducts.find((p: IProduct) => p.category === categoryName) && (
              <div>
                <h2 className="text-2xl capitalize py-5">{categoryName}</h2>
                <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">
                  {filteredProducts
                    .filter((p: IProduct) => p.category === categoryName)
                    .map((product: IProduct) => (
                      <div key={product._id} className="px-5 snap-start">
                        <ProductItem _id={product._id} name={product.name} price={product.price} description={product.description} picture={product.picture}  />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
  </Layout>
  );
}
