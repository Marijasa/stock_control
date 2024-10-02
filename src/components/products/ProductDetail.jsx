import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductService from "../../services/Product.service";
import {config} from "../../config/config.config";

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        ProductService.getProductById(id)
            .then((response) => {
                setProduct(response.data);
                console.log(response.data)
            })
            .catch((error) => {
                console.error('Error fetching product:', error);
            });
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">{product.name}</h2>
            <div className="row">
                <div className="col-md-6">
                    <h4>Description</h4>
                    <p>{product.description || 'No description available.'}</p>
                    <h4>Original Price</h4>
                    <p className="text-success">${product.original_price}</p>
                    <h4>Sale Price</h4>
                    <p className="text-success">${product.price}</p>
                    <h4>Category</h4>
                    <p>{product.category_name || 'No category assigned.'}</p>
                    <h4>Quantity</h4>
                    <p>{product.quantity || 'Not available'}</p>
                </div>
            </div>
            <h4>Photos</h4>
            <div className="row">
                {product.photos.map(photo => (
                    <div className="col-md-3" key={photo.id}>
                        <img
                            src={config.apiBaseUrl + 'uploads/' + photo}
                            alt={photo}
                            className="img-thumbnail mb-2"
                        />
                    </div>
                ))}
            </div>
            <div className="mt-5">
                <Link to={`/products/edit/${product.id}`} className="btn btn-warning me-2">Edit</Link>
                <Link to={`/products`} className="btn btn-secondary">Product list</Link>
            </div>
        </div>
    );

    // return (
    //     <div>
    //         <h1>{product.name}</h1>
    //         <p>{product.description}</p>
    //         <p>Price: ${product.price}</p>
    //         <p>Original Price: ${product.original_price}</p>
    //         <p>Category: {product.category_id}</p>
    //         <p>Quantity: {product.quantity}</p>
    //         {product.instagram_url && <p><a href={product.instagram_url}>Instagram</a></p>}
    //         <h3>Photos:</h3>
    //         <ul>
    //             {product.photos.map((photo, index) => (
    //                 <li key={index}><img src={config.apiBaseUrl + 'uploads/' + photo} alt={photo} height={'150px'}/> </li>
    //             ))}
    //         </ul>
    //         <div className="mt-5">
    //             <Link to={`/products/edit/${product.id}`} className="btn btn-warning me-2">Edit</Link>
    //             <Link to={`/products`} className="btn btn-secondary">Product list</Link>
    //         </div>
    //     </div>
    // );
};

export default ProductDetail;
