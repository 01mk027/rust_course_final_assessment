import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const Sales = () => {

    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);

    const fetchSales = async () => {
        try {
            const salesResponse = await axios.post('http://localhost:8000/sale/listsales', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const salesData = JSON.parse(salesResponse.data);
            setSales(salesData);

            // Fetch all products related to sales
            const productRequests = salesData.map(item => 
                axios.post('http://localhost:8000/product/fetchsingleproduct', { id: item.product_id }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            );

            // Wait for all product requests to complete
            const productsResponse = await Promise.all(productRequests);
            const productsData = productsResponse.map(product => JSON.parse(product.data));
            setProducts(productsData);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleDelete = async (sale_id) => {
        try {
            const res = await axios.post('http://localhost:8000/sale/deletesale', { id: sale_id }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.status === 200) {
                fetchSales();
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        console.log(products.length);
    }, [products]);

    return (
        <div className='container w-100 justify-content-center align-items-center'>
            {sales.length > 0 && products.length === sales.length ? sales.map((item, index) => {
                const product = products[index];
                return (
                    <table key={item.id} className='table-responsive table-bordered my-3'>
                        <thead>
                            <tr>
                                <th scope="col">Sale Id</th>
                                <th scope="col">Product Id</th>
                                <th scope="col">Product Image</th>
                                <th scope="col">Pieces</th>
                                <th scope='col'>Price</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Updated At</th>
                                <th scope='col'>Delete Product</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{item.id}</td>
                                <td>{product?.id}</td>
                                <td><img src={product?.image_path} alt={product?.description} style={{ width: '100px', height: '100px' }}/></td>
                                <td>{item.pieces}</td>
                                <td>{item.price} TL</td>
                                <td>{moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
                                <td>{item.updated_at ? moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss') : "Not Set"}</td>
                                <td>
                                    <button onClick={() => handleDelete(item.id)} className='btn btn-sm btn-danger'>DELETE SALE</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                );
            }) : <h3 style={{ color: 'red' }}>0 sales!</h3>}
        </div>
    );
};

export default Sales;
