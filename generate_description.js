const db = require("../class/database");
try {
    const products = await db('products')
        .leftJoin('categories', 'products.category_id', 'categories.id')
        .select(
            'products.*',
            'categories.name as category_name'
        );

    products.forEach(product => {
        if(product.instagram_url === null || product.instagram_url === '') {
            const price = new Intl.NumberFormat('es-CR', {
                style: 'currency',
                currency: 'CRC',
                minimumFractionDigits: 0
            }).format(product.price);

            let newDesc = `no.${product.id} \n${product.name} \n${price}`;

            const updatedRows = db('products')
                .where({ id: product.id })
                .update({ description: newDesc });

        }
    });

} catch (error) {
    console.error('Error in get all products', error.message)
}
