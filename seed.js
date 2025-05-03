const {
    client,
    createTables,
    createUser,
    createProduct,
    createUserCart,
    fetchUserCart,
    deleteUserCart,
    fetchUsers,
    fetchProducts
} = require('./db');

const bcrypt = require('bcryptjs');

const seed = async () => {
    await client.connect();
    console.log('Connected to database');

    await createTables();
    console.log('Tables created');

    //create users
    const [belle, ariel, jasmine, mickey, minnie, castleShirt, waltMickeyTank, disneylandSweatshirt, ferrisWheelSweatshirt, mickeyPlush] = await Promise.all([
        createUser(
            'belle_princess',
            'beast123',
            'Princess Belle',
            '1 Beauty Way'
        ),
        createUser(
            'ariel_princess',
            'flounder123',
            'Princess Ariel',
            '2 Under the Sea'
        ),
        createUser(
            'jasmine_princess',
            'agrabah123',
            'Princess Jasmine',
            '3 Raja Palace'
        ),
        createUser(
            'mickey_mouse',
            'disney123',
            'Mickey Mouse',
            '1 Disney Way'
        ),
        createUser(
            'minnie_mouse',
            'disney123',
            'Minnie Mouse',
            '2 Disney Way'
        ),

        //create products   
        createProduct(
            'Disney Castle Shirt',
            'Disney shirt with Castle on the front',
            'https://unsplash.com/photos/brown-and-blue-castle-under-cloudy-sky-during-daytime-Lmd-CpZOGWc',
            19.99
        ),
        createProduct(
            'Walt & Mickey Tank',
            'Disney tank top with Walt and Mickey on the front',
            'https://unsplash.com/photos/man-holding-rat-concrete-statue-DUgYdLxVEPM',
            16.99
        ),
        createProduct(
            'Disneyland Sweatshirt',
            'Disney sweatshirt with Disneyland on the front',
            'https://unsplash.com/photos/a-building-with-a-sign-that-says-disneyland-on-it-CAvg_0FEMCo',
            29.99
        ),
        createProduct(
            'Disney Ferris Wheel Sweatshirt',
            'Disney sweatshirt with Disney Ferris wheel on the front',
            'https://unsplash.com/photos/multicolored-ferris-wheel-during-nighttime-XptxqeT0Wo4',
            39.99
        ),
        createProduct(
            'Disney Mickey Mouse Plush',
            'Official Disney Mickey Mouse plush toy, 12 inches tall',
            'https://example.com/mickey-plush.jpg',
            29.99
        )
    ]);

    console.log('Users created');
    console.log(await fetchUsers());

    console.log('Products created');
    console.log(await fetchProducts());

    //create user carts
    const [user_cart] = await Promise.all([
        createUserCart(belle.id, castleShirt.id, 1),
        createUserCart(ariel.id, waltMickeyTank.id, 2),
        createUserCart(jasmine.id, disneylandSweatshirt.id, 1),
        createUserCart(mickey.id, mickeyPlush.id, 1),
        createUserCart(minnie.id, ferrisWheelSweatshirt.id, 1)
    ]);

    console.log('Cart items created');
    console.log(await fetchUserCart(belle.id));


    // Delete cart items
    await deleteUserCart(user_cart.id, castleShirt.id),
        console.log("After deleting user cart");
    console.log(await fetchUserCart(castleShirt.id));


    await client.end();

    console.log("data seeded")
};

seed();
