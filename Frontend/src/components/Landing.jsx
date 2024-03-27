import "../styles/Landing.scss";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Bakery from "../assets/bakery.png";
import Breakfast from "../assets/breakfast.png";
import Burger from "../assets/cheese-burger.png";
import Chicken from "../assets/chicken-leg.png";
import Fries from "../assets/fries.png";
import Lunch from "../assets/lunch.png";
import Momo from "../assets/momo.png";
import Pizza from "../assets/pizza.png";
import Italian from "../assets/italian.png";
import Mexican from "../assets/mexican.png";
import Rolls from "../assets/rolls.png";
import Salad from "../assets/salad.png";
import Smoothie from "../assets/smoothie.png";
import SouthIndian from "../assets/south-indian.png";
import Thai from "../assets/thai-food.png";
import SeaFood from "../assets/seafood.png";
import Coffee from "../assets/drinks.png";
import Chinese from "../assets/chinese.png";
import Desserts from "../assets/desserts.png";
import Healthy from "../assets/healthy.png";
import { useAuth0 } from "@auth0/auth0-react";
import { Fragment } from "react";
import Logout from './Logout.jsx'
export default function Landing() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [restaurants, setRestaurants] = useState([]);
    useEffect(() => {
        async function fetchRestaurants() {
            try {
                const restaurant = await fetch(
                    "http://localhost:3000/restaurants"
                ).then((response) => response.json());
                // console.log(foods);
                setRestaurants(restaurant);
            } catch (error) {
                console.log(e);
            }
        }
        fetchRestaurants();
    }, []);
    useEffect(() => {

    }, [])
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 15,
            slidesToSlide: 3,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1000 },
            items: 10,
            slidesToSlide: 2,
        },
        tablet: {
            breakpoint: { max: 1000, min: 600 },
            items: 6,
            slidesToSlide: 1,
        },
        mobile: {
            breakpoint: { max: 600, min: 0 },
            items: 4,
            slidesToSlide: 1,
        },
    };
    return (
        <div className="landing">
            <div className="greet">
                <h2>
                    {isAuthenticated ? user.given_name ? user.given_name : user.nickname : "User"}, What's on your mind ?{" "}
                </h2>
            </div>
            <div className="carousel">
                <Carousel draggable={false} responsive={responsive}>
                    <div className="card">
                        <img src={Bakery} alt="Bakery" />
                        <p>Bakery</p>
                    </div>
                    <div className="card">
                        <img src={Breakfast} alt="Breakfast" />
                        <p>Breakfast</p>
                    </div>
                    <div className="card">
                        <img src={Pizza} alt="Pizza" />
                        <p>Pizza</p>
                    </div>
                    <div className="card">
                        <img src={Chicken} alt="Chicken" />
                        <p>Chicken</p>
                    </div>
                    <div className="card">
                        <img src={Momo} alt="Momo" />
                        <p>Momos</p>
                    </div>
                    <div className="card">
                        <img src={Lunch} alt="Lunch" />
                        <p>Lunch</p>
                    </div>
                    <div className="card">
                        <img src={Fries} alt="Fries" />
                        <p>Fries</p>
                    </div>
                    <div className="card">
                        <img src={Burger} alt="Burger" />
                        <p>Burger</p>
                    </div>
                    <div className="card">
                        <img src={Italian} alt="Italian" />
                        <p>Italian</p>
                    </div>
                    <div className="card">
                        <img src={Mexican} alt="Mexican" />
                        <p>Mexican</p>
                    </div>
                    <div className="card">
                        <img src={Rolls} alt="Rolls" />
                        <p>Rolls</p>
                    </div>
                    <div className="card">
                        <img src={Salad} alt="Salad" />
                        <p>Salad</p>
                    </div>
                    <div className="card">
                        <img src={Smoothie} alt="Smoothie" />
                        <p>Smoothie</p>
                    </div>
                    <div className="card">
                        <img src={SouthIndian} alt="South Indian" />
                        <p>South Indian</p>
                    </div>
                    <div className="card">
                        <img src={Thai} alt="Thai" />
                        <p>Thai</p>
                    </div>
                    <div className="card">
                        <img src={SeaFood} alt="Sea Food" />
                        <p>Sea Food</p>
                    </div>
                    <div className="card">
                        <img src={Coffee} alt="Coffee" />
                        <p>Coffee</p>
                    </div>
                    <div className="card">
                        <img src={Chinese} alt="Chinese" />
                        <p>Chinese</p>
                    </div>
                    <div className="card">
                        <img src={Desserts} alt="Desserts" />
                        <p>Desserts</p>
                    </div>
                    <div className="card">
                        <img src={Healthy} alt="Healthy" />
                        <p>Healthy</p>
                    </div>
                </Carousel>
            </div>
            <div className="restaurantCount">
                <h2>Choose from {restaurants.length} results!</h2>
            </div>
            <div className="restaurants">
                {restaurants.map((restaurant, index) => {
                    return (
                        <Link to={`/${restaurant._id}/menu`} style={{ textDecoration: 'none' }} key={index}>
                            <div className="restaurantCard" key={index}>
                                <img src={restaurant.coverPhotoURL} alt={restaurant.name} />
                                <div className="info">
                                    <div className="grouped">
                                        <h4>{restaurant.name}</h4>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            <Logout />
            <Link to="/ownerLanding">Are you an owner ? </Link>
        </div>
    );
}
