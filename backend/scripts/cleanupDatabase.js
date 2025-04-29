const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

async function cleanupDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/telegram-shop');
        console.log('Connected to MongoDB');

        // Remove test categories
        console.log('Removing test categories...');
        const removedCategories = await Category.deleteMany({
            slug: { $nin: ['women', 'men', 'unisex', 'sets'] }
        });
        console.log(`Removed ${removedCategories.deletedCount} test categories`);

        // Remove products with invalid prices
        console.log('Removing products with invalid prices...');
        const invalidProducts = await Product.find({
            'volumes.price': { $lte: 0 }
        });
        
        if (invalidProducts.length > 0) {
            console.log('Found invalid products:');
            invalidProducts.forEach(product => {
                console.log(`- ${product.name} (ID: ${product._id})`);
            });
            
            await Product.deleteMany({
                'volumes.price': { $lte: 0 }
            });
            console.log(`Removed ${invalidProducts.length} products with invalid prices`);
        } else {
            console.log('No products with invalid prices found');
        }

        console.log('Database cleanup completed');
    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

cleanupDatabase(); 