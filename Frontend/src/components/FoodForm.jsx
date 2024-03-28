import { useState } from 'react';
import axios from 'axios';
import '../styles/FoodForm.scss';
export default function FoodForm({ restaurantId }) {
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        type: "veg",
        description: "",
        image: null,
    })
    const createFoodItem = async (foodData) => {
        try {
            // GET request to backend to fetch the presigned URL to put the image in S3
            const url = await fetch("http://localhost:3000/s3URL").then(response => response.json());
            // PUT request to S3 to upload the image
            await fetch(url.url, {
                method: "PUT",
                headers: {
                    "Content-Type": "image/jpeg"
                },
                body: foodData.image,
            })
            const imageUrl = url.url.split("?")[0];
            const mongoData = {
                restaurantId: restaurantId,
                name: foodData.name,
                price: foodData.price,
                type: foodData.type,
                description: foodData.description,
                imageURL: imageUrl,
            }
            // POST request to backend to submit the data to MongoDB
            await fetch("http://localhost:3000/uploads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(mongoData),
            })
        }
        catch (error) {
            console.log(error);
        }
    }
    const handlePictureChange = async (event) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            ['image']: event.target.files[0]
        }))
    }
    function handleInputChange(identifier, event) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [identifier]: event.target.value, // [identifier] is a dynamic key, (javascript syntax)
        }));
    }
    async function handleSubmit(event) {
        event.preventDefault(); // prevents the default browser behavior of submitting the form by generating an HTTP request
        // console.log(formData.image); 
        createFoodItem(formData);
        setFormData({
            name: "",
            price: 0,
            type: "veg",
            description: "",
            image: null
        });
        console.log("Form Submitted");
    }
    return (
        <>
            <div className="main" >
                <div className="centerDiv">
                    <h2>Add Food Item Details</h2>
                    <form action="\form" method="post" onSubmit={handleSubmit}>
                        <div className="take">
                            <label htmlFor="foodName">Enter Food Item Name : </label>
                            <input type="text" name="name" placeholder="Name" id="foodName" value={formData.name} onChange={(event) => handleInputChange('name', event)} required />
                        </div>
                        <div className="take">
                            <label htmlFor="foodPrice">Enter Food Item Price : </label>
                            <input type="number" name="price" placeholder="Price" id="foodPrice" value={formData.price} onChange={(event) => handleInputChange('price', event)} required />
                        </div>
                        <div className="take">
                            <label htmlFor="type">Veg/Non-Veg</label>
                            <select name="type" id="type" onChange={(event) => handleInputChange('type', event)} value={formData.type}>
                                <option value="veg">Veg</option>
                                <option value="non-veg">Non-Veg</option>
                            </select>
                        </div>
                        <div className="description">
                            <label htmlFor="foodDescription">Enter Food Item Description : </label>
                            <textarea name="description" id="foodDescription" cols="10" rows="5" value={formData.description} onChange={(event) => handleInputChange('description', event)}></textarea>
                        </div>
                        <div className="take">
                            <label htmlFor="foodImage">Upload Food Image : </label>
                            <input type="file" name="image" id="image" onChange={handlePictureChange} required />
                        </div>
                        <div className="submit">
                            <button type="submit">Add Food Item</button>
                        </div>
                    </form>
                </div>
            </div>
        </>)
};