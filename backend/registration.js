// Import User model
const User = require('./UserModels/user');

// Handle user registration
const userRegistration = async ({firstName, lastName, gender, country, userName, email, password}) => {

    // Check if user with this username or email already exists
    const userExists = await User.findOne({ $or: [ {username: userName}, {email: email} ] });

    // Return error if user already exists
    if (userExists) {
        return { 
            user: null,
            error: true,
            message: 'User with this username or email already exists',
         };
    }

    // Create a new user
    const user = new User({ 
        first_name: firstName, 
        last_name: lastName, 
        gender: gender,
        country: country,
        username: userName,
        email: email,
        password: password
    });

    // Save user in the database
    await user.save();

    // Return user
    return { 
        user, 
        error: false,
        message: 'Registration was successful',
    };
};

module.exports = { userRegistration };