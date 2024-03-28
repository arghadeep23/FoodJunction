import "../styles/DashboardMenu.scss";
import { useState, useEffect } from 'react'
import FoodItemModal from './FoodItemModal.jsx';
export default function DashboardMenu({ restaurantData }) {
    const [loading, setLoading] = useState(false);
    const [foodItems, setFoodItems] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedFoodItem, setSelectedFoodITem] = useState(null);
    function showModal(food) {
        setSelectedFoodITem(food);
        setOpenModal(true);
    }
    function hideModal() {
        setOpenModal(false);
    }

    useEffect(() => {
        const fetchFoodItems = async () => {
            setLoading(true);
            const foodItems = await fetch(`http://localhost:3000/foods/${restaurantData._id}`).then(response => response.json());
            setFoodItems(foodItems);
            console.log(foodItems);
            setLoading(false);
        }
        if (foodItems) return;
        fetchFoodItems();
    }, [])
    function textReducer(text, limit) {
        if (text.length > limit) {
            return text.substring(0, limit - 3) + " ...";
        }
        return text;
    }
    if (loading || !foodItems) {
        return <h1>Loading...</h1>
    }
    return (
        <>
            {openModal && <FoodItemModal hideModal={hideModal} food={selectedFoodItem} />}
            <div className="dashboardMenu">
                <h2>{restaurantData.name} Menu</h2>
                {foodItems && <div className="foodItems">
                    {foodItems.map((food, index) => {
                        return (
                            <div className="foodItemCard" key={index}>
                                <img src={food.imageURL} alt={food.name} />
                                <div className="info">
                                    <div className="grouped">
                                        <h3>{textReducer(food.name, 30)}</h3>
                                        <div className="grouped2">
                                            <p className="price">₹{food.price}</p>
                                            {/* <div className="addButton"> */}
                                            <button className="addButton" onClick={() => showModal(food)}>Edit</button>
                                            {/* </div> */}
                                        </div>
                                    </div>
                                    <p className="foodDescription">{textReducer(food.description, 140)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>}
                {!foodItems && <h1>No Food Items</h1>}
            </div>
        </>
    )
}