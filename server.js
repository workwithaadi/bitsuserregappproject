const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for parsing application/json
app.use(express.static("public"));

//const MONGO_URL = "mongodb://bitsuserregappproject:64gEFIwn1tbnbxXviKqDm9TMCj2G0fBGWMjfrOUwGeTvi257gSCAezqkc6m6mrTn7JzLZb50R5GNACDb993aug==@bitsuserregappproject.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@bitsuserregappproject@";
const MONGO_URL = "mongodb://admin:admin@192.168.49.2:27017"
const client = new MongoClient(MONGO_URL);

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
    const userObj = req.body;
    try {
        await client.connect();
        const db = client.db("userdb");
        const data = await db.collection("users").insertOne(userObj);
        console.log("Data inserted:", data.insertedId);
        res.status(200).send("User added successfully");
    } catch (err) {
        res.status(500).send("Error inserting user");
    } finally {
        await client.close();
    }
});

// ✅ POST login API
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        await client.connect();
        const db = client.db("userdb");
        const user = await db.collection("users").findOne({ username, password });

        if (user) {
            res.status(200).send("Login successful");
        } else {
            res.status(401).send("Invalid username or password");
        }
    } catch (err) {
        res.status(500).send("Login error");
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
