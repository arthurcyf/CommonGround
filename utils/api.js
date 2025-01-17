import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001', // Replace 'localhost' with your computer's IP if testing on a physical device
});

// Fetch all data
export const getData = async () => {
    try {
        const response = await api.get('/data');
        return response.data; // Return the data from the database
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Insert new data
export const addData = async (newData) => {
    try {
        const response = await api.post('/data', newData);
        return response.data; // Return confirmation or the newly inserted data
    } catch (error) {
        console.error('Error adding data:', error);
        throw error;
    }
};

// Update data
export const updateData = async (id, updatedData) => {
    try {
        const response = await api.put(`/data/${id}`, updatedData);
        return response.data; // Return confirmation
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
};

// Delete data
export const deleteData = async (id) => {
    try {
        const response = await api.delete(`/data/${id}`);
        return response.data; // Return confirmation
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};
