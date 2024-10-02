const db = require('../class/database');

/**
 * This module exports return the already working app routes
 * using the parent "app" variable. The sub here works in case the parent
 * wants to modify the initial route
 *
 * @param app
 * @param sub
 */
module.exports = function(app, sub = '') {
    // Basic route to check endpoint status
    app.get(sub + '/status', (req, res) => {
        res.send('Category endpoint is working!');
    });

    // 1. Get all categories
    app.get(sub, async (req, res) => {
        try {
            const categories = await db.select('*').from('categories');
            res.json(categories);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // 2. Get a category by ID
    app.get(sub + '/:id', async (req, res) => {
        const categoryId = req.params.id;
        try {
            const category = await db('categories').where({ id: categoryId }).first();
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json(category);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // 3. Create a new category
    app.post(sub, async (req, res) => {
        const categoryName = req.body.name;

        if (!categoryName) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        try {
            const [id] = await db('categories').insert({ name: categoryName });
            res.status(201).json({ id, name: categoryName });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // 4. Update a category
    app.put(sub + '/:id', async (req, res) => {
        const categoryName = req.body.name;
        const categoryId = req.params.id;

        if (!categoryName) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        try {
            const updatedRows = await db('categories').where({ id: categoryId }).update({ name: categoryName });
            if (updatedRows === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({ message: 'Category updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // 5. Delete a category
    app.delete(sub + '/:id', async (req, res) => {
        const categoryId = req.params.id;

        try {
            const deletedRows = await db('categories').where({ id: categoryId }).del();
            if (deletedRows === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({ message: 'Category deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};
