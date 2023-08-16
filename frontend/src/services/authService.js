// Send --POST-- request to the server with the login form data
export const sendUserLoginData = async (loginFormData) => {

    try {

        // Send the login form data to the server
        const response = await fetch(`${process.env.REACT_APP_LOGIN_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginFormData),
            signal: new AbortController().signal,
        });

        // Get the response from the server and log it
        const data = await response.json();

        // Return the data and response
        return { data, response };

    } catch (error) {

        // Return a default error response
        return {
            data: null,
            response: {
                status: 500,
                statusText: "An error occurred while fetching the data",
            }
        };
    }
};