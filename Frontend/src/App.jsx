import { useState } from 'react'
import Home from "./components/Home";
import FoodForm from "./components/FoodForm";
import Navbar from "./components/Navbar";
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
  const [shoppingCart,setShoppingCart] = useState({
    items : [],
  })
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
      return{
        items : cartItems,
      }
    })
  }
  const cartCtx = {
    items : shoppingCart.items,
    addItemToCart : handleAddItemToCart,
    overallQuantity : overallQuantity,
  }
  const router = createBrowserRouter([
  {
    path: "/",
    element: <CartContext.Provider value={cartCtx}><Navbar/><Home/></CartContext.Provider>
  },
  {
    path:"/form", 
    element: <FoodForm/>
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
