import "../styles/FoodItemModal.scss";
import { useState } from 'react';
export default function FoodItemModal({ hideModal, food }) {
    const [formData, setFormData] = useState(food);
    function handleChange(event) {
        setFormData({ ...formData, [event.target.id]: event.target.value });
    }
    function handlePictureChange(event) {
        setFormData({ ...formData, ['image']: event.target.files[0] });
    }
    return (
        <>
            <div className="food-item-portal">
                <div className="modalHeader">
                    <h3>Edit Food Item</h3>
                </div>
                <form action="">
                    <div className="take">
                        <input type="text" id="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="take">
                        <input type="text" id="price" placeholder="Price" value={formData.price} onChange={handleChange} />
                    </div>
                    <div className="take">
                        <select id="type" value={formData.type} onChange={handleChange}>
                            <option value="veg">Veg</option>
                            <option value="non-veg">Non-Veg</option>
                        </select>
                    </div>
                    <div className="take">
                        <textarea id="description" placeholder="Description" value={formData.description} onChange={handleChange} />
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