

/**
 * This module exports return the already working app routes
 * using the parent "app" variable. The sub here works in case the parent
 * wants to modify the initial route
 *
 * @param app
 * @param sub
 */
const db = require('../class/database');
const multer = require('multer');
const fs = require("node:fs");

/**
 * This module exports the product CRUD endpoints.
 *
 * @param app
 * @param sub
 */
module.exports = function(app, sub = '') {

    // Configuración de multer
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'server/uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    });

    const upload = multer({ storage });

    // 1. Get all products
    // Get all products with their associated category
    app.get(sub, async (req, res) => {
        try {
            const products = await db('products')
                .leftJoin('categories', 'products.category_id', 'categories.id')
                .select(
                    'products.*',
                    'categories.name as category_name'
                );

            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });


    // 2. Get a product by ID (with associated photos)
    // Get a product by ID with associated category and photos
    app.get(sub + '/:id', async (req, res) => {
        const productId = req.params.id;

        try {
            // First query: Get product with its category
            const product = await db('products')
                .leftJoin('categories', 'products.category_id', 'categories.id')
                .select(
                    'products.*',
                    'categories.name as category_name'
                )
                .where('products.id', productId)
                .first();

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Second query: Get associated photos
            const photos = await db('photos')
                .select('file_name')
                .where('product_id', productId);

            // Add the photos to the product object
            product.photos = photos.map(photo => photo.file_name);

            // Return the product with its category and photos
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });


    // 3. Create a new product (and optionally add photos)
    app.post(sub, upload.array('photos'), async (req, res) => {
        const { barcode, name, description, original_price, price, quantity, category_id, instagram_url } = req.body;
        const photos = req.files; // Archivos subidos

        try {
            const [productId] = await db('products').insert({
                barcode,
                name,
                description,
                original_price,
                price,
                quantity,
                category_id,
                instagram_url
            });

            console.log('Product created',productId);
            console.log('complete req',req);

            // save photos
            if (photos.length > 0) {
                const photoPromises = photos.map(photo => {
                    return db('photos').insert({
                        product_id: productId,
                        file_name: photo.filename,
                    });
                });
                await Promise.all(photoPromises);
            }

            res.status(201).json({ message: 'Product created successfully', productId });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });


    // 4. Update a product (and optionally update photos)
    app.put(sub + '/:id', upload.array('photos'), async (req, res) => {
        const productId = req.params.id;
        const { barcode, name, description, original_price, price, category_id, quantity, instagram_url } = req.body;
        const photos = req.files;

        try {
            const updatedRows = await db('products')
                .where({ id: productId })
                .update({
                    barcode,
                    name,
                    description,
                    original_price,
                    price,
                    category_id,
                    quantity,
                    instagram_url
                });

            if (updatedRows === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            if (photos.length > 0) {
                const photoPromises = photos.map(photo => {
                    return db('photos').insert({
                        product_id: productId,
                        file_name: photo.filename,
                    });
                });
                await Promise.all(photoPromises);
            }

            res.json({ message: 'Product updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    // 5. Delete a product (and its photos)
    app.delete(sub + '/:id', async (req, res) => {
        const productId = req.params.id;

        try {
            // Get associated photos
            const photos = await db('photos')
                .select('file_name')
                .where('product_id', productId);

            const photoPaths = photos.map(photo => {
                return photo.file_name;
            });

            // delete files from uploads folder
            photoPaths.forEach(photoPath => {
                fs.unlink('server/uploads/' + photoPath, (err) => {
                    if (err) {
                        console.error(`Error deleting photo: ${photoPath}`, err);
                    } else {
                        console.log(`Successfully deleted photo: ${photoPath}`);
                    }
                });
            });

            // Delete associated photos first
            await db('photos').where({ product_id: productId }).del();

            // Delete the product
            const deletedRows = await db('products').where({ id: productId }).del();

            if (deletedRows === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json({ message: 'Product and associated photos deleted successfully' });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

};
