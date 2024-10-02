import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductService from "../../services/Product.service";

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
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Original Price: ${product.original_price}</p>
            <p>Category: {product.category_id}</p>
            <p>Quantity: {product.quantity}</p>
            {product.instagram_url && <p><a href={product.instagram_url}>Instagram</a></p>}
            <h3>Photos:</h3>
            <ul>
                {product.photos.map((photo, index) => (
                    <li key={index}>{photo}</li>
                ))}
            </ul>
            <Link to={`/products/edit/${product.id}`} className="btn btn-warning">Edit</Link>
        </div>
    );
};

export default ProductDetail;
