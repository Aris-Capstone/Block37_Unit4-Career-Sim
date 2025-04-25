const pg = require('pg');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/backend_product_store_db');

const createTables = async () => {
    const SQL = `
        DROP TABLE IF EXISTS user_products;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS products;

        CREATE TABLE products(
            id UUID PRIMARY KEY, 
            name VARCHAR(255) NOT NULL UNIQUE,
            description VARCHAR(255) NOT NULL,
            image_url VARCHAR(255) NOT NULL,
            price FLOAT NOT NULL
        );

        CREATE TABLE users(
            id UUID PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            is_admin BOOLEAN NOT NULL DEFAULT FALSE,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255),
            mailing_address VARCHAR(255) NOT NULL,
            phone VARCHAR(255),
            billing_address VARCHAR(255)
        );

        CREATE TABLE user_products(
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id) NOT NULL,
            product_id UUID REFERENCES products(id) NOT NULL,
            quantity INTEGER NOT NULL,
            CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
        );
    `;

    await client.query(SQL);
};

const createUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await client.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
        res.status(201).json(user.rows[0]);
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const { name, description, image_url, price } = req.body;
        const product = await client.query('INSERT INTO products (name, description, image_url, price) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, image_url, price]);
        res.status(201).json(product.rows[0]);
    } catch (error) {
        next(error);
    }
};

const createUserCart = async (req, res, next) => {
    try {
        const { user_id, product_id, quantity } = req.body;
        const userProduct = await client.query('INSERT INTO user_products (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [user_id, product_id, quantity]);
        res.status(201).json(userProduct.rows[0]);
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const products = await client.query('SELECT * FROM products');
        res.status(200).json(products.rows);
    } catch (error) {
        next(error);
    }
};

const getUserCart = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const userProducts = await client.query('SELECT * FROM user_products WHERE user_id = $1', [user_id]);
        res.status(200).json(userProducts.rows);
    } catch (error) {
        next(error);
    }
};


const updateUserCart = async (req, res, next) => {
    try {
        const { user_id, product_id } = req.params;
        const { quantity } = req.body;
        const userProduct = await client.query('UPDATE user_products SET quantity = $1 WHERE user_id = $2 AND product_id = $3', [quantity, user_id, product_id]);
        res.status(200).json(userProduct.rows[0]);
    } catch (error) {
        next(error);
    }
};

const deleteUserCart = async (req, res, next) => {
    try {
        const { user_id, product_id } = req.params;
        const userProduct = await client.query('DELETE FROM user_products WHERE user_id = $1 AND product_id = $2', [user_id, product_id]);
        res.status(200).json(userProduct.rows[0]);
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const user = await client.query('SELECT * FROM users WHERE id = $1', [user_id]);
        res.status(200).json(user.rows[0]);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    createUserCart,
    getProducts,
    getUserCart,
    updateUserCart,
    deleteUserCart,
    getUser
};