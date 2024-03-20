import { useContext } from "react";
import { CartContext } from "../store/CartContext.jsx";
import "./DropDownItem.scss";
export default function DropDownItem() {
    const cartCtx = useContext(CartContext);
    return (
        <div className="menu-item">
            {
                cartCtx.overallQuantity == 0 &&
                <div className="empty">
                    <h3>Cart Empty</h3>
                    <p>
                        Good food is always cooking! Go ahead, order some yummy items from the menu.
                    </p>
                </div>
            }
            {
                cartCtx.overallQuantity > 0 &&
                <div className="filled">
                    <h3>Cart</h3>
                    <hr></hr>
                    <div className="cart-items">
                        {cartCtx.items.map((item, index) => {
                            return (
                                <div className="cart-item" key={index}>
                                    {/* <img src={item.imageURL} alt={item.name}/> */}
                                    <div className="info">
                                        <p className="info-name">{item["name"]} x {item["quantity"]}</p>
                                        <p>₹{item.price}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="total">
                        {/* <h4><span>Sub-Total:</span> <span>₹{cartCtx.items.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span></h4> */}
                        <div className="dashed-line"></div>
                        <div className="checkoutButton">
                            <button className="checkout">Checkout</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}