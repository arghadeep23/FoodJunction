import {createContext} from "react"; 
export const CartContext = createContext(
    {
        items : [] ,
        overallQuantity : 0,
        addItemToCart : (item)=>{},
        removeItem : (id)=>{}
    }
);
// export function CartContextProvider({children})
// {

//     return <CartContext.Provider></CartContext.Provider>
// }
export default CartContext; 
