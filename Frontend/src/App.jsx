import { useState, useEffect } from "react";
import Home from "./components/Home";
import FoodForm from "./components/FoodForm";
import Navbar from "./components/Navbar";
import RestaurantForm from "./components/RestaurantForm.jsx";
import Landing from "./components/Landing.jsx";
import Login from "./components/Login.jsx";
import Login2 from "./components/Login2.jsx";
import { CartContext } from "./store/CartContext.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./components/Profile.jsx";
import OwnerLanding from "./components/OwnerLanding.jsx";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import MyMap from "./components/MyMap.jsx";

function App() {

  const [userId, setUserId] = useState(() => {
    const storedId = localStorage.getItem("userId");
    return storedId ? storedId : null;
  });

  const { user, isAuthenticated } = useAuth0();
  const [overallQuantity, setOverallQuantity] = useState(0);
  const [ordersMap, setOrdersMap] = useState(new Map());
  console.log(ordersMap);
  useEffect(() => {
    if (isAuthenticated && user) {
      // check if user exists in the database
      async function registerUser() {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user),
        })
        const data = await response.json();
        setUserId(data);
        // store the user id in local storage
        localStorage.setItem("userId", data);
      }
      registerUser();
    }
  }, [isAuthenticated, user])


  const [shoppingCart, setShoppingCart] = useState([]);
  useEffect(() => {
    if (!userId) return;
    async function fetchCart() {
      try {
        const cart = await fetch(`http://localhost:3000/cart/${userId}`).then((response) => response.json());
        setShoppingCart(cart);
        setOverallQuantity(cart.reduce((acc, item) => acc + item.quantity, 0));
        setOrdersMap(new Map(cart.map((item) => [item.foodItemId, item.quantity])));
      } catch (e) {
        console.log(e);
      }
    }
    fetchCart();
  }, [userId]);
  console.log("shoppingCart", shoppingCart);
  async function handleAddItemToCart(item) {
    const updatedCart = [...shoppingCart];
    const index = updatedCart.findIndex((i) => i.foodItemId === item._id);
    if (index >= 0) {
      updatedCart[index].quantity++;
    } else {
      updatedCart.push({ ...item, quantity: 1, foodItemId: item._id });
    }
    setOverallQuantity((prev) => prev + 1);
    setOrdersMap((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(item._id)) {
        newMap.set(item._id, newMap.get(item._id) + 1);
      } else {
        newMap.set(item._id, 1);
      }
      return newMap;
    });
    setShoppingCart(updatedCart);
    await fetch("http://localhost:3000/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId: userId, foodItemId: item._id, price: item.price, name: item.name }),
    });
  }
  async function handleRemoveItemFromCart(item) {
    const updatedCart = [...shoppingCart];
    const index = updatedCart.findIndex((i) => i.foodItemId === item._id);
    if (index >= 0) {
      updatedCart[index].quantity--;
      if (updatedCart[index].quantity === 0) {
        updatedCart.splice(index, 1);
      }
      setOverallQuantity((prev) => prev - 1);
      setOrdersMap((prev) => {
        const newMap = new Map(prev);
        let orderAmount = newMap.get(item._id);
        if (orderAmount > 1) {
          newMap.set(item._id, newMap.get(item._id) - 1);
        } else {
          newMap.delete(item._id);
        }
        return newMap;
      });
    }
    else {
      return;
    }
    setShoppingCart(updatedCart);
    await fetch("http://localhost:3000/remove-from-cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId: userId, foodItemId: item._id }),
    });
  }
  const cartCtx = {
    userId: userId,
    items: shoppingCart,
    addItemToCart: handleAddItemToCart,
    removeItemFromCart: handleRemoveItemFromCart,
    overallQuantity: overallQuantity,
    ordersMap: ordersMap
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <CartContext.Provider value={cartCtx}>
          <Navbar needed={true} />
          <Landing />
        </CartContext.Provider>
      ),
    },
    {
      path: "/:id/menu",
      element: (
        <Login2
          element={
            <CartContext.Provider value={cartCtx}>
              <Navbar needed={true} />
              <Home />
            </CartContext.Provider>
          } />
      ),
    },
    {
      path: "/form",
      element: (
        <>
          <Navbar needed={false} />
          <FoodForm />
        </>
      ),
    },
    {
      path: "/restaurantForm",
      element: (
        <>
          <Navbar needed={false} />
          <RestaurantForm />
        </>
      ),
    },
    {
      path: "/login",
      element: (
        <>
          <Navbar needed={false} />
          <Login />
        </>
      ),
    },
    {
      path: "/login2",
      element: (
        <>
          <Navbar needed={false} />
          <Login2 />
        </>
      ),
    },
    {
      path: "/profile",
      element: (
        <>
          <Profile />
        </>
      ),
    },
    {
      path: "/ownerLanding",
      element: (
        <OwnerLanding />
      )
    }
  ]);
  return (
    <>
      <RouterProvider router={router} />
      {/* <FoodForm/> */}
    </>
  );
}

export default App;
