import axios from 'axios';

const API_URL = 'http://localhost:3000/product'; // Base URL for the API

class ProductService {
    // Get all products
    static getAllProducts() {
        return axios.get(API_URL);
    }

    // Get a product by ID
    static getProductById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    // Create a new product
    static createProduct(product) {
        return axios.post(API_URL, product);
    }

    // Update an existing product
    static updateProduct(id, product) {
        return axios.put(`${API_URL}/${id}`, product);
    }

    // Delete a product by ID
    static deleteProduct(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
}

export default ProductService;
