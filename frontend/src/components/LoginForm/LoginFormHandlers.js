
// Event Handlers for Login Form

export const handleInputChange = (e, formData, setFormData) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

export const handleFormSubmit = (e, formData) => {
    e.preventDefault();
    console.log(formData);
};

