import {createContext} from "react";
import useLocalStorageState from 'use-local-storage-state';

export const ProductsContext = createContext({});

 // @ts-ignore
export function ProductsContextProvider({children}) {
  const [selectedProducts,setSelectedProducts] = useLocalStorageState('cart', {defaultValue:[]});
  return (
    <ProductsContext.Provider value={{selectedProducts,setSelectedProducts}}>{children}</ProductsContext.Provider>
  );
}