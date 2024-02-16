import {useState,useEffect,useContext} from 'react';
import {CartContext} from "../store/CartContext.jsx";
import "./FoodItems.scss";
export default function FoodItems()
{   
    const [foodItems,setFoodItems] = useState([]); 
    const {addItemToCart} = useContext(CartContext);
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
                                        <p className="price">Price: ₹{food.price}</p>
                                        <button onClick={()=>addItemToCart(food)}>Add </button>
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