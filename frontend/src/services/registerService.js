// Send the register form data to the server
export const sendRegisterFormData = async (registerFormData) => {
    try {

        // Destructure the register form data (we destructure the rePassword field because 
        // we don't need it in the request body and send only the rest of the data using the spread operator)
        const { rePassword, ...dataToSend } = registerFormData;

        // Send the login form data to the server
        const response = await fetch(`${process.env.REACT_APP_REGISTER_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
        });

        // Get the response from the server and log it
        const data = await response.json();

        // Return the response and the data
        return { data, response };

    } catch (error) {

        // Log the error
        console.error("An error occurred while fetching the data: ", error);

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