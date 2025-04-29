const {
    client,
    createTables,
    createUser,
    createProduct,
    createUserCart
} = require('./db');

const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        // Connect to database
        await client.connect();
        console.log('Connected to database');

        // Create tables
        await createTables();
        console.log('Tables created');

        // Create users and products
        const [belle, ariel, jasmine, mickeyMouse, minnieMouse, castleShirt, waltMickeyTank, disneylandSweatshirt, ferrisWheelSweatshirt, mickeyPlush] = await Promise.all([
            createUser({
                username: 'belle_princess',
                password: 'beauty123',
                is_admin: true,
                name: 'Princess Belle',
                email: 'belle@disney.com',
                mailing_address: '1 Beauty Way',
                phone: '555-0001',
                billing_address: '1 Beauty Way'
            }),
            createUser({
                username: 'ariel_princess',
                password: 'under123',
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
                mailing_address: '3 Agrabah Palace',
                phone: '555-0003',
                billing_address: '3 Agrabah Palace'
            }),
            createUser({
                username: 'mickey_mouse',
                password: 'disney123',
                is_admin: false,
                name: 'Mickey Mouse',
                email: 'mickey@disney.com',
                mailing_address: '1 Disney Way',
                phone: '555-0004',
                billing_address: '1 Disney Way'
            }),
            createUser({
                username: 'minnie_mouse',
                password: 'disney123',
                is_admin: false,
                name: 'Minnie Mouse',
                email: 'minnie@disney.com',
                mailing_address: '2 Disney Way',
                phone: '555-0005',
                billing_address: '2 Disney Way'
            }),
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
                image_url: 'https://unsplash.com/photos/red-blue-and-yellow-balloons-xOhzHKCAhVs',
                price: 29.99
            })
        ]);
        console.log('Users and products created');

        // Create cart items
        const [belleCastle, arielWalt, jasmineDisneyland, mickeyPlushCart, minnieFerris] = await Promise.all([
            createUserCart({
                user_id: belle.id,
                product_id: castleShirt.id,
                quantity: 1
            }),
            createUserCart({
                user_id: ariel.id,
                product_id: waltMickeyTank.id,
                quantity: 2
            }),
            createUserCart({
                user_id: jasmine.id,
                product_id: disneylandSweatshirt.id,
                quantity: 1
            }),
            createUserCart({
                user_id: mickeyMouse.id,
                product_id: mickeyPlush.id,
                quantity: 1
            }),
            createUserCart({
                user_id: minnieMouse.id,
                product_id: ferrisWheelSweatshirt.id,
                quantity: 1
            })
        ]);
        console.log('Cart items created');

        console.log('Seed data created successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.end();
    }
};

seed();
