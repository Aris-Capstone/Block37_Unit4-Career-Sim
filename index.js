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
    fetchUser
} = require('./db');

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
const morgan = require('morgan');
app.use(morgan('dev'));

const JWT = process.env.JWT || 'shhh';

const auth = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, JWT);
    req.user = decoded;
    next();
};

app.get('/api/user/:user_id', isLoggedIn, async (req, res, next) => {
    try {
        const user = await fetchUser(req.params.user_id);
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// Public endpoints (no auth required)
app.post('/api/users', async (req, res, next) => {
    try {
        const user = await createUser(req, res, next);
        res.json(user);
    } catch (err) {
        next(err);
    }
});

app.use(auth);
const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

// Protected endpoints (require auth)

app.get('/api/products', async (req, res, next) => {
    try {
        const products = await fetchProducts();
        res.json(products);
    } catch (err) {
        next(err);
    }
});

app.post('/api/products', isLoggedIn, async (req, res, next) => {
    try {
        const product = await createProduct(req, res, next);
        res.json(product);
    } catch (err) {
        next(err);
    }
});

app.get('/api/user-cart/:user_id', isLoggedIn, async (req, res, next) => {
    try {
        const userCart = await fetchUserCart(req.params.user_id);
        res.json(userCart);
    } catch (err) {
        next(err);
    }
});

app.post('/api/user-cart', isLoggedIn, async (req, res, next) => {
    try {
        const userCart = await createUserCart(req.body);
        res.json(userCart);
    } catch (err) {
        next(err);
    }
});

app.put('/api/user-cart/:user_id/:product_id', isLoggedIn, async (req, res, next) => {
    try {
        const userCart = await updateUserCart(req.params.user_id, req.params.product_id, req.body);
        res.json(userCart);
    } catch (err) {
        next(err);
    }
});
app.delete('/api/user-cart/:user_id/:product_id', isLoggedIn, async (req, res, next) => {
    try {
        const userCart = await deleteUserCart(req.params.user_id, req.params.product_id);
        res.sendStatus(204);
        res.json(userCart);
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
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



    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

init();