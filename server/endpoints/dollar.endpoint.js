
const db = require('../class/database');

/**
 * This module exports return the already working app routes
 * using the parent "app" variable. The sub here works in case the parent
 * wants to modify the initial route
 *
 * @param app
 * @param sub
 */
module.exports = async function(app, sub = ''){
    // 1. Get dollar price
    app.get(sub, async (req, res) => {
        console.log('Getting dollar price');
        try {
            const products = await db('dollar')
                .select(
                    'dollar.*',
                );

            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
