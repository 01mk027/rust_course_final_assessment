import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment';

const Products = () => {

    const [products, setProducts] = useState([]);


    const fetchProducts = async () => {
        try {
            const response = await axios.post('http://localhost:8000/product/listproducts', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include your token if necessary
                }
            });
            console.log(response.data);
            setProducts(JSON.parse(response.data));
            
        } catch (err) {
            console.error(err.message);
        }
    };


    useEffect(() => {

    
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        await axios.post('http://localhost:8000/product/deleteproduct', {id: id}, {
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            if(res.status === 200)
            {
                fetchProducts();
            }
        }).catch(err => console.log(err));
    };


    return(
        <div className='container w-100'>
            <table className='table-responsive table-bordered my-3'>
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Updated At</th>
                    <th scope="col">Image</th>
                    <th scope='col'>Delete Product</th>
                </tr>
            </thead>
            <tbody>
                {
                    products.length > 0 ? products.map(item => {
                        return(
                            <tr>
                                <th scope="row">{item.id && item.id}</th>
                                <td>{item.name && item.name}</td>
                                <td>{item.description && item.description}</td>
                                <td>{item.quantity && item.quantity}</td>
                                <td>{item.created_at && moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
                                <td>{item.updated_at && moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss')}</td>
                                <td><img className="img-fluid" src={item.image_path && item.image_path} style={{ width: '200px', height: '200px' }}/></td>
                                <td><button className='btn btn-sm btn-danger m-2' onClick={() => handleDelete(item.id)}>Delete Product</button></td>
                            </tr>
                        )
                    }) : "No products found"
                }
            </tbody>
            </table>
        </div>
    )
};

export default Products;