import "../styles/OwnerLeftPanel.scss";
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
export default function OwnerLeftPanel({ handleMode, mode }) {
    const navigate = useNavigate();
    function handleSignout() {
        localStorage.removeItem('token');
        localStorage.removeItem('restaurantId');
        navigate('/ownerLanding');
    }
    return (
        <>
            <div className="ownerLeftPanel">
                <div className="ownerLeftPanelHeader">
                    <h2>FJ For Merchants</h2>
                </div>
                <div className="ownerLeftPanelBody">
                    <ul>
                        <li onClick={() => handleMode('dashboard')} className={mode == 'dashboard' ? 'active' : ''}> <span className="icon"><HomeIcon /></span> <span className="what-mode">Dashboard</span></li>
                        <li onClick={() => handleMode('orders')} className={mode == 'orders' ? 'active' : ''}> <span className="icon"><ListAltIcon /></span> <span className="what-mode">Orders</span></li>
                        <li onClick={() => handleMode('menu')} className={mode == 'menu' ? 'active' : ''}> <span className="icon"><RestaurantMenuIcon /></span> <span className="what-mode">Menu</span> </li>
                        <li onClick={() => handleMode('add')} className={mode === 'add' ? 'active' : ''}> <span className="icon"><AddCircleOutlineIcon /></span> <span className="what-mode">New Food Item</span> </li>
                        <li onClick={() => handleMode('profile')} className={mode == 'profile' ? 'active' : ''}> <span className="icon"><AdminPanelSettingsIcon /></span> <span className="what-mode">Profile</span> </li>
                        <li onClick={() => handleSignout()} className={mode == 'signout' ? 'active' : ''}> <span className="icon"><ExitToAppIcon /></span> <span className="what-mode">Sign Out</span> </li>
                    </ul>
                </div>
            </div>
        </>
    )
}