import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL + 'dollar'; // Base URL for the API

class DollarService {
    static getDollarPrice() {
        return axios.get(API_URL);
    }
}

export default DollarService;
