import "../styles/DashboardProfile.scss";
import { useState, useEffect } from 'react';
export default function DashboardProfile({ restaurantData, handleDetailsEdit }) {

    const [formData, setFormData] = useState(restaurantData);
    const [image, setImage] = useState(null);
    const [edit, setIsEdit] = useState(false);
    useEffect(() => {
        setFormData(restaurantData);
    }, [restaurantData]);
    function handlePictureChange(event) {
        if (!edit) {
            setIsEdit(true);
        }
        setImage(event.target.files[0]);
    }
    function handleInputChange(identifier, event) {
        if (!edit) {
            setIsEdit(true);
        }
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [identifier]: event.target.value
            }
        })
    }
    function handleCoordinateChange(identifier, event) {
        if (!edit) {
            setIsEdit(true);
        }
        if (identifier === 'latitude') {
            setFormData((prevFormData) => {
                return {
                    ...prevFormData,
                    geometry: {
                        type: "Point",
                        coordinates: [prevFormData.geometry.coordinates[0], event.target.value]
                    }
                }
            })
        }
        else if (identifier === 'longitude') {
            setFormData((prevFormData) => {
                return {
                    ...prevFormData,
                    geometry: {
                        type: "Point",
                        coordinates: [event.target.value, prevFormData.geometry.coordinates[1]]
                    }
                }
            })
        }
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const mongoData = {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            location: formData.location,
            geometry: formData.geometry,
            email: formData.email,
            phone: formData.phone,
        }
        if (image) {
            // fetching the presigned URL from the backend
            const url = await fetch("http://localhost:3000/s3URL").then(response => response.json());
            // PUT request to S3 to upload the image
            await fetch(url.url, {
                method: "PUT",
                headers: {
                    "Content-Type": "image/jpeg"
                },
                body: image,
            })
            const imageUrl = url.url.split("?")[0];
            mongoData.coverPhotoURL = imageUrl;
        }
        await fetch(`http://localhost:3000/restaurants/${restaurantData._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json', // Set the Content-Type header for JSON data
            },
            body: JSON.stringify(mongoData),
        }).then(response => response.json()).catch(error => {
            console.log(error);
        });
        setIsEdit(false);
        handleDetailsEdit();
    }

    return (
        <>
            <div className="formStyle">
                <div className="header">
                    <h1>{restaurantData.name} Profile - {edit ? "Editing Mode" : "Preview"}</h1>
                </div>
                <form action="" onSubmit={handleSubmit}>
                    <div className="take">
                        <label htmlFor="restaurantName">Restaurant Name</label>
                        <input type="text" id="restaurantName" value={formData.name} onChange={(event) => handleInputChange('name', event)} />
                    </div>
                    <div className="take">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" value={formData.description} onChange={(event) => handleInputChange('description', event)} />
                    </div>
                    <div className="take">
                        <label htmlFor="category">Category</label>
                        <input type="text" id="category" value={formData.category} onChange={(event) => handleInputChange('category', event)} />
                    </div>
                    <div className="take">
                        <label htmlFor="address">Address</label>
                        <input type="text" id="address" value={formData.location} onChange={(event) => handleInputChange('location', event)} />
                    </div>
                    <div className="take">
                        <label htmlFor="latitude">Latitude</label>
                        <input type="Number" id="latitude" value={formData.geometry.coordinates[1]} onChange={(event) => handleCoordinateChange('latitude', event)} />
                    </div>
                    <div className="take">
                        <label htmlFor="longitude">Longitude</label>
                        <input type="Number" id="longitude" value={formData.geometry.coordinates[0]} onChange={(event) => handleCoordinateChange('longitude', event)} />
                    </div>
                    <div className="take">
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" value={formData.email} name="email" onChange={(event) => handleInputChange('email', event)} />
                    </div>
                    <div className="take">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="text" id="phone" value={formData.phone} name="phone" onChange={(event) => handleInputChange('phone', event)} />
                    </div>
                    <div className="imagePreview">
                        <div className="showImage">
                            <img src={image ? URL.createObjectURL(image) : formData.coverPhotoURL} alt="cover-photo" />
                        </div>
                        <div className="takeImage">
                            <label htmlFor="coverPhoto">Cover Photo</label>
                            <input type="file" id="coverPhoto" onChange={handlePictureChange} />
                        </div>
                    </div>
                    <div className="buttons">
                        <button type="submit" disabled={edit ? false : true}>Save</button>
                    </div>
                </form>
            </div>

        </>
    )
}
