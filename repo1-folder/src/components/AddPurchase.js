import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AddPurchase = () => {

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState();
    const [selectedProductId, setSelectedProductId] = useState(0);
    const [price, setPrice] = useState(0);
    const [pieces, setPieces] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        axios.post('http://localhost:8000/product/listproducts', {}, {
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            if(res.status === 200)
            {
                setProducts(JSON.parse(res.data));
            }
        }).catch(err => console.log(err));
    }, [])

    const handleSelectChange = async (e) => {
        await axios.post('http://localhost:8000/product/fetchsingleproduct', { id: Number(e.target.value) }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            setSelectedProduct(JSON.parse(res.data));
        }).catch(err => {
            console.log(err);
        })
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:8000/purchase/addpurchase', {
            product_id: Number(selectedProduct.id),
            price: Number(price),
            pieces: Number(pieces)
        }, {
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            if(res.status === 200){
                navigate('/listpurchases');
            }
        }).catch(err => console.log(err));
    } 


    return (
        <div className='container text-center'>
            <div className='jumbotron bg-warning text-center'>
                <b className='fs-5 my-5'>Please select product to be added into Sales</b>
                <select value={selectedProductId} onChange={(e) => handleSelectChange(e)} className='form-select my-2'>
                    <option value={-1}>Please select product to add into sale...</option>
                    {products && products.map(item => {
                        return (<option value={item.id}>{item.name}</option>)
                    })}
                </select>
            </div>


            {selectedProduct && selectedProduct && selectedProduct !== "-1" ?
                    <>
                        <div className='jumbotron-fluid bg-info text-center align-items-center d-flex flex-column'>
                            <img className="img img-fluid" src={selectedProduct && selectedProduct.image_path} style={{ width: '128px', height: '108px' }}/>
                            <b className='fs-5'>{selectedProduct && selectedProduct.name}</b>
                            <i className='text-italic'>{selectedProduct && selectedProduct.description}</i>
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
                                <button className='btn btn-success'>ADD PURCHASE</button>
                            </form>
                        </div>
                    </> : ""} 
        </div>
    )
}

export default AddPurchase;