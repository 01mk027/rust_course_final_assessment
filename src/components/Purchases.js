import React, {useEffect, useState} from 'react';
import axios from 'axios';
import moment from 'moment';

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [products, setProducts] = useState([]);


    const fetchPurchases = async () => {
        try {
            const purchasesResponse = await axios.post('http://localhost:8000/purchase/listpurchases', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const purchaseData = JSON.parse(purchasesResponse.data);
            setPurchases(purchaseData);

            // Fetch all products related to sales
            const productRequests = purchaseData.map(item => 
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
    }
    
    useEffect(() => {
        fetchPurchases();
    }, []);

    const handleDelete = async (id) => {
        await axios.post('http://localhost:8000/purchase/deletepurchase', {id: Number(id)}, {
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            if(res.status === 200){
                fetchPurchases();
            }
        }).catch(err => console.log(err));
    };


    return(
        <div className='container w-100 justify-content-center align-items-center'>
            {purchases.length > 0 && products.length === purchases.length ? purchases.map((item, index) => {
                const product = products[index];
                return (
                    <table key={item.id} className='table-responsive table-bordered my-3'>
                        <thead>
                            <tr>
                                <th scope="col">Purchase Id</th>
                                <th scope="col">Product Id</th>
                                <th scope="col">Product Image</th>
                                <th scope="col">Pieces</th>
                                <th scope='col'>Price</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Updated At</th>
                                <th scope='col'>Delete Purchase</th>
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
                                    <button onClick={() => handleDelete(item.id)} className='btn btn-sm btn-danger'>DELETE PURCHASE</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                );
            }) : <h3 style={{ color: 'red' }}>0 purchases!</h3>}
        </div>
    )
}

export default Purchases;