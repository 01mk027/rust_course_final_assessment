import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment';

const Home = () => {
  const {user} = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
  const [totalAmountOfSales, setTotalAmountOfSales] = useState(0);
  const [totalAmountOfPurchases, setTotalAmountOfPurchases] = useState(0);
  const [sales, setSales] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);



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
        setPurchasedProducts(productsData);

    } catch (err) {
        console.error(err);
    }
}

  const fetchProducts = async () => {
    await axios.post('http://localhost:8000/product/listproducts', {}, {
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
  }).then(res => {
    console.log(JSON.parse(res.data));
    setProducts(JSON.parse(res.data));}
  )
  };

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
        setSoldProducts(productsData);



    } catch (err) {
        console.error(err);
    }
};

  useEffect(() => {
    fetchProducts();
    fetchSales();
    fetchPurchases();
  }, [])

  useEffect(() => {
    let total = 0;
    products.map(item => {
      
      total += item.quantity;
    })
    setTotalAmountOfProducts(total);
  }, [products])


  useEffect(() => {
    let total = 0;
    purchases.map(item => {
      
      total += item.price;
    })
    setTotalAmountOfPurchases(total);
  }, [purchases])

  return (
    <div className='container text-center'>
      <h1><u>General Report Page</u></h1>

      <div className='jumbotron-fluid border border-black rounded'>
        <h3>PRODUCTS</h3>
        <table className='table'>
          <thead>
          <tr>
            <th scope='col'>Number of products</th>
            <th scope='col'>Total amount of products</th>
            <th scope='col'>Last Added Product's name</th>
            <th scope='col'>Last Product Adding Time</th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {products && products.length}
              </td>
              <td>
                {totalAmountOfProducts}
              </td>
              <td>
                {products[products.length - 1] && products[products.length - 1].name}
              </td>
              <td>
              {products[products.length - 1] && moment(products[products.length - 1].created_at).format('YYYY-MM-DD HH:mm:ss')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      <div className='jumbotron-fluid border border-black rounded my-3'>
        <h3>SALES</h3>
        <table className='table'>
          <thead>
          <tr>
            <th scope='col'>Number of sales</th>
            <th scope='col'>Total amount of sales</th>
            <th scope='col'>Last Sold Product's name</th>
            <th scope='col'>Last Sale Time</th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {sales && sales.length}
              </td>
              <td>
                {totalAmountOfSales && totalAmountOfSales}
              </td>
              <td>
                {soldProducts[soldProducts.length - 1] && soldProducts[soldProducts.length - 1].name}
              </td>
              <td>
                {sales[sales.length - 1] && moment(sales[sales.length - 1].created_at).format('YYYY-MM-DD HH:mm:ss')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      <div className='jumbotron-fluid border border-black rounded my-3'>
        <h3>PURCHASES</h3>
        <table className='table'>
          <thead>
          <tr>
            <th scope='col'>Number of purchases</th>
            <th scope='col'>Total amount of purchases</th>
            <th scope='col'>Last Purchased Product's name</th>
            <th scope='col'>Last Purchase Time</th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {purchases && purchases.length}
              </td>
              <td>
                {totalAmountOfPurchases && totalAmountOfPurchases}
              </td>
              <td>
                {purchasedProducts[purchasedProducts.length - 1] && purchasedProducts[purchasedProducts.length - 1].name}
              </td>
              <td>
                {purchases[purchases.length - 1] && moment(purchases[purchases.length - 1].created_at).format('YYYY-MM-DD HH:mm:ss')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Home;
