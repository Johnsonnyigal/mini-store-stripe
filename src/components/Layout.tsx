import { useContext, useEffect, useState } from "react"
import Footer from "./Footer"
import { ProductsContext } from "./ProductsContext"


const Layout = ({children}: any) => {
  //@ts-ignore
  const {setSelectedProducts} = useContext(ProductsContext);
  const [success, setSucess] = useState(false);
  
  useEffect(() => {
    if(window.location.href.includes("success")){
      setSelectedProducts([]);
      setSucess(true)
      
    }
  }, []);
  return (
    <>
    <div className="p-5 min-h-screen">
      {
        success && (
          <div className="mb-5 bg-green-400 text-white text-lg p-5 rounded-xl">
            Thanks for your order!
          </div>
        )
      }
        {children}
    </div>
    <Footer/>
    </>

  )
}

export default Layout