import {createContext} from "react"; 
export const CartContext = createContext(
    {
        items : [] ,
        overallQuantity : 0,
        addItemToCart : (item)=>{},
        removeItemFromCart : (item)=>{},
        ordersMap: new Map(),
    }
);
// export function CartContextProvider({children})
// {

//     return <CartContext.Provider></CartContext.Provider>
// }
export default CartContext; 
