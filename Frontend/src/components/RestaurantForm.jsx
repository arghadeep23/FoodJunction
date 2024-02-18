import {useState} from 'react';
export default function RestaurantForm()
{
    const [formData,setFormData] = useState({
        name : "", 
        category : "", 
        phone : "", 
        email : "",
        coverPhoto : null,
        description : "", 
        latitude : 0,
        longitude: 0, 
        location : "",
    }); 
    const createRestaurant = async (restaurant)=>{
        try{
            // GET request to backend to fetch the presigned URL to put the image in S3
            const url = await fetch("http://localhost:3000/s3URL").then(response=>response.json()); 
            // PUT request to s3 to upload the image 
            await fetch(url.url,{
                method : "PUT", 
                headers : {
                    "Content-Type" : "image/jpeg"
                }, 
                body : restaurant.coverPhoto
            })
            const coverPhotoURL = url.url.split("?")[0]; 
            const mongoData = {
                name : restaurant.name, 
                category : restaurant.category,
                phone : restaurant.phone,
                email : restaurant.email,
                latitude : restaurant.latitude, 
                longitude : restaurant.longitude , 
                description : restaurant.description, 
                location : restaurant.location,  
                coverPhotoURL : coverPhotoURL
            }
            // POST request to backend to submit the data to MongoDB
            await fetch("http://localhost:3000/uploadRestaurant",{
                method : "POST", 
                headers  :{
                    "Content-Type" : "application/json"
                }, 
                body : JSON.stringify(mongoData)
            }) 
        }
        catch(error)
        {
            console.log(error); 
        }
        
    }
    const handlePictureChange = async (event)=>
    {
            setFormData((prevFormData)=> ({
                ...prevFormData,
                ['coverPhoto']: event.target.files[0]
            }))
    }
    function handleInputChange(identifier,event)
    {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [identifier]: event.target.value, // [identifier] is a dynamic key, (javascript syntax)
        }));
    }
    function handleSubmit(event)
    {
        event.preventDefault(); 
        createRestaurant(formData); 
        setFormData({
            name : "", 
            phone : "", 
            email : "",
            latitude : 0, 
            longitude : 0, 
            description : "", 
            coverPhoto : null , 
            category : "", 
            location : "",
        });  
        console.log("Form Submitted!"); 
    }
    return (
        <div className="main" >
            <div className="centerDiv">
                <h2>Add Restaurant Details</h2>
                <form action="\form" method="post" onSubmit={handleSubmit}>
                    <div className="take">
                        <label htmlFor="restaurantName">Enter Restaurant Name : </label>
                        <input type="text" name="name" placeholder="Name" id="restaurantName" value={formData.name} onChange={(event)=>handleInputChange('name',event)}/>
                    </div>
                    <div className="take">
                        <label htmlFor="location">Enter Location : </label>
                        <input type="text" name="location" placeholder="Location" id="location" value={formData.location} onChange={(event)=>handleInputChange('location',event)}/>
                    </div>
                    <div className="take">
                        <label htmlFor="category">Enter Category : </label>
                        <input type="text" name="category" placeholder="Category" id="category" value={formData.category} onChange={(event)=>handleInputChange('category',event)}/>
                    </div>
                    <div className="take">
                        <label htmlFor="description">Enter Description : </label>
                        <textarea name="description" id="description" cols="10" rows="5" value={formData.description} onChange={(event)=>handleInputChange('description',event)}></textarea>
                    </div>
                    <div className="take">
                        <label htmlFor="latitude">Enter Latitude : </label>
                        <input type="text" name="latitude" placeholder="Latitude" id="latitude" value={formData.latitude} onChange={(event)=>handleInputChange('latitude',event)}/>
                    </div>
                    <div className="take">
                        <label htmlFor="longitude">Enter Latitude : </label>
                        <input type="text" name="longitude" placeholder="Longitude" id="longitude" value={formData.longitude} onChange={(event)=>handleInputChange('longitude',event)}/>
                    </div>
                    <div className="take">
                        <label htmlFor="phone">Enter Phone Number : </label>
                        <input type="text" name="phone" placeholder="phone" id="phone" value={formData.phone} onChange={(event)=>handleInputChange('phone',event)}/>
                    </div>
                    <div className="take">
                        <label htmlFor="longitude">Enter Email : </label>
                        <input type="text" name="email" placeholder="email" id="email" value={formData.email} onChange={(event)=>handleInputChange('email',event)}/>
                    </div>
                    <div className="take">
                        <label htmlFor="coverPhoto">Upload Cover Photo : </label>
                        <input type="file" name="coverPhoto" id="coverPhoto" onChange={handlePictureChange}/>
                    </div>
                    <div className="submit">
                        <button type="submit">Add Restaurant</button>
                    </div>
                </form> 
            </div>
        </div>
    )
}