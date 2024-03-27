import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function OwnerDashboard() {
    const [restaurantData, setRestaurantData] = useState({});
    const [restaurantId, setRestaurantId] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const restaurantId = localStorage.getItem('restaurantId');
        // fetch(`http://localhost:3000/restaurant/${restaurantId}`, {
        //     method: "GET",
        //     headers: {
        //         "Authorization": `Bearer ${token}`
        //     }
        // }).then(response => response.json()).then(data => {
        //     console.log(data);
        //     setRestaurantData(data);
        // }).catch(error => {
        //     console.log(error);
        // })
        if (!token) {
            navigate('/ownerLanding');
        }
        else {
            setRestaurantId(restaurantId);
            console.log(restaurantId);
            console.log(token);
            //
        }

    }, [])
    return (
        <>
            Owner Dashboard {restaurantId ? restaurantId : ''}
        </>
    )
}