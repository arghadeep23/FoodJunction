import { useState } from 'react'
import Home from "./components/Home";
import FoodForm from "./components/FoodForm";
import Navbar from "./components/Navbar";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route, 
  Outlet,
  Navigate,
} from "react-router-dom";

function App() {
  const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar/><Home/></>
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
