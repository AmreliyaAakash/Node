const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true })); // to parse form data
app.use(express.static(path.join(__dirname, 'public')));

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

// In-memory data store
let blogs = [
    {
        id: '1',
        title: 'Welcome to My Blog',
        content: 'This is your brand new Express and EJS blog! Feel free to edit or delete this post, and of course, create new ones!',
        image: null,
        createdAt: new Date().toLocaleDateString()
    }
];

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);


// --- ROUTES ---

// 1. Read blogs (GET all)
app.get('/', (req, res) => {
    res.render('index', { blogs });
});

// 2. Create blog (GET new form)
app.get('/new', (req, res) => {
    res.render('new');
});

// 3. Create blog (POST create with image)
app.post('/new', upload.single('image'), (req, res) => {
    const { title, content } = req.body;
    let image = null;
    
    // If a file was uploaded, store its path
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

// 4. Update blog (GET edit form)
app.get('/edit/:id', (req, res) => {
    const blog = blogs.find(b => b.id === req.params.id);
    if (!blog) {
        return res.status(404).send('Blog not found');
    }
    res.render('edit', { blog });
});

// 5. Update blog (POST update with image)
app.post('/edit/:id', upload.single('image'), (req, res) => {
    const { title, content } = req.body;
    const blogIndex = blogs.findIndex(b => b.id === req.params.id);
    
    if (blogIndex === -1) {
        return res.status(404).send('Blog not found');
    }

    // Keep the old image if a new one isn't uploaded
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

// 6. Delete blog (POST delete)
app.post('/delete/:id', (req, res) => {
    blogs = blogs.filter(b => b.id !== req.params.id);
    res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
