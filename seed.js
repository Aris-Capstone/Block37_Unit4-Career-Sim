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
        const [admin, johnDoe, janeSmith, Castle, Walt, Disneyland, Ferris_Wheel] = await Promise.all([
            createUser({
                username: 'admin',
                password: 'admin123',
                is_admin: true,
                name: 'Admin User',
                email: 'admin@example.com',
                mailing_address: '123 Admin St',
                phone: '555-0001',
                billing_address: '123 Admin St'
            }),
            createUser({
                username: 'john_doe',
                password: 'password123',
                is_admin: false,
                name: 'John Doe',
                email: 'john@example.com',
                mailing_address: '456 Main St',
                phone: '555-0002',
                billing_address: '456 Main St'
            }),
            createUser({
                username: 'jane_smith',
                password: 'password123',
                is_admin: false,
                name: 'Jane Smith',
                email: 'jane@example.com',
                mailing_address: '789 Oak St',
                phone: '555-0003',
                billing_address: '789 Oak St'
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
            })
        ]);
        console.log('Users and products created');

        // Create cart items
        const [johnCastle, adminWalt, janeDisneyland] = await Promise.all([
            createUserCart({
                user_id: johnDoe.id,
                product_id: Castle.id,
                quantity: 1
            }),
            createUserCart({
                user_id: admin.id,
                product_id: Walt.id,
                quantity: 2
            }),
            createUserCart({
                user_id: janeSmith.id,
                product_id: Disneyland.id,
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
