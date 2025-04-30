const {
    client,
    createTables,
    createUser,
    createProduct,
    createUserCart,
    fetchUserCart,
    deleteUserCart
} = require('./db');

const bcrypt = require('bcrypt');

const seed = async () => {
    await client.connect();
    console.log('Connected to database');

    await createTables();
    console.log('Tables created');

    //create users
    const [belle, ariel, jasmine, mickey, minnie, castleShirt, waltMickeyTank, disneylandSweatshirt, ferrisWheelSweatshirt, mickeyPlush] = await Promise.all([
        createUser({
            username: 'belle_princess',
            password: 'beast123',
            is_admin: true,
            name: 'Princess Belle',
            email: 'belle@disney.com',
            mailing_address: '1 Beauty Way',
            phone: '123-4567',
            billing_address: '1 Beauty Way'
        }),
        createUser({
            username: 'ariel_princess',
            password: 'flounder123',
            is_admin: false,
            name: 'Princess Ariel',
            email: 'ariel@disney.com',
            mailing_address: '2 Under the Sea',
            phone: '555-0002',
            billing_address: '2 Under the Sea'
        }),
        createUser({
            username: 'jasmine_princess',
            password: 'agrabah123',
            is_admin: false,
            name: 'Princess Jasmine',
            email: 'jasmine@disney.com',
            mailing_address: '3 Raja Palace',
            phone: '408-5508',
            billing_address: '3 Raja Palace'
        }),
        createUser({
            username: 'mickey_mouse',
            password: 'disney123',
            is_admin: false,
            name: 'Mickey Mouse',
            email: 'mickey@disney.com',
            mailing_address: '1 Disney Way',
            phone: '768-9000',
            billing_address: '1 Disney Way'
        }),
        createUser({
            username: 'minnie_mouse',
            password: 'disney123',
            is_admin: false,
            name: 'Minnie Mouse',
            email: 'minnie@disney.com',
            mailing_address: '2 Disney Way',
            phone: '768-9001',
            billing_address: '2 Disney Way'
        }),

        //create products   
        createProduct({
            name: 'Disney Castle Shirt',
            description: 'Disney shirt with Castle on the front',
            image_url: 'https://unsplash.com/photos/brown-and-blue-castle-under-cloudy-sky-during-daytime-Lmd-CpZOGWc',
            price: 19.99
        }),
        createProduct({
            name: 'Walt & Mickey Tank',
            description: 'Disney tank top with Walt and Mickey on the front',
            image_url: 'https://unsplash.com/photos/man-holding-rat-concrete-statue-DUgYdLxVEPM',
            price: 16.99
        }),
        createProduct({
            name: 'Disneyland Sweatshirt',
            description: 'Disney sweatshirt with Disneyland on the front',
            image_url: 'https://unsplash.com/photos/a-building-with-a-sign-that-says-disneyland-on-it-CAvg_0FEMCo',
            price: 29.99
        }),
        createProduct({
            name: 'Disney Ferris Wheel Sweatshirt',
            description: 'Disney sweatshirt with Disney Ferris wheel on the front',
            image_url: 'https://unsplash.com/photos/multicolored-ferris-wheel-during-nighttime-XptxqeT0Wo4',
            price: 39.99
        }),
        createProduct({
            name: 'Disney Mickey Mouse Plush',
            description: 'Official Disney Mickey Mouse plush toy, 12 inches tall',
            image_url: 'https://example.com/mickey-plush.jpg',
            price: 29.99
        })
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
};

seed();
