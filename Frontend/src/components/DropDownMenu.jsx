import "./DropDownMenu.scss"
import {useContext} from "react"; 
import {CartContext} from "../store/CartContext";
import DropDownItem from "./DropDownItem.jsx";
export default function DropDownMenu()
{
    const cartCtx = useContext(CartContext);
    
    return (
        <div className="dropdown">
            <DropDownItem/>
        </div>
    )
}