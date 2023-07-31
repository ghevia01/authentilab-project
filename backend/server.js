
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

// ----------------- Server Start -----------------

// Start server on port 5000
const PORT = process.env.PORT || 5000;

// Listen on port 5000
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);

// ----------------- Connect to MongoDB -----------------

// Connect to MongoDB cluster and database
connectToMongoDB();

// ----------------- Request Handlers -----------------

const handleLoginRequest = async (req, res) => {

    // Get username and password from request body
    const { userName, password } = req.body;

    // Authenticate user
    const user = await userAuthentication(userName, password);

    // If user was registered
    if (user) {

        res.status(200).json({ success: true, message: 'Login successful' });
    }

    // If user was not registered
    else if (!user) {

        res.status(400).json({ success: false, message: 'Username or password is incorrect, try again.' });
    }

    // If error occurs
    else {

        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const handleRegisterRequest = async (req, res) => {

    // Get user information from request body
    const {
        firstName,
        lastName,
        gender,
        country,
        userName,
        email,
        password } = req.body;

    // Register user
    try {
        // Pass destructured properties to userRegistration function
        const user = await userRegistration(firstName, lastName, gender, country, userName, email, password);

        // If user is found
        if (user) {

            res.status(200).json({ success: true, message: 'Registration successful' });
        }

        // If user is not found
        else if (!user) {

            res.status(400).json({ success: false, message: 'Registration was not succesful' });
        }

        // If error occurs
        else {

            res.status(500).json({ success: false, message: 'Internal server error' });
        }

    } catch (err) {

        // Handle error (for example, unique constraint violation)
        res.status(400).send(err.message);
    }
};

// ----------------- Routes -----------------

app.post('/api/auth/login', handleLoginRequest);
app.post('/api/auth/register', handleRegisterRequest);
