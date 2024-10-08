import React, { useState, useEffect } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import ProductService from '../../services/Product.service';
import CategoryService from '../../services/Category.service';
import {useSelector} from "react-redux";
import useFormatCurrency from "../../useFormatCurrency";
import {BarcodeScanner} from "./BarcodeScanner";


const ProductForm = () => {

    const dollarPrice = useSelector(state => state.dollar.data);

    const [product, setProduct] = useState({
        barcode: '',
        name: '',
        description: '',
        original_price: '',
        price: 0,
        category_id: '',
        quantity: 1,
        instagram_url: '',
        photos: [],
    });
    const [categories, setCategories] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            ProductService.getProductById(id)
                .then((response) => {
                    setProduct(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching product:', error);
                });
        }
    }, [id]);

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
        const { name, value, files } = e.target;
        if (name === 'photos') {
            setProduct({ ...product, photos: files });
        } else {
            setProduct({...product, [name]: value});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // use formData to send files
        const data = new FormData();

        // set the product data
        for (const key in product) {
            if (key !== 'photos') {
                data.append(key, product[key]);
            } else {
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
                    <BarcodeScanner onSelectedCode={selectedCode} />
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
                    <br/>
                    <label>Price in Colones: {useFormatCurrency(product.original_price * dollarPrice.venta, 'CRC')}</label>
                    <input
                        type="number"
                        name="original_price"
                        className="form-control"
                        value={product.original_price}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group required">
                    <label className={'form-label'}>Price</label>
                    <br/>
                    <label>Price in
                        Colones: {useFormatCurrency(product.price * dollarPrice.venta, 'CRC')}</label>
                    <input
                        type="number"
                        name="price"
                        className="form-control"
                        value={product.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className={'form-label'}>Category select</label>
                    <select
                        name='category_id'
                        className='form-control'
                        onChange={handleInputChange}
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
