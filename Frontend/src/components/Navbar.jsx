import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import "./Navbar.scss";
import { CartContext } from "../store/CartContext.jsx";
import { useContext, useState, useRef } from "react";
import DropDownMenu from './DropDownMenu.jsx';
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar({ needed }) {
    const cartCtx = useContext(CartContext);
    const [cartOpen, setCartOpen] = useState(false);
    const timeoutRef = useRef(null);
    const { user, loginWithRedirect, isAuthenticated } = useAuth0();

    function handleOnClick() {
        setCartOpen((prev) => !prev);
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
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <span>FoodJunction</span>
                    </Link>
                </div>
                <div className="right">

                    {
                        !isAuthenticated && <><div className="signin" onClick={() => loginWithRedirect()}>
                            <span>Sign In</span>
                        </div>
                            <div className="signup" onClick={() => loginWithRedirect()}>
                                <span>Sign Up</span>
                            </div></>
                    }
                    {
                        isAuthenticated && <div className="profile">
                            <div className="photo">
                                <img src={user.picture} alt="" />
                            </div>
                            <div className="name">
                                <span>{user.name}</span>
                            </div>
                        </div>
                    }
                    {needed &&
                        <div className="cart" onClick={handleOnClick} >
                            <AddShoppingCartIcon />
                            <p>
                                Cart ({cartCtx.overallQuantity})
                            </p>
                            {cartOpen && <DropDownMenu hande />}
                        </div>
                    }
                    {/* <div className="signin" onClick={() => loginWithRedirect()}>
                        <span>Sign In</span>
                    </div> */}

                </div>
            </header>
        </>
    )
}