import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import "./Navbar.scss";
import {CartContext} from "../store/CartContext.jsx";
import {useContext,useState,useRef} from "react"; 
import DropDownMenu from './DropDownMenu.jsx';
export default function Navbar()
{
    const cartCtx = useContext(CartContext);
    const [cartOpen,setCartOpen] = useState(false);
    const timeoutRef = useRef(null);
    function handleOnClick(){
        setCartOpen((prev)=>!prev);
    }
    const handleMouseEnter = () => {
    setCartOpen(true);
    };

    // const handleMouseLeave = () => {
    //     setCartOpen(false);
    // };
    const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setCartOpen(false);
    }, 200); // Set a delay before hiding the dropdown
  };

    return (
        <>
            <header>
                <div className="left">
                    <span>FoodJunction</span>
                </div>
                <div className ="right"> 
                    {/* change to onMouseEnter and onMouseLeave*/}
                    <div className="cart" onClick={handleOnClick} > 
                        <AddShoppingCartIcon/>
                        <p>
                            Cart ({cartCtx.overallQuantity})
                        </p>
                    </div>
                    {cartOpen && <DropDownMenu hande/>}
                </div>
            </header>
        </>
    )
}