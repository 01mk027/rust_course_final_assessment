import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const EditPurchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedPurchaseIndex, setSelectedPurchaseIndex] = useState(0);
    const [selectedPurchase, setSelectedPurchase] = useState();
    const [selectedProduct, setSelectedProduct] = useState();
    const [pieces, setPieces] = useState(0);
    const [price, setPrice] = useState(0);
    const [allProducts, setAllProducts] = useState([]);
    const navigate = useNavigate();


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

    const fetchAllProducts = async (e) => {
        await axios.post('http://localhost:8000/product/listproducts', {}, {
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            if(res.status === 200)
            {
                setAllProducts(JSON.parse(res.data))
            }
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        fetchPurchases();
        fetchAllProducts();
    }, []);

    const handlePurchaseChange = async (e) => {
        await axios.post('http://localhost:8000/purchase/fetchsinglepurchase', { id: Number(e.target.value) }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            setSelectedPurchase(JSON.parse(res.data));
            setPieces(JSON.parse(res.data).pieces);
            setPrice(JSON.parse(res.data).price);
            
                axios.post('http://localhost:8000/product/fetchsingleproduct', { id: Number(JSON.parse(res.data).product_id) }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => setSelectedProduct(JSON.parse(res.data))).catch(err => console.log(err));
            
        }).catch(err => console.log(err));
    };




    const handleProductChange = async (e) => {
        await axios.post('http://localhost:8000/product/fetchsingleproduct', { id: Number(e.target.value) }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => setSelectedProduct(JSON.parse(res.data))).catch(err => console.log(err));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:8000/purchase/updatepurchase', {
            id: Number(selectedPurchase.id),
            product_id: Number(selectedProduct.id),
            pieces: Number(pieces),
            price: Number(price)
        }, {
            headers:{
                'Authorization' : `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            if(res.status === 200){
                navigate('/listpurchases');
            }
        }).catch(err => console.log(err));
    }


    return (
        <div className='container text-center'>
            <div className='jumbotron-fluid bg-warning p-2'>
                <select value={selectedPurchaseIndex} onChange={handlePurchaseChange} className='form-select'>
                    <option value={-1} selected>Please choose purchase to be edited</option>
                    {
                        purchases.map((item, index) => {
                            return (<option value={item.id}>{products[index] && products[index].name} {item.price}</option>)
                        })
                    }
                </select>
            </div>


            {
                selectedPurchase  ? <>
                    <div className='jumbotron-fluid bg-info text-center align-items-center d-flex flex-column'>
                        <img className="img img-fluid" src={selectedProduct && selectedProduct.image_path} style={{ width: '128px', height: '108px' }} />
                        <b className='fs-5'>{selectedProduct && selectedProduct.name}</b>
                        <i className='text-italic'>{selectedProduct && selectedProduct.description}</i>
                        <select className='form-select w-50' onChange={handleProductChange}>
                            <option value={-1} selected>Please select product, if you want to update</option>
                            {
                                allProducts.map(item => {
                                    return(<option value={item.id}>{item.name}</option>)
                                })
                            }
                        </select>
                        <form onSubmit={handleSubmit}>
                            <div className='form-group'>
                                <label htmlFor="pieces">
                                    Pieces:
                                </label>
                                <input className="form-control" type="number" id="pieces" value={pieces} onChange={(e) => setPieces(e.target.value)} min={0} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="pieces">
                                    Price:
                                </label>
                                <input type="number" className='form-control' id="price" value={price} onChange={(e) => setPrice(e.target.value)} min={0} />
                            </div>
                            <button className='btn btn-success'>EDIT SALE</button>
                        </form>
                    </div>
                </> : ""
}         

        </div>
    )
};

export default EditPurchase;