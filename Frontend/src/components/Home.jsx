import FoodItems from "./FoodItems";
import { Link } from "react-router-dom";

import Landing from "./Landing";
import "../styles/Home.scss";
export default function Home() {
    return (
        <>
            <div className="mainHomeDiv">
                <FoodItems />
            </div>
        </>
    )
}
