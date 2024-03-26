import "../styles/OwnerLanding.scss";
import RestaurantImg from "../assets/restaurant.jpg";
import Customers from "../assets/customers.jpg";
import Lookout from "../assets/lookout.jpg";
import Profit from "../assets/profit.jpg";
import { useState, useEffect } from "react";
export default function OwnerLanding() {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        phone: "",
        email: "",
        coverPhoto: null,
        description: "",
        location: "",
        password: "",
        confirmPassword: ""
    });
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        // Cleanup the event listener when component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const createRestaurant = async (restaurant) => {
        try {
            // GET request to backend to fetch the presigned URL to put the image in S3
            const url = await fetch("http://localhost:3000/s3URL").then(response => response.json());
            // PUT request to s3 to upload the image 
            await fetch(url.url, {
                method: "PUT",
                headers: {
                    "Content-Type": "image/jpeg"
                },
                body: restaurant.coverPhoto
            })
            const coverPhotoURL = url.url.split("?")[0];
            const mongoData = {
                name: restaurant.name,
                category: restaurant.category,
                phone: restaurant.phone,
                email: restaurant.email,
                description: restaurant.description,
                location: restaurant.location,
                coverPhotoURL: coverPhotoURL,
                password: restaurant.password
            }
            // POST request to backend to submit the data to MongoDB
            await fetch("http://localhost:3000/uploadRestaurant", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(mongoData)
            })
        }
        catch (error) {
            console.log(error);
        }
    }
    const handlePictureChange = async (event) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            ['coverPhoto']: event.target.files[0]
        }))
    }
    function handleInputChange(identifier, event) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [identifier]: event.target.value, // [identifier] is a dynamic key, (javascript syntax)
        }));
    }
    function handleSubmit(event) {
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        event.preventDefault();
        createRestaurant(formData);
        setFormData({
            name: "",
            phone: "",
            email: "",
            description: "",
            coverPhoto: null,
            category: "",
            location: "",
            password: "",
            confirmPassword: ""
        });
        console.log("Form Submitted!");
    }
    return (
        <>
            <header>
                <div className="logo"><span>FJ for Merchants</span></div>
                <div className="loginDiv"><span>Login</span></div>
            </header>
            <main>
                <div className="mainBox">
                    <div className="formDiv">
                        <div className="heading">
                            <h2>Show your restaurant to the world with FoodJunction</h2>
                        </div>
                        <div className="childFormDiv">
                            <h3>Unlock more profits, get branding solutions and take your business to the next level.</h3>
                            <form action="" onSubmit={handleSubmit}>
                                <div className="takeName takeIt">
                                    <input type="text" placeholder="Restaurant Name" name="name" id="name" value={formData.name} onChange={(event) => handleInputChange('name', event)} />
                                </div>
                                <div className="takeAddress takeIt">
                                    <input type="text" placeholder="Business Address" name="location" id="location" value={formData.location} onChange={(event) => handleInputChange('location', event)} />
                                </div>
                                <div className="takeEmail takeIt">
                                    <input type="text" placeholder="Email Address" name="email" id="email" value={formData.email} onChange={(event) => handleInputChange('email', event)} />
                                </div>
                                <div className="takePassword">
                                    <input type="text" placeholder="Password" name="password" id="email" value={formData.password} onChange={(event) => handleInputChange('password', event)} />
                                    <input type="text" placeholder="Confirm Password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={(event) => handleInputChange('confirmPassword', event)} />
                                </div>
                                <div className="takeDescription takeIt">
                                    <textarea placeholder="Short description of your business" id="description" name="description" value={formData.description} onChange={(event) => handleInputChange('description', event)} />
                                </div>
                                <div className="takeCategory takeIt">
                                    <input type="text" placeholder="Category" value={formData.category} name="category" id="category" onChange={(event) => handleInputChange('category', event)} />
                                </div>
                                <div className="takeCoverPhoto">
                                    <label htmlFor="coverPhoto">Upload a cover Photo</label>
                                    <input type="file" id="coverPhoto" name="coverPhoto" onChange={handlePictureChange} />
                                </div>
                                <div className="getStarted">
                                    <button type="submit">Get Started</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {screenWidth > 1250 && <div className="backgroundImgDiv">
                        <img src={RestaurantImg} alt="" />
                    </div>}
                </div>
                <div className="belowMain">
                    <div className="heading2">
                        <h2>Bring your business in front of the world</h2>
                    </div>
                    <div className="gridElements">
                        <div className="gridElement">
                            <div className="imgElement">
                                <img src={Customers} alt="" />
                            </div>
                            <div className="paraDescription">
                                <p>Get feedback from your customers and use analytics to improve your services</p>
                            </div>
                        </div>
                        <div className="gridElement">
                            <div className="imgElement">
                                <img src={Lookout} alt="" />
                            </div>
                            <div className="paraDescription">
                                <p>Reach new customers and use our branding strategies to expand your business</p>
                            </div>
                        </div>
                        <div className="gridElement">
                            <div className="imgElement">
                                <img src={Profit} alt="" />
                            </div>
                            <div className="paraDescription">
                                <p>Unlock more profit and manage your sales using our detailed dashboard</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer>
                <div>©️ 2024 FoodJunction : Made with 💟 by Arghadeep Dey</div>
            </footer>
        </>
    )
}