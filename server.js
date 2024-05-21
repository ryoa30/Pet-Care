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

const app = express();

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    
// const app = express();

let initialPath = path.join(__dirname, "PetCare/public");

const app = express();

// Serve static files from the 'public' directory
const publicPath = path.join(__dirname, 'PetCare', 'public');
app.use(express.static(publicPath));

app.use(express.static(publicPath));

app.use(bodyParser.json());
// app.use(express.static(initialPath));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(publicPath, 'uploads')); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Use timestamp + original filename
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

app.post('/upload-profile-pic', upload.single('profilePic'), async (req, res) => {
    try {
        const userId = req.body.userId; // Assuming you have a userId associated with the uploaded profile picture
        const profilePicPath = req.file.filename; // Path of the uploaded profile picture

        await db('users').where('id', userId).update({ profile_pic_path: profilePicPath });

        res.status(200).json({ message: 'Profile picture uploaded successfully', path: profilePicPath });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/upload-groom-certificate', upload.single('certificate'), async (req, res) => {
    try {
        // Get user id from the request body
        const userId = req.body.userId;
        
        // Create a new groomer and associate it with the user
        const newGroomerId = await db('groomers').insert({
            userid: userId,
            certificate_path: req.file.filename,
            description: "-",
            price: 0
        }).returning('id');
        console.log("masuk");
        await db('users')
            .where('id', userId)
            .update({
                status: 2
        });

        res.status(200).json({ message: 'Groomer certificate uploaded successfully', groomerId: newGroomerId[0] });
    } catch (error) {
        console.error('Error uploading groomer certificate:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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
app.get('/Groomer', (req, res) =>{
    res.sendFile(path.join(initialPath, "Groomer.html"));
})
app.get('/Vet', (req, res) =>{
    res.sendFile(path.join(initialPath, "Vet.html"));
})
app.get('/BookGroomer', (req, res) =>{
    res.sendFile(path.join(initialPath, "BookGroomer.html"));
})
app.get('/BookVet', (req, res) =>{
    res.sendFile(path.join(initialPath, "BookVet.html"));
})
app.get('/Edit', (req, res) =>{
    res.sendFile(path.join(initialPath, "Editservice.html"));
})

// server.js

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Fetch all groomers with user details
app.get('/api/groomers', async (req, res) => {
    try {
        const groomers = await db.select('groomers.id', 'groomers.description', 'groomers.price', 'groomers.userid', 'groomers.rating', 'groomers.scheduling', 'users.name', 'users.profile_pic_path')
                                 .from('groomers')
                                 .join('users', 'groomers.userid', 'users.id');
        res.json(groomers);
    } catch (error) {
        console.error('Error fetching groomers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch single groomer details
app.get('/api/groomers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const groomer = await db.select('groomers.id', 'groomers.description', 'groomers.price', 'groomers.userid', 'groomers.rating', 'groomers.scheduling', 'users.name', 'users.profile_pic_path')
                                .from('groomers')
                                .join('users', 'groomers.userid', 'users.id')
                                .where('groomers.id', id)
                                .first();
        res.json(groomer);
    } catch (error) {
        console.error('Error fetching groomer details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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
        status: 1,
        profile_pic_path: "Profile-blank.png"
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