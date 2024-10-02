-- Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    original_price DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT,
    quantity INT DEFAULT 1, -- Default value is 1
    instagram_url VARCHAR(100), -- Optional field, limited to 100 characters
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Photos Table (Linked to products)
CREATE TABLE photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    file_name VARCHAR(255) NOT NULL, -- Name of the photo file
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Sales Table
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
