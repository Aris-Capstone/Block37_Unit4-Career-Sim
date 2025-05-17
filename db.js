const pg = require('pg');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';

const connectionString = process.env.DATABASE_URL || 'postgres://localhost/backend_product_store_db'

const client = new pg.Client({
    connectionString,
    ssl:
        process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : undefined,
});

const createTables = async () => {
    const SQL = `
        DROP TABLE IF EXISTS user_cart;
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
            is_admin BOOLEAN DEFAULT FALSE,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255),
            mailing_address VARCHAR(255) NOT NULL,
            phone VARCHAR(255),
            billing_address VARCHAR(255)
        );

        CREATE TABLE user_cart(
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id) NOT NULL,
            product_id UUID REFERENCES products(id) NOT NULL,
            quantity INTEGER NOT NULL,
            CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
        );
    `;

    await client.query(SQL);
};

//create functions
const createUser = async (username, password, name, mailing_address, is_admin = false) => {
    const SQL = `INSERT INTO users(id, username, password, name, mailing_address, is_admin) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`;

    const response = await client.query(SQL, [
        uuid.v4(),
        username,
        await bcrypt.hash(password, 5),
        name,
        mailing_address,
        is_admin
    ]);

    return response.rows[0];
};

const createProduct = async (name, description, image_url, price) => {
    const SQL = `INSERT INTO products(id, name, description, image_url, price) VALUES($1, $2, $3, $4, $5) RETURNING *;`;

    const response = await client.query(SQL, [
        uuid.v4(),
        name,
        description,
        image_url,
        price
    ]);

    return response.rows[0];
};

const createUserCart = async (user_id, product_id, quantity) => {
    const SQL = `INSERT INTO user_cart(id, user_id, product_id, quantity) VALUES($1, $2, $3, $4) RETURNING *;`;

    const response = await client.query(SQL, [
        uuid.v4(),
        user_id,
        product_id,
        quantity
    ]);

    return response.rows[0];
};

//fetch functions
const fetchProduct = async (product_id) => {
    const SQL = `SELECT * FROM products WHERE id = $1;`;
    const response = await client.query(SQL, [product_id]);
    return response.rows[0];
};

const fetchProducts = async () => {
    const SQL = `SELECT * FROM products;`;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchUserCart = async (user_id) => {
    const SQL = `SELECT * FROM user_cart WHERE user_id = $1;`;
    const response = await client.query(SQL, [user_id]);
    return response.rows;
};

const fetchUser = async (user_id) => {
    const SQL = `SELECT * FROM users WHERE id = $1;`;
    const response = await client.query(SQL, [user_id]);
    return response.rows[0];
};

const fetchUsers = async () => {
    const SQL = `SELECT * FROM users;`;
    const response = await client.query(SQL);
    return response.rows;
};

//update and delete functions

const updateUserCart = async (user_id, product_id, { quantity }) => {
    const SQL = `UPDATE user_cart SET quantity = $1 
                 WHERE user_id = $2 AND product_id = $3 
                 RETURNING *;`;
    const response = await client.query(SQL, [quantity, user_id, product_id]);
    return response.rows[0];
};

const deleteUserCart = async (user_id, product_id) => {
    const SQL = `DELETE FROM user_cart 
                 WHERE user_id = $1 AND product_id = $2 
                 RETURNING *;`;
    await client.query(SQL, [user_id, product_id]);
};

//authentication uodated- need to verify  

const authenticate = async ({ username, password }) => {
    const SQL = `
      SELECT *FROM users WHERE username=$1;
    `;
    const response = await client.query(SQL, [username]);
    if (
        !response.rows.length ||
        (await bcrypt.compare(password, response.rows[0].password)) === false
    ) {
        const error = Error('not authorized');
        error.status = 401;
        throw error;
    }
    const token = await jwt.sign({ id: response.rows[0].id }, JWT);
    return { token, user: response.rows[0] };
};

//findUserWithToken updated- need to verify
const findUserWithToken = async (token) => {
    const SQL = `
      SELECT id, username FROM users WHERE id=$1;
    `;
    const { id } = jwt.verify(token, JWT);
    const response = await client.query(SQL, [id]);
    if (!response.rows.length) {
        const error = Error('not authorized');
        error.status = 401;
        throw error;
    }
    return response.rows[0];
};


module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    createUserCart,
    fetchProducts,
    fetchUserCart,
    fetchProduct,
    updateUserCart,
    deleteUserCart,
    authenticate,
    findUserWithToken,
    fetchUser,
    fetchUsers
};