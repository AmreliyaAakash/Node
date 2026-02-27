const express = require('express');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true })); // to parse form data
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Multer storage configuration for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// --- IN-MEMORY DATA STORES ---

let blogs = [
    {
        id: '1',
        title: 'Welcome to My Blog',
        content: 'This is your brand new Express and EJS blog! Feel free to edit or delete this post, and of course, create new ones!',
        image: null,
        createdAt: new Date().toLocaleDateString()
    }
];

// Simple users array (Not for production - use a database in real apps!)
let users = [];

// --- AUTH MIDDLEWARE ---

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
    const userId = req.cookies.userId;

    // Check if cookie exists and user is in our "database"
    if (userId && users.find(u => u.id === userId)) {
        // User is authenticated, pass user info to views and proceed
        res.locals.user = users.find(u => u.id === userId);
        next();
    } else {
        // Not authenticated, redirect to login page
        res.redirect('/login');
    }
};

// Middleware to inject user into views for non-protected routes (like navbar)
const checkUser = (req, res, next) => {
    const userId = req.cookies.userId;
    if (userId) {
        res.locals.user = users.find(u => u.id === userId);
    } else {
        res.locals.user = null;
    }
    next();
};

app.use(checkUser);


// --- AUTHENTICATION ROUTES ---

// GET Signup Form
app.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});

// POST Signup
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (users.find(u => u.email === email)) {
        return res.render('signup', { error: 'Email already exists!' });
    }

    const newUser = {
        id: generateId(),
        username,
        email,
        password // WARNING: Storing plain text passwords is only for this simple demo!
    };

    users.push(newUser);

    // Automatically log user in after signup by setting cookie
    res.cookie('userId', newUser.id, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 1 week
    res.redirect('/');
});

// GET Login Form
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// POST Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Set cookie and redirect
        res.cookie('userId', user.id, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
        res.redirect('/');
    } else {
        res.render('login', { error: 'Invalid email or password' });
    }
});

// GET Logout
app.get('/logout', (req, res) => {
    res.clearCookie('userId');
    res.redirect('/login');
});


// --- BLOG ROUTES (Protected) ---

// 1. Read blogs (GET all) - Protected
app.get('/', requireAuth, (req, res) => {
    res.render('index', { blogs });
});

// 2. Create blog (GET new form) - Protected
app.get('/new', requireAuth, (req, res) => {
    res.render('new');
});

// 3. Create blog (POST create with image) - Protected
app.post('/new', requireAuth, upload.single('image'), (req, res) => {
    const { title, content } = req.body;
    let image = null;

    if (req.file) {
        image = `/uploads/${req.file.filename}`;
    }

    const newBlog = {
        id: generateId(),
        title,
        content,
        image,
        createdAt: new Date().toLocaleDateString()
    };

    blogs.push(newBlog);
    res.redirect('/');
});

// 4. Update blog (GET edit form) - Protected
app.get('/edit/:id', requireAuth, (req, res) => {
    const blog = blogs.find(b => b.id === req.params.id);
    if (!blog) {
        return res.status(404).send('Blog not found');
    }
    res.render('edit', { blog });
});

// 5. Update blog (POST update with image) - Protected
app.post('/edit/:id', requireAuth, upload.single('image'), (req, res) => {
    const { title, content } = req.body;
    const blogIndex = blogs.findIndex(b => b.id === req.params.id);

    if (blogIndex === -1) {
        return res.status(404).send('Blog not found');
    }

    let image = blogs[blogIndex].image;
    if (req.file) {
        image = `/uploads/${req.file.filename}`;
    }

    blogs[blogIndex] = {
        ...blogs[blogIndex],
        title,
        content,
        image
    };

    res.redirect('/');
});

// 6. Delete blog (POST delete) - Protected
app.post('/delete/:id', requireAuth, (req, res) => {
    blogs = blogs.filter(b => b.id !== req.params.id);
    res.redirect('/');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
