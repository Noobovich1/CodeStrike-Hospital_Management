// api.js - Centralized API Utility

const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Handle unauthorized
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                window.location.href = '/auth.html';
                throw new Error('Unauthorized');
            }
            
            let errorMessage = 'API Error';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // If it's not JSON, read text
                errorMessage = await response.text() || errorMessage;
            }
            throw new Error(errorMessage);
        }

        // If response is empty (e.g., 204 No Content), return null
        const text = await response.text();
        return text ? JSON.parse(text) : null;
        
    } catch (error) {
        console.error(`API Error on ${endpoint}:`, error);
        throw error;
    }
}

export const api = {
    get: (endpoint) => request(endpoint, { method: 'GET' }),
    post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
