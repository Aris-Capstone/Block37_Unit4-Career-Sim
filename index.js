const {
    client,
    createTables,
    createUser,
    createProduct,
    createUserCart,
    fetchProducts,
    fetchUserCart,
    updateUserCart,
    deleteUserCart,
    authenticate,
    findUserWithToken,
    fetchUser
} = require('./db');

const morgan = require('morgan');
const express = require('express');

const server = express();
client.connect();

server.use(express.json());
server.use(morgan('dev'));

//for deployment only
const path = require('path');
server.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));

server.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server is running on port ${port}`));

//const JWT = process.env.JWT || 'shhh';


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

server.post('/api/users', async (req, res, next) => {
    try {
        res.send(await createUser(req.body));
    } catch (err) {
        next(err);
    }
});

// Apply auth middleware to all routes after this point
server.use(authenticate);

// Protected routes (require auth)
server.get('/api/user/:user_id', isLoggedIn, async (req, res, next) => {
    try {
        res.send(await fetchUser(req.params.user_id));
    } catch (err) {
        next(err);
    }
});

server.post('/api/products', isLoggedIn, async (req, res, next) => {
    try {
        res.send(await createProduct(req.body));
    } catch (err) {
        next(err);
    }
});

server.get('/api/user-cart/:user_id', isLoggedIn, async (req, res, next) => {
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

server.post('/api/user-cart', isLoggedIn, async (req, res, next) => {
    try {
        res.send(await createUserCart(req.body));
    } catch (err) {
        next(err);
    }
});

server.put('/api/user-cart/:user_id/:product_id', isLoggedIn, async (req, res, next) => {
    try {
        res.send(await updateUserCart(req.params.user_id, req.params.product_id, req.body));
    } catch (err) {
        next(err);
    }
});

server.delete('/api/user-cart/:user_id/:product_id', isLoggedIn, async (req, res, next) => {
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

const init = async () => {
    const port = process.env.PORT || 3000;
    await client.connect();
    console.log('Connected to database');

    await createTables();
    console.log('Tables created');

    const [user, product] = await Promise.all([
        createUser({ email: 'test@test.com', password: 'test' }),
        createProduct({ name: 'Test Product', price: 100 })
    ]);
    console.log('User and product created');

};

init();