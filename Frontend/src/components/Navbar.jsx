import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import "./Navbar.scss";
export default function Navbar()
{
    return (
        <>
            <header>
                <div className="left">
                    <span>FoodJunction</span>
                </div>
                <div className ="right"> 
                    <div className="cartIcon"> 
                        <AddShoppingCartIcon/>
                    </div>
                </div>
            </header>
        </>
    )
}