import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import "../styles/Navbar.scss";
import { CartContext } from "../store/CartContext.jsx";
import { useContext, useState, useRef, useEffect } from "react";
import DropDownMenu from './DropDownMenu.jsx';
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar({ needed }) {
    const cartCtx = useContext(CartContext);
    const [cartOpen, setCartOpen] = useState(false);
    const { user, loginWithRedirect, isAuthenticated } = useAuth0();
    function handleOnClick() {
        setCartOpen((prev) => !prev);
    }
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
                        needed && !isAuthenticated && <><div className="signin" onClick={() => loginWithRedirect()}>
                            <span>Sign In</span>
                        </div>
                            <div className="signup" onClick={() => loginWithRedirect()}>
                                <span>Sign Up</span>
                            </div></>
                    }
                    {
                        needed && isAuthenticated && <div className="profile">
                            <div className="photo">
                                <img src={user.picture} alt="" />
                            </div>
                            <div className="name">
                                <span>{user.given_name ? user.given_name : user.nickname}</span>
                            </div>
                        </div>
                    }
                    {needed && isAuthenticated &&
                        <div className="cart" onClick={handleOnClick} >
                            <AddShoppingCartIcon />
                            <p>
                                Cart ({cartCtx.overallQuantity})
                            </p>
                            {cartOpen && <DropDownMenu />}
                        </div>
                    }
                </div>
            </header>
        </>
    )
}