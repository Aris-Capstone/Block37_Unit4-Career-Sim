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
            'https://images.unsplash.com/photo-1509407336566-fca158fddcce?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGlzbmV5fGVufDB8fDB8fHww',
            19.99
        ),
        createProduct(
            'Walt & Mickey Tank',
            'Disney tank top with Walt and Mickey on the front',
            'https://images.unsplash.com/photo-1530908158103-e2d2bf40c235?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRpc25leXxlbnwwfHwwfHx8MA%3D%3D',
            16.99
        ),
        createProduct(
            'Disneyland Sweatshirt',
            'Disney sweatshirt with Disneyland on the front',
            'https://images.unsplash.com/photo-1551454211-35c47de27645?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRpc25leXxlbnwwfHwwfHx8MA%3D%3D',
            29.99
        ),
        createProduct(
            'Disney Ferris Wheel Sweatshirt',
            'Disney sweatshirt with Disney Ferris wheel on the front',
            'https://images.unsplash.com/photo-1588882929086-51acd6e39954?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGRpc25leXxlbnwwfHwwfHx8MA%3D%3D',
            39.99
        ),
        createProduct(
            'Disney Mickey Mouse Plush',
            'Official Disney Mickey Mouse plush toy, 12 inches tall',
            'https://images.unsplash.com/photo-1581909199603-0de32b43ffd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRpc25leXxlbnwwfHwwfHx8MA%3D%3D',
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
