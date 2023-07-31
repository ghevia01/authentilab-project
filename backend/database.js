
// Import MongoDB client
const mongoose = require('mongoose');

// Import environment variables
require('dotenv').config({ path: '../.env' }); // Load environment variables from .env file

// Import environment variables
const dbProtocol = process.env.MONGODB_PROTOCOL; // MongoDB protocol
const username = process.env.MONGODB_USERNAME; // MongoDB username
const password = process.env.MONGODB_PASSWORD; // MongoDB password
const clusterUrl = process.env.MONGODB_CLUSTER; // MongoDB cluster URL
const database = process.env.MONGODB_DATABASE; // MongoDB database name
const uriOptions = "retryWrites=true&w=majority"; // MongoDB URI options

// MongoDB connection URI
const uri = `${dbProtocol}://${username}:${password}@${clusterUrl}/${database}?${uriOptions}`;

// Connect to MongoDB cluster and database
const connectToMongoDB = async () => {

    try {
        
        // Connect to MongoDB cluster
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Successfully connected to MongoDB');

    } catch (err) {

        // Log error to console
        console.log("Error connecting to MongoDB cluster");
        console.log(err);
    }
}

module.exports = { connectToMongoDB };