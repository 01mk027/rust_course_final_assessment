import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProduct = () => {
    const [products, setProducts] = useState([]);
    const [isProductSelected, setIsProductSelected] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(-1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productId, setProductId] = useState(-1);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedQuantity, setUpdatedQuantity] = useState(0);
    const [updatedImagePath, setUpdatedImagePath] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.post('http://localhost:8000/product/listproducts', {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Include your token if necessary
                    }
                });
                setProducts(JSON.parse(response.data));
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setSelectedProductId(e.target.value);
    };

    useEffect(() => {
        if (selectedProductId === "-1") {
            setIsProductSelected(false);
        } else {
            setIsProductSelected(true);
            axios.post('http://localhost:8000/product/fetchsingleproduct', {
                id: Number(selectedProductId)
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include your token if necessary
                }
            }).then(res => {
                const product = JSON.parse(res.data);
                setSelectedProduct(product);
                // Set the initial values for the form fields
                setProductId(product.id);
                setUpdatedName(product.name);
                setUpdatedDescription(product.description);
                setUpdatedQuantity(product.quantity);
                setUpdatedImagePath(product.image_path);
            }).catch(err => console.log(err));
        }
    }, [selectedProductId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(productId, updatedName, updatedQuantity, updatedDescription, updatedImagePath);
        
        await axios.post('http://localhost:8000/product/updateproduct', {
            id:productId,
            name: updatedName,
            description: updatedDescription,
            quantity: updatedQuantity,
            image_path: updatedImagePath
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
    };

    return (
        <div className='container p-4'>
            <div className='jumbotron bg-warning p-5 text-center'>
                <b className="fs-5">CHOOSE PRODUCT</b>
                <select className='form-control' onChange={handleChange}>
                    <option value="-1">Please select product to edit</option>
                    {products.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
            </div>    
            {isProductSelected && selectedProduct && (
                <form className='my-4' onSubmit={handleSubmit}>
                    <div className="form-group my-2">
                        <label htmlFor="productName">Product Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="productName"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            placeholder="Enter product name"
                            maxLength={200}
                            required
                        />
                    </div>
                    <div className="form-group my-2">
                        <label htmlFor="description">Product Description</label>
                        <input
                            type="text"
                            className="form-control"
                            id="description"
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                            placeholder="Enter product description"
                            maxLength={200}
                            required
                        />
                    </div>
                    <div className="form-group my-2">
                        <label htmlFor="quantity">Product Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            value={updatedQuantity}
                            onChange={(e) => setUpdatedQuantity(Number(e.target.value))}
                            min={1}
                            placeholder="Enter product quantity"
                            required
                        />
                    </div>
                    <div className="form-group my-2">
                        <label htmlFor="imagePath">ImagePath</label>
                        <input
                            type="text"
                            className="form-control"
                            id="imagePath"
                            value={updatedImagePath}
                            onChange={(e) => setUpdatedImagePath(e.target.value)}
                            placeholder="Enter image path as link"
                            maxLength={200}
                            required
                        />
                        <small>Please paste the path of the image; uploading files is not supported for this project.</small>
                    </div>
                    <button type="submit" className="btn btn-primary my-2">Submit</button>
                </form>
            )}
        </div>
    );
};

export default EditProduct;
