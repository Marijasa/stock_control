import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductService from "../../services/Product.service";

const ProductDelete = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = () => {
        ProductService.deleteProduct(id)
            .then(() => navigate('/products'))
            .catch((error) => console.error('Error deleting product:', error));
    };

    return (
        <div>
            <h1>Are you sure you want to delete this product?</h1>
            <button onClick={handleDelete} className="btn btn-danger">Delete</button>
            <button onClick={() => navigate('/products')} className="btn btn-secondary">Cancel</button>
        </div>
    );
};

export default ProductDelete;
