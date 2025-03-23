// Import required modules
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import bcrypt from 'bcrypt';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { engine } from 'express-handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// Define User schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// Define Task schema
const TaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    task: { type: String, required: true },
});
const Task = mongoose.model('Task', TaskSchema);

const app = express();

// handlebars setup
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: false }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


/*
The middleware consists of functions that are executed in between receiving the request and sending the response.
In other words, it helps you perform tasks like processing data or adding specific functionalities before the request reaches the route.

Why do we use it?
When you create a form in a page like login.hbs or signup.hbs and submit it,
the data (such as username and password) is sent in the request body in the application/x-www-form-urlencoded format.
This middleware converts that data into a JavaScript object so you can use it in your routes.
*/

// Middleware
app.use(express.urlencoded({ extended: true })); // convert data from form into a JavaScript object
app.use(express.static(path.join(__dirname, 'public'))); // serve static files like files in the public folder
app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, // don't save session if unmodified
    saveUninitialized: true // always create session to ensure the session is saved
}));

// Routes
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error during signup: ' + error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            res.redirect('/home');
        } else {
            res.send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send('Error during login: ' + error.message);
    }
});

app.get('/home', async (req, res) => {
    if (!req.session.userId) return res.redirect('/');
    try {
        const user = await User.findById(req.session.userId).lean();
        if (!user) return res.status(404).send('User not found');
        const tasks = await Task.find({ userId: req.session.userId }).lean();
        res.render('home', { tasks, username: user.username });
    } catch (error) {
        res.status(500).send('Error fetching tasks: ' + error.message);
    }
});

app.post('/add-task', async (req, res) => {
    if (!req.session.userId) return res.redirect('/');
    try {
        await Task.create({ userId: req.session.userId, task: req.body.task });
        res.redirect('/home');
    } catch (error) {
        res.status(500).send('Error adding task: ' + error.message);
    }
});

app.post('/delete-task', async (req, res) => {
    if (!req.session.userId) return res.redirect('/');
    try {
        const { taskId } = req.body;
        if (!taskId) return res.status(400).send('Task ID is required');
        await Task.findByIdAndDelete(taskId);
        res.redirect('/home');
    } catch (error) {
        res.status(500).send('Error deleting task: ' + error.message);
    }
});

app.post('/update-task', async (req, res) => {
    if (!req.session.userId) return res.redirect('/');
    try {
        const { taskId, task } = req.body;
        if (!taskId || !task) return res.status(400).send('Task ID and task are required');
        await Task.findByIdAndUpdate(taskId, { task });
        res.redirect('/home');
    } catch (error) {
        res.status(500).send('Error updating task: ' + error.message);
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});