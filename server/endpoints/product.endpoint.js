/**
 * This module exports return the already working app routes
 * using the parent "app" variable. The sub here works in case the parent
 * wants to modify the initial route
 *
 * @param app
 * @param sub
 */
const db = require('../class/database');

/**
 * This module exports the product CRUD endpoints.
 *
 * @param app
 * @param sub
 */
module.exports = function(app, sub = '') {

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
    app.post(sub, async (req, res) => {
        const { name, description, original_price, price, category_id, quantity, instagram_url, photos } = req.body;

        try {
            const [productId] = await db('products').insert({
                name,
                description,
                original_price,
                price,
                category_id,
                quantity,
                instagram_url
            });

            if (photos && photos.length > 0) {
                const photoInserts = photos.map(photo => ({ product_id: productId, file_name: photo }));
                await db('photos').insert(photoInserts);
            }

            res.status(201).json({ id: productId, message: 'Product created successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // 4. Update a product (and optionally update photos)
    app.put(sub + '/:id', async (req, res) => {
        const productId = req.params.id;
        const { name, description, original_price, price, category_id, quantity, instagram_url, photos } = req.body;

        try {
            const updatedRows = await db('products')
                .where({ id: productId })
                .update({
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

            if (photos && photos.length > 0) {
                // Remove existing photos
                await db('photos').where({ product_id: productId }).del();

                // Insert new photos
                const photoInserts = photos.map(photo => ({ product_id: productId, file_name: photo }));
                await db('photos').insert(photoInserts);
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
