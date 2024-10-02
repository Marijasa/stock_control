import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import ProductService from '../../services/Product.service';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        ProductService.getAllProducts()
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Product List</h1>
            <Link to="/products/new" className="btn btn-primary mb-4">Add Product</Link>
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.category_id}</td>
                        <td>
                            <Link to={`/products/${product.id}`} className="btn btn-info btn-sm me-2">View</Link>
                            <Link to={`/products/edit/${product.id}`}
                                  className="btn btn-warning btn-sm me-2">Edit</Link>
                            <Link to={`/products/delete/${product.id}`} className="btn btn-danger btn-sm">Delete</Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
