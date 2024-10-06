import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <Link className="navbar-brand" to={user ? '/' : '/login'}>Rust Course Final Assessment</Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">

      
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Products
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <Link className="dropdown-item" to='/listproducts'>List Products</Link>
          <Link className="dropdown-item" to='/editproduct'>Edit Product</Link>
          <Link className='dropdown-item' to='/addproduct'>Add Product</Link>
        </div>
      </li>

      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Sales
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <Link className="dropdown-item" to='/listsales'>List Sales</Link>
          <Link className="dropdown-item" to='/addsale'>Add Sale</Link>
          <Link className="dropdown-item" to='/editsale'>Edit Sale</Link>
        </div>
      </li>

      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Purchases
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <Link className="dropdown-item" to='/listpurchases'>List Purchases</Link>
          <Link className="dropdown-item" to='/addpurchase'>Add Purchase</Link>
          <Link className="dropdown-item" to='/editpurchase'>Edit Purchase</Link>
        </div>
      </li>


      <li className="nav-item">
        <Link className="nav-link" onClick={() => logout()}>Logout</Link>
      </li>      
    </ul>
  </div>
</nav>
    </>
  );
};

export default Navbar;
