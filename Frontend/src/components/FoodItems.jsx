import {useState,useEffect,useContext} from 'react';
import {CartContext} from "../store/CartContext.jsx";
import "./FoodItems.scss";
export default function FoodItems()
{   
    const [foodItems,setFoodItems] = useState([]); 
    const {addItemToCart,ordersMap,removeItemFromCart} = useContext(CartContext);
    useEffect(()=>{
        async function fetchFood()
        {
            try{
                const foods = await fetch("http://localhost:3000/uploads").then(response=>response.json());
                // console.log(foods);
                setFoodItems(foods);
            }
            catch(error)
            {
                console.log(e);
            }
        }
        fetchFood();
    },[])
    return (
        <>
            <div className="foodItems">
                {foodItems.map((food,index)=>{
                    return (
                        <div className="foodItemCard" key={index}>
                            <img src={food.imageURL} alt={food.name}/>
                            <div className="info">
                                <div className="grouped">
                                    <h3>{food.name}</h3>
                                    <div className="grouped2">
                                        <p className="price">₹{food.price}</p>
                                        {
                                            ordersMap.get(food._id) > 0 && 
                                            <div className="addRemoveButtons">
                                                <button className="remove" onClick={()=>removeItemFromCart(food)}>-</button>
                                                <p className="quantity">{ordersMap.get(food._id)}</p>
                                                <button className="add" onClick={()=>addItemToCart(food)}>+</button>
                                            </div>
                                        }
                                        {
                                            ordersMap.get(food._id)==undefined &&
                                            <button className="addButton" onClick={()=>addItemToCart(food)}>Add </button>
                                        }
                                    </div>
                                </div>
                                <p>{food.description}</p>
                            </div>
                            
                        </div>
                    )
                })}
            </div>
        </>
    )
}