import axios from 'axios';
import {config} from "../config/config.config";

const API_URL = config.apiBaseUrl + 'category'; // Base URL for the API

class CategoryService {
    // Get all categories
    static getAllCategories() {
        return axios.get(API_URL);
    }

    // Get a category by ID
    static getCategoryById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    // Create a new category
    static createCategory(category) {
        return axios.post(API_URL, category);
    }

    // Update an existing category
    static updateCategory(id, category) {
        return axios.put(`${API_URL}/${id}`, category);
    }

    // Delete a category by ID
    static deleteCategory(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
}

export default CategoryService;
