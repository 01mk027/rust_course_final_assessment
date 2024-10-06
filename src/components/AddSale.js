import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
/*
                                    <th scope="col">Sale Id</th>
                                    <th scope="col">Product Image</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Pieces</th>
                                    <th scope='col'>Price</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col">Updated At</th>
                                    <th scope='col'>Delete Product</th>
 */
const AddSale = () => {
    const [allProducts, setAllProducts] = useState();
    const [selectedProduct, setSelectedProduct] = useState();
    const [selectedProductId, setSelectedProductId] = useState(-1);
    const [computedSelectedProduct, setComputedSelectedProduct] = useState();
    const [pieces, setPieces] = useState(0);
    const [price, setPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(selectedProduct);
        axios.post('http://localhost:8000/product/listproducts', {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Include your token if necessary
            }
        }).then(res => {
            if (res.status === 200) {
                setAllProducts(JSON.parse(res.data));
                console.log(JSON.parse(res.data));
            }
            else {
                console.log(res);
            }
        }).catch(err => console.log(err));
        //console.log(response.data);
        //setProducts(JSON.parse(response.data));
    }, [selectedProduct])


    const handleSelectChange = async (e) => {
        setSelectedProduct(e.target.value);
        setSelectedProductId(e.target.value);
        setPrice(0);
        setPieces(0);
    }

    useEffect(() => {
        console.log(selectedProduct);
        axios.post('http://localhost:8000/product/fetchsingleproduct', { id: Number(selectedProduct) }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            setComputedSelectedProduct(JSON.parse(res.data));
        }).catch(err => {
            console.log(err);
        })
    }, [selectedProduct])

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:8000/sale/addsale', {
            product_id:Number(selectedProduct),
            pieces: Number(pieces),
            price: Number(price)
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(resp => {
            console.log(resp);
            if(resp.status === 200)
            {
                navigate('/listsales');
            }
        }).catch(err => console.log(err));
    };

    return (
        <>
            <div className='container text-center'>
                <div className='jumbotron bg-warning text-center'>
                    <b className='fs-5 my-5'>Please select product to be added into Sales</b>
                    <select value={selectedProduct} onChange={(e) => handleSelectChange(e)} className='form-select my-2'>
                        <option value={-1}>Please select product to add into sale...</option>
                        {allProducts && allProducts.map(item => {
                            return (<option value={item.id}>{item.name}</option>)
                        })}
                    </select>
                </div>


                    {computedSelectedProduct && selectedProduct && selectedProduct !== "-1" ?
                    <>
                        <div className='jumbotron-fluid bg-info text-center align-items-center d-flex flex-column'>
                            <img className="img img-fluid" src={computedSelectedProduct && computedSelectedProduct.image_path} style={{ width: '128px', height: '108px' }}/>
                            <b className='fs-5'>{computedSelectedProduct && computedSelectedProduct.name}</b>
                            <i className='text-italic'>{computedSelectedProduct && computedSelectedProduct.description}</i>
                            <form onSubmit={handleSubmit}>
                                <div className='form-group'>
                                    <label htmlFor="pieces">
                                        Pieces:
                                    </label>
                                    <input className="form-control" type="number" id="pieces" value={pieces} onChange={(e) => setPieces(e.target.value)}  min={0} />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="pieces">
                                        Price:
                                    </label>
                                    <input type="number" className='form-control' id="price" value={price} onChange={(e) => setPrice(e.target.value)}  min={0} />
                                </div>
                                <button type='btn btn-success'>ADD SALE</button>
                            </form>
                        </div>
                    </> : ""} 



            </div>
        </>
    )
};

export default AddSale;