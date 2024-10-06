import React, {useState} from 'react';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AddProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [createdAt, setCreatedAt] = useState();
    const [imagePath, setImagePath] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(name, description, quantity, moment().utc().format() , imagePath);
        
            axios.post('http://localhost:8000/product/addproduct', {
                    name: name,
                    description: description,
                    quantity: Number(quantity),
                    image_path: imagePath
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Include your token if necessary
                    }
                }).then(res => {
                    if(res.status === 200)
                    {
                        navigate('/listproducts');
                    }
                }).catch(err => console.log(err));
            }
        
    



    return(
        <div className='container'>
        <form className='my-4' onSubmit={handleSubmit}>
        <div class="form-group my-2">
            <label for="productName">Product Name:</label>
            <input type="text" class="form-control" id="productName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" maxLength={200} required/>
        </div>
        <div class="form-group my-2">
            <label for="description">Product Description</label>
            <input type="text" class="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter product description" maxLength={200} required/>
        </div>
        <div class="form-group my-2">
            <label for="quantity">Product Quantity</label>
            <input type="number" class="form-control" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} min={1} placeholder="Enter product description" required/>
        </div>
        <div class="form-group my-2">
            <label for="imagePath">ImagePath</label>
            <input type="text" class="form-control" id="imagePath" value={imagePath} onChange={(e) => setImagePath(e.target.value)} placeholder="Enter image path as link" maxLength={200} required/>
        </div>
        <button type="submit" class="btn btn-primary my-2">Submit</button>
        </form>       
        </div>
    )
};

export default AddProduct;