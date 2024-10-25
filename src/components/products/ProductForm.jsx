import React, { useState, useEffect } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import ProductService from '../../services/Product.service';
import CategoryService from '../../services/Category.service';
import {useSelector} from "react-redux";
import useFormatCurrency from "../../hooks/useFormatCurrency";
import {BarcodeScanner} from "./BarcodeScanner";


const ProductForm = () => {

    const dollarPrice = useSelector(state => state.dollar.data);

    const [product, setProduct] = useState({
        barcode: null,
        name: '',
        description: '',
        original_price: '',
        original_price_dollar: '',
        original_price_colon: '',
        price: 0,
        price_dollar: '',
        price_colon: '',
        category_id: '',
        quantity: 1,
        instagram_url: null,
        photos: [],
    });
    const [categories, setCategories] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            ProductService.getProductById(id)
                .then((response) => {
                    const data = response.data;
                    const original_price = Number(data.original_price);
                    data.original_price_dollar = original_price;
                    data.original_price_colon = (original_price * dollarPrice.venta).toFixed(0);

                    const price = Number(data.price);
                    data.price_dollar = price;
                    data.price_colon = (price * dollarPrice.venta).toFixed(0);
                    console.log('product data', data);
                    setProduct(data);
                })
                .catch((error) => {
                    console.error('Error fetching product:', error);
                });
        }
    }, [id, dollarPrice]);

    useEffect(() => {
        CategoryService.getAllCategories()
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { value, files } = e.target;
        let { name } = e.target;

        if (name !== 'photos' && !name.includes('price')) {
            setProduct({...product, [name]: value});
        } else if(name === 'photos') {
            setProduct({ ...product, photos: files });
        }

        // set the currency
        if (name.includes('dollar')) {
            name = name.replace("_dollar", "");
            const inColon = (value * dollarPrice.venta).toFixed(0);
            setProduct({...product, [name+'_dollar']: value, [name+'_colon']: inColon});

        } else if (name.includes('colon')) {
            name = name.replace("_colon", "");
            const inDollar = (value / dollarPrice.venta).toFixed(2);
            setProduct({...product, [name+'_colon']: value, [name+'_dollar']: inDollar});

        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // use formData to send files
        const data = new FormData();

        // set the product data
        for (const key in product) {
            if (key !== 'photos' && !key.includes('price')) {
                if(product[key] !== null && product[key] !== '') {
                    data.append(key, product[key]);
                }

            } else if(key === 'original_price') {
                data.append('original_price', product.original_price_dollar);

            } else if(key === 'price') {
                data.append('price', product.price_dollar);

            } else if(key === 'photos') {
                for (const file of product.photos) {
                    data.append('photos', file); // append each file to the form data
                }
            }
        }

        console.log('data to send', data);

        if (id) {
            ProductService.updateProduct(id, data)
                .then(() => navigate('/products'))
                .catch((error) => console.error('Error updating product:', error));
        } else {
            ProductService.createProduct(data)
                .then(() => navigate('/products'))
                .catch((error) => console.error('Error creating product:', error));
        }
    };

    const selectedCode = (code) => {
        setProduct({...product, barcode: code});
    }

    return (
        <div className="container mt-5">
            <h1>{id ? 'Edit Product' : 'Add Product'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className={'form-label'}>Bar-code</label>
                    <BarcodeScanner onSelectedCode={selectedCode}/>
                    <input
                        type="text"
                        name="barcode"
                        className="form-control"
                        value={product.barcode}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group required">
                    <label className={'form-label'}>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={product.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className={'form-label'}>Description</label>
                    <textarea
                        name="description"
                        className="form-control"
                        value={product.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>

                <div className="form-group required">
                    <label className={'form-label'}>Original Price</label>
                    <div className="d-flex">
                        <div className="form-group required col-6 pe-2">
                            <label className={'form-label'}>Dollar</label>
                            <input
                                type="number"
                                name="original_price_dollar"
                                className="form-control"
                                value={product.original_price_dollar}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group required col-6 ps-2">
                            <label className={'form-label'}>Colon</label>
                            <input
                                type="number"
                                name="original_price_colon"
                                className="form-control"
                                value={product.original_price_colon}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group required">
                    <label className={'form-label'}>Price</label>
                    <div className="d-flex">
                        <div className="form-group required col-6 pe-2">
                            <label className={'form-label'}>Dollar</label>
                            <input
                                type="number"
                                name="price_dollar"
                                className="form-control"
                                value={product.price_dollar}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group required col-6 ps-2">
                            <label className={'form-label'}>Colon</label>
                            <input
                                type="number"
                                name="price_colon"
                                className="form-control"
                                value={product.price_colon}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group required">
                    <label className={'form-label'}>Category select</label>
                    <select
                        name='category_id'
                        className='form-control'
                        onChange={handleInputChange}
                        required
                    >
                        <option value=''>Select a category</option>
                        {
                            categories.map((category) => (
                                <option key={category.id} value={category.id}
                                        selected={category.id === product.category_id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <div className="form-group">
                    <label className={'form-label'}>Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        className="form-control"
                        value={product.quantity}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label className={'form-label'}>Instagram URL</label>
                    <input
                        type="text"
                        name="instagram_url"
                        className="form-control"
                        value={product.instagram_url}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label className={'form-label'} htmlFor="photos">Photos</label>
                    <input
                        type="file"
                        id="photos"
                        name="photos"
                        className="form-control"
                        onChange={handleInputChange}
                        multiple
                        accept="image/*" // Aceptar solo imágenes
                    />
                </div>

                <div className="mt-5">
                    <button type="submit" className="btn btn-primary me-3">
                        {id ? 'Update Product' : 'Create Product'}
                    </button>
                    <Link to={`/products`} className="btn btn-secondary">Product list</Link>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
