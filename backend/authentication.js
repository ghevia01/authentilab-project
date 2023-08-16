// Import bcrypt and User model
const bcrypt = require('bcrypt');
const User = require('./UserModels/user');

// Authenticate user
const userAuthentication = async (userName, password) => {

    // Find user with matching username
    const user = await User.findOne({ username: userName });

    // If no user is found or password validation fails, return error
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return {
            user: null,
            error: true,
            message: 'Username or password incorrect',
        };
    }

    // Return user and no error
    return {
        user,
        error: false,
        message: 'User authenticated',
    };
};

module.exports = { userAuthentication };
