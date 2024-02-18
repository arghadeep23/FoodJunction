import { useState,useEffect } from 'react'
import Home from "./components/Home";
import FoodForm from "./components/FoodForm";
import Navbar from "./components/Navbar"; 
import RestaurantForm from "./components/RestaurantForm.jsx";
import Landing from "./components/Landing.jsx"
import {CartContext} from "./store/CartContext.jsx";
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route, 
  Outlet,
  Navigate,
} from "react-router-dom";

function App() {
  // const [shoppingCart,setShoppingCart] = useState({
  //   items : [],
  // })
 const [shoppingCart, setShoppingCart] = useState(() => {
  const storedCart = localStorage.getItem('items');
  const parsedCart = storedCart ? JSON.parse(storedCart) : [];
  return { items: parsedCart };
});
   useEffect(() => {
    localStorage.setItem('items', JSON.stringify(shoppingCart.items));
  }, [shoppingCart]);
  // const [ordersMap, setOrdersMap] = useState(new Map()); 
  
  const [ordersMap, setOrdersMap] = useState(() => {
  const storedMap = localStorage.getItem('ordersMap');
    if (storedMap) {
      return new Map(JSON.parse(storedMap));
    } else {
      return new Map();
    }
  });
  useEffect(() => {
  localStorage.setItem('ordersMap', JSON.stringify(Array.from(ordersMap)));
}, [ordersMap]);
  const [overallQuantity,setOverallQuantity] = useState(0);
  function handleAddItemToCart(food)
  {
    setOverallQuantity((prevQuantity)=>prevQuantity+1)
    setShoppingCart((prevShoppingCart)=>{
      const cartItems = [...prevShoppingCart.items];
      const index = cartItems.findIndex((item)=>item._id === food._id);
      if(index === -1)
      {
        cartItems.push({...food,quantity:1});
      }
      else
      {
        // can't mutate the state directly, so we create a new object and then update the state with it
        // cartItems[index].quantity+=1; 
        cartItems[index] = { ...cartItems[index], quantity: cartItems[index].quantity + 1 };
      }
      console.log(cartItems);
      return{
        items : cartItems,
      }
    })
     setOrdersMap(prevMapState => {
    // Create a new Map based on the previous state to avoid mutating it directly
      const updatedMap = new Map(prevMapState);
      // Get the current count for the food item
      const currentCount = updatedMap.get(food._id);
      // If the food item exists in the map, update its count
      if (currentCount !== undefined) {
        updatedMap.set(food._id, currentCount+1); // Update the count for the food item
      } else {
        // Food item doesn't exist in the map, add it with the new count
        updatedMap.set(food._id, 1);
      }
      return updatedMap; // Return the updated Map
    });
  }
  function handleRemoveItemFromCart(food)
  {
    setOverallQuantity((prevQuantity)=>prevQuantity-1);
    setShoppingCart((prevShoppingCart)=>{
      const cartItems = [...prevShoppingCart.items];
      const index = cartItems.findIndex((item)=>item._id===food._id)
      const itemQuantity = cartItems[index].quantity; 
      if(itemQuantity==1)
      {
        cartItems.splice(index,1);
      }
      else 
      {
      cartItems[index] = {...cartItems[index],quantity : itemQuantity-1};
      }
      return {
        items  : cartItems,
      }
    })
    setOrdersMap(prevMapState => {
    // Create a new Map based on the previous state to avoid mutating it directly
      const updatedMap = new Map(prevMapState);
      // Get the current count for the food item
      const currentCount = updatedMap.get(food._id);
      // If the food item exists in the map, update its count
      if (currentCount > 1) {
        updatedMap.set(food._id, currentCount-1); // Update the count for the food item
      } else {
        // Food item doesn't exist in the map, add it with the new count
        updatedMap.delete(food._id);
      }
      return updatedMap; // Return the updated Map
    });
  }
  const cartCtx = {
    items : shoppingCart.items,
    addItemToCart : handleAddItemToCart,
    overallQuantity : shoppingCart.items.reduce( (acc, item) => acc + item.quantity ,0 ),
    ordersMap : ordersMap,
    removeItemFromCart : handleRemoveItemFromCart,
  }
  const router = createBrowserRouter([
  {
    path: "/",
    element: <CartContext.Provider value={cartCtx}><Navbar/><Home/></CartContext.Provider>
  },
  {
    path: "/landing",
    element: <CartContext.Provider value={cartCtx}><Navbar/><Landing/></CartContext.Provider>
  },
  {
    path:"/form", 
    element: <FoodForm/>
  }, 
  {
    path : "/restaurantForm", 
    element : <RestaurantForm/>
  }
]);
  return (
    <>
      <RouterProvider router={router} />  
      {/* <FoodForm/> */}
    </>
  )
}

export default App
