
// Main server file

// ----------------- Import Dependencies -----------------

// Constants for Express server
const express = require('express'); // Express web server framework
const app = express(); // Create express app

// Import MongoDB client
const { connectToMongoDB } = require('./database.js');

// Import user authentication function
const { userAuthentication } = require('./authentication.js');
const { userRegistration } = require('./registration.js');

// ----------------- Middleware and Configurations -----------------

// Parse JSON request bodies (JSON payloads, HTTP requests with JSON bodies)
app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing, restricts which domains/origins can access this server)
const cors = require('cors'); // CORS middleware

// Allow requests from all domains/origins
app.use(cors({}));

// Start server on port 5000
const PORT = process.env.PORT || 5000;

// ----------------- Connect to MongoDB -----------------

// Connect to MongoDB cluster and database
connectToMongoDB();

// ----------------- Request Handlers -----------------

// Handle login request
const handleLoginRequest = async (req, res) => {

    try {

        // Get username and password from request body
        const { userName, password } = req.body;

        // Pass username and password to userAuthentication function for authentication
        const { user, error, message } = await userAuthentication(userName, password);

        // If user was authenticated
        if (user) {
            return res.status(200).json({
                success: true,
                message: message,
            });
        }

        // If user was not found or password was incorrect
        else if (error) {
            return res.status(400).json({
                success: false,
                message: message,
            });
        }
    } catch (err) {

        // If an internal server error has ocurred
        return res.status(500).json({
            success: false,
            message: 'An internal server error has ocurred',
        });
    }
};

// Handle register request
const handleRegisterRequest = async (req, res) => {

    try {
        // Get user data from request body
        const userData = req.body;

        // Pass user data to userRegistration function for registration
        const { user, error, message } = await userRegistration(userData);

        // If user is was registered successfully
        if (user) {
            return res.status(200).json({
                success: true,
                message: message,
            });
        }

        // If user already exists
        else if (error) {
            return res.status(400).json({
                success: false,
                message: message
            });
        }
    } catch (err) {

        // If an internal server error has ocurred
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ----------------- Routes -----------------

app.post('/api/auth/login', handleLoginRequest);
app.post('/api/auth/register', handleRegisterRequest);

// ----------------- Start Server -----------------
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
