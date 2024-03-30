import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerLeftPanel from './OwnerLeftPanel';
import DashboardOrders from './DashboardOrders';
import DashboardMenu from './DashboardMenu';
import DashboardProfile from './DashboardProfile';
import SubDashboard from './SubDashboard';
import DashboardSignout from './DashboardSignOut';
import FoodForm from './FoodForm';
import '../styles/OwnerDashboard.scss';
export default function OwnerDashboard() {
    const [mode, setMode] = useState('dashboard');
    function handleMode(mode) {
        setMode(mode);
    }
    const [restaurantData, setRestaurantData] = useState();
    const [restaurantId, setRestaurantId] = useState();
    const navigate = useNavigate();
    async function fetchRestaurantDetails(restaurantId) {
        try {
            const restaurantDetails = await fetch(`http://localhost:3000/restaurant/${restaurantId}`).then((response) => response.json());
            console.log("restaurantDetails", restaurantDetails);
            setRestaurantData(restaurantDetails);
        }
        catch (error) {
            navigate("/ownerLanding")
            console.log(error);
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        const restaurantId = localStorage.getItem('restaurantId');
        if (!token) {
            navigate('/ownerLanding');
        }
        else {
            setRestaurantId(restaurantId);
            fetchRestaurantDetails(restaurantId);
        }
    }, [])
    function handleDetailsEdit() {
        fetchRestaurantDetails(restaurantId);
        setMode('profile');
    }
    if (!restaurantData) return <h1>Loading...</h1>
    return (
        <>
            <div className="dashboard">
                <div className="leftPanel">

                    <OwnerLeftPanel handleMode={handleMode} mode={mode} />
                </div>
                <div className="rightPanel">
                    {mode === 'dashboard' && <SubDashboard restaurantData={restaurantData} />}
                    {mode === 'orders' && <DashboardOrders restaurantData={restaurantData} />}
                    {mode === 'menu' && <DashboardMenu restaurantData={restaurantData} />}
                    {mode === 'profile' && <DashboardProfile restaurantData={restaurantData} handleDetailsEdit={handleDetailsEdit} />}
                    {mode === 'signout' && <DashboardSignout />}
                    {mode === 'add' && <FoodForm restaurantId={restaurantId} />}
                </div>

                {/* Owner Dashboard {restaurantId ? restaurantId : ''} */}
            </div>
        </>
    )
}