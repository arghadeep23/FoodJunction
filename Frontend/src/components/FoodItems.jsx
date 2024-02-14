import {useState,useEffect} from 'react';
import "./FoodItems.scss";
export default function FoodItems()
{   
    const [foodItems,setFoodItems] = useState([]); 
    useEffect(()=>{
        async function fetchFood()
        {
            try{
                const foods = await fetch("http://localhost:3000/uploads").then(response=>response.json());
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
                                <h3>{food.name}</h3>
                                <p>{food.description}</p>
                                <p>Price: ₹{food.price}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}