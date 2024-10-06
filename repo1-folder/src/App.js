import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Products from './components/Products';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import EditProduct from './components/EditProduct';
import AddProduct from './components/AddProduct';
import Sales from './components/Sales';
import AddSale from './components/AddSale';
import EditSale from './components/EditSale';
import Purchases from './components/Purchases';
import AddPurchase from './components/AddPurchase';
import EditPurchase from './components/EditPurchase';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listproducts"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editproduct"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addproduct"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listsales"
            element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addsale"
            element={
              <ProtectedRoute>
                <AddSale />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editsale"
            element={
              <ProtectedRoute>
                <EditSale />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listpurchases"
            element={
              <ProtectedRoute>
                <Purchases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addpurchase"
            element={
              <ProtectedRoute>
                <AddPurchase />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editpurchase"
            element={
              <ProtectedRoute>
                <EditPurchase />
              </ProtectedRoute>
            }
          />          
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
