const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');



const PORT = 5050;
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for parsing application/json
app.use(express.static("public"));
app.use(cookieParser());

//Azure Mongo url
const MONGO_URL = "mongodb://bitsuserregappproject:bQTg9d6LKeJlFYvDXKpp91Wv3mlrj0PYlZOxySpmCuO0YDtiSzQ0XUcI4DaXY8BGdNgMkDMuRZdbACDbeGWKiw==@bitsuserregappproject.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@bitsuserregappproject@";
//const MONGO_URL = "mongodb://admin:admin@localhost:27017/userdb?authSource=admin";  //Local Mongo url

// Connect to MongoDB
mongoose.connect(MONGO_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

//Create a user schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);


// GET all users
app.get("/getUsers", verifyToken, async (req, res) => {
    //res.status(200).json({ message: 'Protected route accessed' });
    try {
        //const users = await User.findOne({});
        const users = req.cookies.username;
        const currentUsername = res.status(200).json(users);
        //await client.connect();
        // const db = client.db("userdb");
        // const data = await db.collection("users").find({}).toArray();
        // res.send(data);
    } catch (err) {
        res.status(500).send("Error fetching users");
    }
});

// POST new user
app.post("/addUser", async (req, res) => {
    const { username, password } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.set('view engine', 'ejs');
app.get('/dashboard', verifyToken, (req, res) => {
    const users = req.cookies.username;
    res.sendFile(path.join(__dirname, 'views', 'dashboard.ejs'));
    res.render('dashboard', { users: users });
});

// POST login API
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
            expiresIn: '24h',
        });
        res.cookie("token", token);
        res.cookie('username', username, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});


// POST logout API
app.get('/logout', async (req, res) => {
    res.clearCookie('token');
    res.clearCookie('username');
    res.redirect('/login');
});


// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');

    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        if (decoded && decoded.userId) {
            req.userId = decoded.userId;
        } else {
            return res.redirect('/login');
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// app.get('/', verifyToken, (req, res) => {
//     res.status(200).json({ message: 'Protected route accessed' });
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
