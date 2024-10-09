import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {useSelector} from "react-redux";
import {Link,useNavigate} from 'react-router-dom';

import MyDataTable from "../generic/MyDataTable";

import ProductService from '../../services/Product.service';
import useFormatCurrency from "../../useFormatCurrency";

const ProductList = () => {

    const [products, setProducts] = useState([]);
    const [total_original, setTotalOriginal] = useState(0);
    const [total_price, setTotalPrice] = useState(0);

    const dollarPrice = useSelector(state => state.dollar.data);
    const columns = [
        {
            title: 'Bar-code',
            data: 'barcode',
            render: function (data, type, row) {
                return row.barcode ? row.barcode :'No available';
            },
        },
        {
            title: 'Name',
            data: 'name'
        },
        {
            title: 'Category',
            data: 'category_name'
        },
        {
            title: 'Original price',
            data: 'original_price'
        },
        {
            title: 'Price',
            data: 'price'
        },
        {
            title: 'Quantity',
            data: 'quantity'
        },
        {
            title: 'Actions',
            className: 'action-button',
            width: '300px',
            data: null
        }
    ];

    const navigate = useNavigate();

    const options = {
        drawCallback: (settings) => {
            const rows = settings.api.rows();
            const nodes = rows.nodes().toArray();
            const data = rows.data().toArray();

            nodes.forEach((node, index) => {
                const rowData = data[index];
                console.log('---------- draw node')
                const productId = rowData.id;
                const instagram_url = rowData.instagram_url;

                // Admin Button
                const actionButtonContainer = node.querySelector('.action-button');

                if (actionButtonContainer) {

                    const root = createRoot(actionButtonContainer);
                    root.render(
                        <>
                            <button onClick={() => navigate(`/products/${productId}`)} className="btn btn-info btn-sm me-2">View</button>
                            <button onClick={() => navigate(`/products/edit/${productId}`)} className="btn btn-warning btn-sm me-2">Edit</button>
                            <button onClick={() => navigate(`/products/delete/${productId}`)} className="btn btn-danger btn-sm me-2">Delete</button>
                            <a className={'btn btn-secondary btn-sm ' + (instagram_url !== null ? '' : 'disabled')}
                               rel={'noreferrer'} target={'_blank'} href={instagram_url}>Instagram</a>
                        </>
                    );
                }
            });
        }
    }

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
            <Link to="/products/new" className="btn btn-primary mb-4">Add Product</Link>
            <div className="row mb-3">
                <div className={'col-lg-6 col-sm-12 border'}>
                    <h3>Total Original Price Dolar: {useFormatCurrency(total_original, 'USD')}</h3>
                    <h3>Total Original Price Colon: {useFormatCurrency(total_original * dollarPrice.venta, 'CRC')}</h3>
                </div>

                <div className={'col-lg-6 col-sm-12 border'}>
                    <h3>Total Price Dolar: {useFormatCurrency(total_price, 'USD')}</h3>
                    <h3>Total Price Colon: {useFormatCurrency(total_price * dollarPrice.venta, 'CRC')}</h3>
                </div>
            </div>
            <MyDataTable columns={columns} options={options} data={products} className="table table-primary table-striped table-hover" />
        </div>
    );
};

export default ProductList;
