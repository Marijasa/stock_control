import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ProductService from '../../services/Product.service';
import useFormatCurrency from "../../useFormatCurrency";
import {useSelector} from "react-redux";

const ProductList = () => {

    const [products, setProducts] = useState([]);
    const [total_original, setTotalOriginal] = useState(0);
    const [total_price, setTotalPrice] = useState(0);

    const dollarPrice = useSelector(state => state.dollar.data);

    useEffect(() => {
        ProductService.getAllProducts()
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, []);

    useEffect(() => {
        let auxOriginal = 0;
        let auxPrice = 0;

        products.map((product) => {
            auxOriginal += Number(product.original_price);
            auxPrice += Number(product.price);
            return product;
        });

        setTotalOriginal(auxOriginal);
        setTotalPrice(auxPrice);

    }, [products, total_original, total_price]);

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Product List</h1>
            <div className="row mb-3">
                <h3 className={'col-3'}>Total Original Price Dolar: {useFormatCurrency(total_original, 'USD')}</h3>
                <h3 className={'col-3 border-end border-3'}>Total Original Price Colon: {useFormatCurrency(total_original * dollarPrice.venta, 'CRC')}</h3>

                <h3 className={'col-3'}>Total Price Dolar: {useFormatCurrency(total_price, 'USD')}</h3>
                <h3 className={'col-3'}>Total Price Colon: {useFormatCurrency(total_price * dollarPrice.venta, 'CRC')}</h3>
            </div>
            <Link to="/products/new" className="btn btn-primary mb-4">Add Product</Link>
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                <tr>
                    <th>Bar-code</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Original price</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.barcode || 'No available'}</td>
                        <td>{product.name}</td>
                        <td>{product.category_name}</td>
                        <td>${product.original_price}</td>
                        <td>${product.price}</td>
                        <td>{product.quantity}</td>
                        <td>
                            <Link to={`/products/${product.id}`} className="btn btn-info btn-sm me-2">View</Link>
                            <Link to={`/products/edit/${product.id}`}
                                  className="btn btn-warning btn-sm me-2">Edit</Link>
                            <Link to={`/products/delete/${product.id}`}
                                  className="btn btn-danger btn-sm me-2">Delete</Link>
                            <a className={'btn btn-secondary btn-sm ' + (product.instagram_url !== null ? '' : 'disabled')}
                               rel={'noreferrer'} target={'_blank'} href={product.instagram_url}>Instagram</a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
