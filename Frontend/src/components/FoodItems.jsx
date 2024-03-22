import { useState, useEffect, useContext } from "react";
import { CartContext } from "../store/CartContext.jsx";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import "../styles/FoodItems.scss";
import MyMap from "./MyMap.jsx";
export default function FoodItems() {
    // var map = L.map('map').setView([51.505, -0.09], 13); 
    const [foodItems, setFoodItems] = useState([]);
    const { addItemToCart, removeItemFromCart, ordersMap } =
        useContext(CartContext);
    const restaurantId = useParams().id;
    const [restaurantDetails, setRestaurantDetails] = useState();
    useEffect(() => {
        if (!restaurantId) return;
        async function fetchFood() {
            try {
                const foods = await fetch(`http://localhost:3000/foods/${restaurantId}`).then(
                    (response) => response.json()
                );
                const restaurant = await fetch(`http://localhost:3000/restaurant/${restaurantId}`).then((response) => response.json());
                setRestaurantDetails(restaurant);
                setFoodItems(foods);
            } catch (error) {
                console.log(error);
            }
        }
        fetchFood();
    }, []);
    function textReducer(text, limit) {
        if (text.length > limit) {
            return text.substring(0, limit - 3) + " ...";
        }
        return text;
    }
    return (
        <>
            {/* <h3>Restaurant : {restaurantId}</h3> */}
            {
                restaurantDetails &&
                <div className="banner">
                    <div className="restaurantInfo">
                        <h2>{restaurantDetails.name}</h2>
                        <p>5 ⭐ | {restaurantDetails.category} | {restaurantDetails.location}</p>
                        <div className="restaurantDescription">
                            <p>{restaurantDetails.description}</p>
                        </div>
                    </div>
                    <div className="moreDetails">
                        <MyMap name={restaurantDetails.name} latitude={restaurantDetails.geometry.coordinates[1]} longitude={restaurantDetails.geometry.coordinates[0]} />
                    </div>
                </div>}
            <div className="foodItems">
                {foodItems.map((food, index) => {
                    return (
                        <div className="foodItemCard" key={index}>
                            <img src={food.imageURL} alt={food.name} />
                            <div className="info">
                                <div className="grouped">
                                    <h3>{textReducer(food.name, 30)}</h3>
                                    <div className="grouped2">
                                        <p className="price">₹{food.price}</p>
                                        {ordersMap.get(food._id) > 0 && (
                                            <div className="addRemoveButtons">
                                                <button
                                                    className="remove"
                                                    onClick={() => removeItemFromCart(food)}
                                                >
                                                    -
                                                </button>
                                                <p className="quantity">{ordersMap.get(food._id)}</p>
                                                <button
                                                    className="add"
                                                    onClick={() => addItemToCart(food)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                        {ordersMap.get(food._id) == undefined && (
                                            <button
                                                className="addButton"
                                                onClick={() => addItemToCart(food)}
                                            >
                                                Add{" "}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="foodDescription">{textReducer(food.description, 145)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
