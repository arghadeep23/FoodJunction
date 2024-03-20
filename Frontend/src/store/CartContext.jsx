import { createContext } from "react";
export const CartContext = createContext(
    {
        userId: null,
        items: [],
        addItemToCart: (item) => { },
        removeItemFromCart: (item) => { },
        overallQuantity: 0,
        ordersMap: new Map()
    }
);
export default CartContext; 
