import "../styles/FoodItemModal.scss";
import { useState } from 'react';
export default function FoodItemModal({ hideModal, food }) {
    const [formData, setFormData] = useState(food);
    // const [editedFormData, setEditedFormData] = useState();
    const [editPicture, setEditPicture] = useState(null);
    function handleInputChange(identifier, event) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [identifier]: event.target.value, // [identifier] is a dynamic key, (javascript syntax)
        }));
    }
    function handlePictureChange(event) {
        // setFormData({ ...formData, ['image']: event.target.files[0] }); 
        setEditPicture(event.target.files[0]);
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const mongoData = {
            name: formData.name,
            price: formData.price,
            type: formData.type,
            description: formData.description,
            imageURL: formData.imageURL
        }
        if (editPicture) {
            // fetching the presigned URL from the backend
            const url = await fetch("http://localhost:3000/s3URL").then(response => response.json());
            // PUT request to S3 to upload the image
            await fetch(url.url, {
                method: "PUT",
                headers: {
                    "Content-Type": "image/jpeg"
                },
                body: editPicture,
            })
            const imageUrl = url.url.split("?")[0];
            mongoData.imageURL = imageUrl;
        }
        await fetch(`http://localhost:3000/foods/${food._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json', // Set the Content-Type header for JSON data
            },
            body: JSON.stringify(mongoData),
        }).then(response => response.json()).then(data => {
            console.log(data);
            hideModal();
        }).catch(error => {
            console.log(error);
        }
        );

    }
    return (
        <>
            <div className="food-item-portal">
                <div className="modalHeader">
                    <h3>Edit Food Item</h3>
                </div>
                <form action="" onSubmit={handleSubmit}>
                    <div className="take">
                        <input type="text" id="name" placeholder="Name" value={formData.name} onChange={(event) => handleInputChange('name', event)} />
                    </div>
                    <div className="showImg">
                        <img src={editPicture ? URL.createObjectURL(editPicture) : formData.imageURL} alt="Food Item" />
                    </div>
                    <div className="take">
                        <input type="text" id="price" placeholder="Price" value={formData.price} onChange={(event) => handleInputChange('price', event)} />
                    </div>
                    <div className="take">
                        <select id="type" value={formData.type} onChange={(event) => handleInputChange('type', event)}>
                            <option value="veg">Veg</option>
                            <option value="non-veg">Non-Veg</option>
                        </select>
                    </div>
                    <div className="take">
                        <textarea id="description" placeholder="Description" value={formData.description} onChange={(event) => handleInputChange('description', event)} />
                    </div>
                    <div className="take">
                        <label htmlFor="foodImage">Upload Food Image : </label>
                        <input type="file" name="image" id="image" onChange={handlePictureChange} />
                    </div>
                    <div className="buttons">
                        <button type="submit">Save</button>
                        <button type="button" onClick={hideModal}>Close</button>
                    </div>
                </form>
            </div>
        </>
    )
}