import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductService from '../../services/Product.service';

const ProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        original_price: '',
        price: '',
        category_id: '',
        quantity: 1,
        instagram_url: '',
        photos: [],
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            ProductService.updateProduct(id, product)
                .then(() => navigate('/products'))
                .catch((error) => console.error('Error updating product:', error));
        } else {
            ProductService.createProduct(product)
                .then(() => navigate('/products'))
                .catch((error) => console.error('Error creating product:', error));
        }
    };

    return (
        <div className="container mt-5">
            <h1>{id ? 'Edit Product' : 'Add Product'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name</label>
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
                    <label>Description</label>
                    <textarea
                        name="description"
                        className="form-control"
                        value={product.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Original Price</label>
                    <input
                        type="number"
                        name="original_price"
                        className="form-control"
                        value={product.original_price}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price</label>
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
                    <label>Category</label>
                    <input
                        type="number"
                        name="category_id"
                        className="form-control"
                        value={product.category_id}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        className="form-control"
                        value={product.quantity}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Instagram URL</label>
                    <input
                        type="text"
                        name="instagram_url"
                        className="form-control"
                        value={product.instagram_url}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    {id ? 'Update Product' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
