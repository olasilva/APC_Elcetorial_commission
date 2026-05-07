// SENTINEL Core Utilities
const SENTINEL = {
    version: '1.0.0',
    apiEndpoint: 'https://api.sentinel-apc.ng',
    
    // Authentication check
    checkAuth: function() {
        if (!sessionStorage.getItem('sentinel_auth')) {
            window.location.href = 'auth.html';
            return false;
        }
        return true;
    },

    // Get current user
    getCurrentUser: function() {
        const userData = sessionStorage.getItem('sentinel_user');
        return userData ? JSON.parse(userData) : null;
    },

    // Format numbers
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Nigeria time
    getNigeriaTime: function() {
        return new Date().toLocaleTimeString('en-NG', { 
            timeZone: 'Africa/Lagos', 
            hour12: false 
        });
    },

    // Logout
    logout: function() {
        sessionStorage.clear();
        window.location.href = 'auth.html';
    }
};

// Global error handler
window.onerror = function(msg, url, line) {
    console.error('SENTINEL Error:', msg);
    return false;
};