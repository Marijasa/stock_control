/**
 * Importing libraries
 */
const express = require('express');
const path = require('path');
const cors = require('cors'); // Import cors

/**
 * Importing the configuration
 */
const config = require('./server/config/config');

/**
 * Initializing the express app
 */

const app = express();
const port = config.port || 3000;

/**
 * Middleware to parse the request body
 */
app.use(express.json());

/**
 * Middleware to enable CORS
 */
app.use(cors({
    origin: 'http://localhost:3001', // Permitir solo localhost:3001
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: false // Si necesitas enviar cookies u otras credenciales
}));

/**
 * Middleware to serve static files
 */
app.use('/uploads', express.static(path.join(__dirname, 'server/uploads')));


/**
 * API Routes
 *
 * This is where all the routes are defined
 */
console.log('Getting Endpoint Routes');
const routes = [
    {
        name: 'Status Endpoint',
        path: './server/endpoints/status.endpoint',
        sub: 'status'
    },
    {
        name: 'Categories Endpoint',
        path: './server/endpoints/category.endpoint',
        sub: 'category'
    },
    {
        name: 'Products Endpoint',
        path: './server/endpoints/product.endpoint',
        sub: 'product'
    },
];



console.log('Setting up each Endpoint Route.');
console.log('Total Endpoints: ' + routes.length);
routes.forEach(route => {
    console.log('[ENDPOINT] Setting up endpoint: ' + route.name);
    const endpoint = require(route.path);
    endpoint(app, `/${route.sub}`);
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
