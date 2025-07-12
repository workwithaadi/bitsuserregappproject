const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const PORT = 5050;
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for parsing application/json
app.use(express.static("public"));

//Azure Mongo url
//const MONGO_URL = "mongodb://bitsuserregappproject:64gEFIwn1tbnbxXviKqDm9TMCj2G0fBGWMjfrOUwGeTvi257gSCAezqkc6m6mrTn7JzLZb50R5GNACDb993aug==@bitsuserregappproject.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@bitsuserregappproject@";
const MONGO_URL = "mongodb://admin:admin@localhost:27017/userdb?authSource=admin";
mongoose.connect(MONGO_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

//Create a user schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
});

const User = mongoose.model('User', userSchema);


// GET all users
app.get("/getUsers", async (req, res) => {
    try {
        await client.connect();
        const db = client.db("userdb");
        const data = await db.collection("users").find({}).toArray();
        res.send(data);
    } catch (err) {
        res.status(500).send("Error fetching users");
    } finally {
        await client.close();
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

// POST login API
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            res.send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
