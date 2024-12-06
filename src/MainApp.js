import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';  // Import your updated CSS
import { database } from './Firebaseconfig';  

import { ref, onValue } from "firebase/database";
// Main App component
const MainApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Track the logged-in user
  const [users, setUsers] = useState([]); // Array to store users
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: ''
  });

  // User Login / Register Logic
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user); // Set the logged-in user
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null); // Clear the logged-in user
  };

  return (
    <Router>
      <div className="container">
        <h1>MEL WINGS CAFE</h1>
        <h5>BEST IN TOWN</h5>
        {isLoggedIn ? (
          <div>
            <nav>
              <Link to="/product-list">Product List</Link> | 
              <Link to="/add-product">Add Product</Link> |
              <Link to="/manage-users">Manage Users</Link> | 
              <button onClick={handleLogout}>Logout</button>
            </nav>

            <Routes>
              <Route
                path="/product-list"
                element={<ProductList products={products} setProducts={setProducts} />}
              />
              <Route
                path="/add-product"
                element={<ProductManagement
                  products={products}
                  setProducts={setProducts}
                  newProduct={newProduct}
                  setNewProduct={setNewProduct}
                />}
              />
              <Route
                path="/manage-users"
                element={<UserManagement users={users} />}
              />
            </Routes>
          </div>
        ) : (
          <UserAuth onLogin={handleLogin} users={users} setUsers={setUsers} />
        )}
      </div>
    </Router>
  );
};

// UserAuth Component (Handles both login and register)
const UserAuth = ({ onLogin, users, setUsers }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
      onLogin(user); // Pass the logged-in user to the parent component
    } else {
      setError('Invalid username or password');
    }
  };

  const handleRegister = () => {
    if (username.trim() && password.trim()) {
      setUsers([...users, { username, password }]);
      setUsername('');
      setPassword('');
      alert('Registration successful! You can now log in.');
      setIsRegistering(false); // Switch back to login form
    } else {
      alert('Please fill out both fields');
    }
  };

  return (
    <div id="user-management">
      <h2>{isRegistering ? 'Register' : 'User Login'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={isRegistering ? handleRegister : handleLogin}>
        {isRegistering ? 'Register' : 'Login'}
      </button>
      <br />
      <span>
        {isRegistering ? (
          <p>
            Already have an account?{' '}
            <button onClick={() => setIsRegistering(false)}>Login</button>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <button onClick={() => setIsRegistering(true)}>Register</button>
          </p>
        )}
      </span>
    </div>
  );
};

// Product Management Component (Add product page)
const ProductManagement = ({ products, setProducts, newProduct, setNewProduct }) => {
  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.id]: e.target.value });
  };

  const addProduct = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.description && newProduct.category && newProduct.price && newProduct.quantity) {
      setProducts([...products, newProduct]);
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: ''
      });
    } else {
      alert('Please fill out all fields');
    }
  };

  return (
    <div id="product-management">
      <h2>Add Product</h2>
      <form id="product-form" onSubmit={addProduct}>
        <input
          type="text"
          id="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          id="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          id="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          id="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleChange}
          required
          step="0.01"
        />
        <input
          type="number"
          id="quantity"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

// Product List Component (Page to View Products)
const ProductList = ({ products, setProducts }) => {
  const deleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // stop it from selling
  const sellProduct = (index) => {
    const updatedProducts = [...products];
    const product = updatedProducts[index];
    if (product.quantity > 0) {
      product.quantity -= 1; 
      setProducts(updatedProducts);
    } else {
      alert('This product is out of stock!');
    }
  };
  // stop it from selling

  return (
    <div id="product-table">
      <h2>Product List</h2>
      {products.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>{`M${product.price}`}</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => deleteProduct(index)}>Delete</button>
                  <button onClick={() => sellProduct(index)}>Sell</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products added yet.</p>
      )}
    </div>
  );
};

// User Management Component (View all users)
const UserManagement = ({ users }) => {
  return (
    <div id="user-list">
      <h2>Manage Users</h2>
      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users registered yet.</p>
      )}
    </div>
  );
};

export default MainApp;
