
// Import bcrypt and User model
const bcrypt = require('bcrypt');
const User = require('./UserModels/user');

// Authenticate user
const userAuthentication = async (userName, password) => {

    // Find user with matching username
    const user = await User.findOne({ username: userName });

    // If no user is found, return null
    if (!user) {
        return null;
    }

    // Compare submitted password with stored password
    const passwordValid = await bcrypt.compare(password, user.password);
    
    // Return user if password is valid, null if not
    return passwordValid ? user : null;
};

module.exports = { userAuthentication };
