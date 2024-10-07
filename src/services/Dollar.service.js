import axios from 'axios';
import {config} from "../config/config.config";

const API_URL = config.apiBaseUrl + 'dollar'; // Base URL for the API

class DollarService {
    static getDollarPrice() {
        return axios.get(API_URL);
    }
}

export default DollarService;
