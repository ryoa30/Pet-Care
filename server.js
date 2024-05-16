const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'password',
        database: 'petcare',
        port: '5432'
    }
})
db.raw('SELECT 1')
  .then(result => {
    console.log('Database connection established!');

    // db('users').select('name').first()
    // .then(result => {
    //     // Access the name property and print it
    //     console.log('First user name:', result.name);
    // })
    // .catch(err => {
    //     console.error('Error fetching user name:', err);
    // });
    
const app = express();

let initialPath = path.join(__dirname, "PetCare/public");

app.use(bodyParser.json());
app.use(express.static(initialPath));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use original filename
    }
});

// app.post('/upload-profile-pic', upload.single('profilePic'), async (req, res) => {
//     try {
//         // Extract necessary information from the request
//         const userId = req.body.userId; // Assuming you have a userId associated with the uploaded profile picture
//         const profilePicPath = req.file.path; // Path of the uploaded profile picture

//         // Update the user's profile picture path in the database
//         await db('users').where('id', userId).update({ profile_pic_path: profilePicPath });

//         res.status(200).json({ message: 'Profile picture uploaded successfully' });
//     } catch (error) {
//         console.error('Error uploading profile picture:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

app.get('/', (req, res) =>{
    res.sendFile(path.join(initialPath, "index.html"));
})

app.get('/login', (req, res) =>{
    res.sendFile(path.join(initialPath, "Login.html"));
})

app.get('/register', (req, res) =>{
    res.sendFile(path.join(initialPath, "register.html"));
})

app.get('/homepage', (req, res) =>{
    res.sendFile(path.join(initialPath, "Homepage.html"));
})

app.get('/profile', (req, res) =>{
    res.sendFile(path.join(initialPath, "profile.html"));
})

app.get('/regisgroom', (req, res) =>{
    res.sendFile(path.join(initialPath, "regisgroom.html"));
})
app.get('/regisvet', (req, res) =>{
    res.sendFile(path.join(initialPath, "regisvet.html"));
})
app.get('/Aboutus', (req, res) =>{
    res.sendFile(path.join(initialPath, "Aboutus.html"));
})
app.get('/Aboutusindex', (req, res) =>{
    res.sendFile(path.join(initialPath, "Aboutusindex.html"));
})

// server.js

// Route to handle updating user data
app.post('/update-user', async (req, res) => {
    const { id, email, name, dob, gender, phone } = req.body;
    try {
        await db('users')
            .where('id', id)
            .update({
                name: name,
                email: email,
                dob: dob,
                gender: gender,
                phone: phone
            });
        res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/register-user', (req, res) => {
    const {name, date, gender, phone, email, password} = req.body;
    console.log("kgkgk");
    console.log(gender);
    db("users").insert({
        name: name,
        email: email,
        password: password,
        dob: date,
        gender: gender,
        phone: phone,
        status: 1
    })
    .returning(["name", "email"])
    .then(data => {
        res.json(data[0])
    })
    .catch(err => {
        if(err.detail.includes('already exists')){
            res.json('email already exists');
        }
    })
})

app.post('/login-user', async (req, res) => {
    const { email, password } = req.body;
    console.log(password);

    db.select('id','name', 'email')
    .from('users')
    .where({
        email: email,
        password: password
    })
    .returning(["id", "name", "email"])
    .then(data => {
        if(data.length){
            res.json(data[0]);
        } else{
            res.json('email or password is incorrect');
        }
    })
})

// server.js

// Add this route to handle fetching user data by name
app.get('/user/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const userData = await db.select('*').from('users').where('name', name).first();
        res.json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(3000, (req, res) => {
    console.log('listening on port 3000....')
})
})
.catch(err => {
  console.error('Database connection failed:', err);
  // Handle the error here (e.g., terminate the application)
  process.exit(1); // Exit with an error code
});