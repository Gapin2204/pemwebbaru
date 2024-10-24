const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET, // Use .env for secrets
    resave: false,
    saveUninitialized: true,
}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check login status
app.use((req, res, next) => {
    if (!req.session.user && req.path !== '/auth/login' && req.path !== '/auth/register') {
        return res.redirect('/auth/login');
    } else if (req.session.user && req.path === '/') {
        return res.redirect('/auth/profile');
    }
    next();
});

// Routes
app.use('/auth', authRoutes);

// Root Route: Redirect to /auth/login or /auth/profile based on session
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/auth/profile');
    }
    return res.redirect('/auth/login');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:8080');
});
