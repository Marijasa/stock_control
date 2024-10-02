/**
 * This module exports return the already working app routes
 * using the parent "app" variable. The sub here works in case the parent
 * wants to modify the initial route
 *
 * @param app
 * @param sub
 */
module.exports = async function(app, sub = ''){
    // Basic route to check server status
    app.get(sub + '/', (req, res) => {
        res.send('Server is running!');
    });
}
