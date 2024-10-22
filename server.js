// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Hardcoded username and password
const hardcodedUsername = 'Aditi';
const hardcodedPassword = 'password123';

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static HTML files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Simple validation for hardcoded credentials
    if (email === hardcodedUsername && password === hardcodedPassword) {
        res.redirect('/landing'); // Redirect to the landing page if login is successful
    } else {
        res.send('Invalid username or password'); // Show an error if login is incorrect
    }
});

// Serve landing page after login
app.get('/landing', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
