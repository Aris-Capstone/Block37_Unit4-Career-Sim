const {
    client,
    createTables,
    createUser,
    createProduct,
    createUserCart,
    fetchProduct,
    fetchProducts,
    fetchUserCart,
    updateUserCart,
    deleteUserCart,
    authenticate,
    findUserWithToken,
    fetchUser,
    fetchUsers
} = require('./db');

const bcrypt = require('bcryptjs');

const cors = require("cors");
const morgan = require('morgan');
const express = require('express');
const jwt = require('jsonwebtoken');

const server = express();
client.connect();

server.use(cors());
server.use(express.json());
server.use(morgan('dev'));

//for deployment only
const path = require('path');
server.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));

server.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server is running on port ${port}`));


// isLoggedIn function udpated- need to verify 
const JWT = process.env.JWT || 'shhh';

const isLoggedIn = async (req, res, next) => {
    try {
        req.user = await findUserWithToken(req.headers.authorization);
        next();
    } catch (err) {
        next(err);
    }
};

// Public routes (no auth required)
server.get('/api/products', async (req, res, next) => {
    try {
        res.send(await fetchProducts());
    } catch (err) {
        next(err);
    }
});

//this endpoint had to be updated with the const. will need to make sure the rest of the post endpoints are updated also
server.post('/api/users', async (req, res, next) => {
    const { username, password, name, mailing_address } = req.body;
    try {
        res.send(await createUser(username, password, name, mailing_address));
    } catch (err) {
        next(err);
    }
});

server.get('/api/products/:product_id', async (req, res, next) => {
    try {
        res.send(await fetchProduct(req.params.product_id));
    } catch (err) {
        next(err);
    }
});


// authenticate endpoint created- need to verify
server.post('/api/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            next({
                name: "Missing credentials",
                message: "Please provide a username and password",
            });
            return;
        }
        const user = await authenticate({ username, password });
        if (!user) {
            next({
                name: "Invalid username or password",
                message: "Please check your login and try again- invalid username or password",
            });
            return;
        }
        res.send(user);
    } catch (err) {
        next(err);
    }
});


// Protected routes (require auth)
server.get('/api/users/:user_id', isLoggedIn, async (req, res, next) => {
    try {
        res.send(await fetchUser(req.params.user_id));
    } catch (err) {
        next(err);
    }
});

server.get('/api/users', isLoggedIn, async (req, res, next) => {
    try {
        res.send(await fetchUsers());
    } catch (err) {
        next(err);
    }
});

//this endpoint will need to be updated with the const, like post users
server.post('/api/products', isLoggedIn, async (req, res, next) => {
    const { name, description, image_url, price } = req.body;
    try {
        res.send(await createProduct(name, description, image_url, price));
    } catch (err) {
        next(err);
    }
});

server.get('/api/user_cart/:user_id', isLoggedIn, async (req, res, next) => {
    try {
        if (req.params.user_id !== req.user.id) {
            const error = Error('Unauthorized');
            error.status = 401;
            throw error;
        }
        res.send(await fetchUserCart(req.params.user_id));
    } catch (err) {
        next(err);
    }
});

//this endpoint will need to be updated with the const, like post users
server.post('/api/user_cart', isLoggedIn, async (req, res, next) => {
    const { user_id, product_id, quantity } = req.body;
    try {
        res.send(await createUserCart(user_id, product_id, quantity));
    } catch (err) {
        next(err);
    }
});

//not sure if this endpoint will need to be updated with the const, like post users?
server.put('/api/user_cart/:user_id/:product_id', isLoggedIn, async (req, res, next) => {
    try {
        res.send(await updateUserCart(req.params.user_id, req.params.product_id, req.body));
    } catch (err) {
        next(err);
    }
});

server.delete('/api/user_cart/:user_id/:product_id', isLoggedIn, async (req, res, next) => {
    try {
        if (req.params.user_id !== req.user.id) {
            const error = Error('Unauthorized');
            error.status = 401;
            throw error;
        }
        await deleteUserCart(req.params.user_id, req.params.product_id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});
