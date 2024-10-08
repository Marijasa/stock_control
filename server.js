/**
 * Importing libraries
 */
const https = require('https');
const fs = require('fs');
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
    origin: 'https://emeybe.online', // Permitir solo localhost:3001
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
        name: 'Dollar Endpoint',
        path: './server/endpoints/dollar.endpoint',
        sub: 'dollar'
    },
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


// Cargar los archivos del certificado
const options = {
    key: fs.readFileSync('../ssl/keys/a90db_58a75_d6ca4debe2b2a3ff93806cb88823925e.key'),
    cert: fs.readFileSync('../ssl/certs/emeybe_online_a90db_58a75_1736112346_d690593e33ea4b38101e653c9f99b492.crt'),
};

// Servir la aplicación a través de HTTPS
https.createServer(options, app).listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




