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

app.post('/register-vet', upload.fields([
    { name: 'ijazah', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
    { name: 'izinpraktek', maxCount: 1 }
]), async (req, res) => {
    try {
        // Extract file paths from req.files object
        const ijazahPath = req.files['ijazah'][0].filename;
        const certificatePath = req.files['certificate'][0].filename;
        const izinPraktekPath = req.files['izinpraktek'][0].filename;
        const userId = req.body.userId;

        // Insert the paths into the database
        const vetId = await db('vets').insert({
            description: "-",
            scheduling: "-",
            price: 0,
            userid: userId,
            certificate_path: certificatePath,
            ijazah_path: ijazahPath,
            izin_path: izinPraktekPath
        }).returning('id');

        await db('users')
            .where('id', userId)
            .update({
                status: 3
        });

        res.status(200).json({ message: 'Veterinarian registered successfully', vetId: vetId[0] });
    } catch (error) {
        console.error('Error registering veterinarian:', error);
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
app.get('/LiveChat', (req, res) =>{
    res.sendFile(path.join(initialPath, "LiveChat.html"));
})
app.get('/OrderHistory', (req, res) =>{
    res.sendFile(path.join(initialPath, "Orderlist.html"));
})
app.get('/transaction', (req, res) =>{
    res.sendFile(path.join(initialPath, "transaction.html"));
})

app.post('/api/bookgroomer', async (req, res) => {
    const { groomerId, userId, selectedTime, selectedSize, calendar, address, note, price } = req.body;

    try {
        // Check if there is an existing booking with the same time, date, and vetId
        const existingBooking = await db('groomerbookings')
            .where({
                groomerid: groomerId,
                servicetime: selectedTime,
                servicedate: calendar
            })
            .first();

        if (existingBooking) {
            // There is a conflicting booking
            return res.json({ success: false, message: 'Time slot already booked.' });
        }

        // Insert the new booking into the vetbookings table
        await db('groomerbookings').insert({
            groomerid: groomerId,
            userid: userId,
            servicetime: selectedTime,
            servicedate: calendar,
            animalsize: selectedSize,
            customeraddress: address,
            servicenote: note,
            price: price
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/bookvet', async (req, res) => {
    const { vetId, userId, selectedTime, calendar, address, note, price } = req.body;

    try {
        // Check if there is an existing booking with the same time, date, and vetId
        const existingBooking = await db('vetbookings')
            .where({
                vetid: vetId,
                servicetime: selectedTime,
                servicedate: calendar
            })
            .first();

        if (existingBooking) {
            // There is a conflicting booking
            return res.json({ success: false, message: 'Time slot already booked.' });
        }

        // Insert the new booking into the vetbookings table
        await db('vetbookings').insert({
            vetid: vetId,
            userid: userId,
            servicetime: selectedTime,
            servicedate: calendar,
            customeraddress: address,
            servicenote: note,
            price: price
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// server.js
// Endpoint to fetch joined data from groomerbookings, groomers, and users
app.get('/api/groomerbookings/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const data = await db
            .select(
                'groomerbookings.price', 
                'groomerbookings.servicetime', 
                'groomerbookings.servicedate', 
                'groomerbookings.servicenote', 
                'groomerbookings.animalsize', 
                'groomerbookings.status', 
                'users.name',
                'groomerbookings.groomerid',
                'groomerbookings.id'
            )
            .from('groomerbookings')
            .join('groomers', 'groomerbookings.groomerid', 'groomers.id')
            .join('users', 'groomers.userid', 'users.id')
            .where('groomerbookings.userid', userId);

        res.json(data);
    } catch (error) {
        console.error('Error fetching joined data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/groomerbookingPay/:bookingId', async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const data = await db
            .select(
                'groomerbookings.price', 
                'groomerbookings.servicedate', 
                'groomerbookings.servicetime',
                'users.name as customerName'
            )
            .from('groomerbookings')
            .join('groomers', 'groomerbookings.groomerid', 'groomers.id')
            .join('users', 'groomerbookings.userid', 'users.id')
            .where('groomerbookings.id', bookingId)
            .first();

        if (!data) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const today = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD

        res.json({ ...data, today });
    } catch (error) {
        console.error('Error fetching joined data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/vetbookingPay/:bookingId', async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const data = await db
            .select(
                'vetbookings.price', 
                'vetbookings.servicedate', 
                'vetbookings.servicetime',
                'users.name as customerName'
            )
            .from('vetbookings')
            .join('vets', 'vetbookings.vetid', 'vets.id')
            .join('users', 'vetbookings.userid', 'users.id')
            .where('vetbookings.id', bookingId)
            .first();

        if (!data) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const today = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD

        res.json({ ...data, today });
    } catch (error) {
        console.error('Error fetching joined data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/vetbookings/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const data = await db
            .select(
                'vetbookings.price', 
                'vetbookings.servicetime', 
                'vetbookings.servicedate', 
                'vetbookings.servicenote', 
                'vetbookings.status', 
                'users.name',
                'vetbookings.vetid',
                'vetbookings.id'
            )
            .from('vetbookings')
            .join('vets', 'vetbookings.vetid', 'vets.id')
            .join('users', 'vets.userid', 'users.id')
            .where('vetbookings.userid', userId);

        res.json(data);
    } catch (error) {
        console.error('Error fetching joined data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/api/vets', async (req, res) => {
    try {
        const vets = await db.select('vets.id', 'vets.description', 'vets.price', 'vets.userid', 'vets.rating', 'vets.scheduling', 'users.name', 'users.profile_pic_path')
                                 .from('vets')
                                 .join('users', 'vets.userid', 'users.id');
        res.json(vets);
    } catch (error) {
        console.error('Error fetching vets:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/vets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const groomer = await db.select('vets.id', 'vets.description', 'vets.price', 'vets.userid', 'vets.rating', 'vets.scheduling', 'users.name', 'users.profile_pic_path')
        .from('vets')
        .join('users', 'vets.userid', 'users.id')
        .where('vets.id', id)
        .first();
        const schedules = await db.select('availibletime')
        .from('vetschedule')
        .where('vetid', id);
        
        res.json({ ...groomer, schedules });
    } catch (error) {
        console.error('Error fetching groomer details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/vetschedule/:vetid', async (req, res) => {
    try {
        const { vetid } = req.params;
        const schedules = await db.select('availibletime')
        .from('vetschedule')
        .where('vetid', vetid);
        res.json(schedules);
    } catch (error) {
        console.error('Error fetching groomers schedule:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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
        const schedules = await db.select('availibletime')
        .from('groomerschedule')
        .where('groomerid', id);
        
        res.json({ ...groomer, schedules });
    } catch (error) {
        console.error('Error fetching groomer details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/groomers/:id/rate', async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
  
    try {
      // Fetch current rating and custcount
      const groomer = await db.select('rating', 'custcount')
        .from('groomers')
        .where('id', id)
        .first();
  
      if (!groomer) {
        return res.status(404).json({ error: 'Groomer not found' });
      }
  
      // Calculate new rating
      const currentRating = parseFloat(groomer.rating);
        const newRating = parseFloat(rating);
  
        // Calculate new rating
        const newCustCount = groomer.custcount + 1;
        const updatedRating = ((currentRating * groomer.custcount) + newRating) / newCustCount;
  
      // Update groomer's rating and custcount
      await db('groomers')
        .where('id', id)
        .update({
          rating: updatedRating,
          custcount: newCustCount
        });
  
      res.json({ success: true, message: 'Rating submitted successfully' });
    } catch (error) {
      console.error('Error updating groomer rating:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  app.post('/api/vets/:id/rate', async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
  
    try {
        // Fetch current rating and custcount
        const vet = await db.select('rating', 'custcount')
            .from('vets')
            .where('id', id)
            .first();
  
        if (!vet) {
            return res.status(404).json({ error: 'Vet not found' });
        }
  
        // Convert the rating to a float
        const currentRating = parseFloat(vet.rating);
        const newRating = parseFloat(rating);
  
        // Calculate new rating
        const newCustCount = vet.custcount + 1;
        const updatedRating = ((currentRating * vet.custcount) + newRating) / newCustCount;
        
        console.log(updatedRating);
        // Update vet's rating and custcount
        await db('vets')
            .where('id', id)
            .update({
                rating: updatedRating.toFixed(1), // Keep one decimal place
                custcount: newCustCount
            });
  
        res.json({ success: true, message: 'Rating submitted successfully' });
    } catch (error) {
        console.error('Error updating vet rating:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

  
  app.patch('/api/groomerbookings/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      // Update booking status
      await db('groomerbookings')
        .where('id', id)
        .update({ status });
  
      res.json({ success: true, message: 'Booking status updated successfully' });
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  app.patch('/api/vetbookings/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      // Update booking status
      await db('vetbookings')
        .where('id', id)
        .update({ status });
  
      res.json({ success: true, message: 'Booking status updated successfully' });
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

app.get('/api/groomerschedule/:groomerid', async (req, res) => {
    try {
        const { groomerid } = req.params;
        const schedules = await db.select('availibletime')
        .from('groomerschedule')
        .where('groomerid', groomerid);
        res.json(schedules);
    } catch (error) {
        console.error('Error fetching groomers schedule:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/vetsedit/:userid', async (req, res) => {
    try {
        const { userid } = req.params;
        const vets = await db.select('vets.id', 'vets.description', 'vets.price', 'vets.scheduling')
                                .from('vets')
                                .join('users', 'vets.userid', 'users.id')
                                .where('users.id', userid)
                                .first();
        res.json(vets);
    } catch (error) {
        console.error('Error fetching vets:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/groomersedit/:userid', async (req, res) => {
    try {
        const { userid } = req.params;
        const groomer = await db.select('groomers.id', 'groomers.description', 'groomers.price', 'groomers.scheduling')
                                .from('groomers')
                                .join('users', 'groomers.userid', 'users.id')
                                .where('users.id', userid)
                                .first();
                                res.json(groomer);
                            } catch (error) {
                                console.error('Error fetching groomers:', error);
                                res.status(500).json({ error: 'Internal server error' });
    }
});


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

app.post('/updatevet-servicedetail', async (req, res) => {
    const { id, description, scheduling, price } = req.body;
    try {
        await db('vets')
        .where('id', id)
        .update({
                description: description,
                scheduling: scheduling,
                price: price
            });
        res.status(200).json({ message: 'vet information updated successfully' });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/updateVetSchedule', async (req, res) => {
    const { vetId, selectedTimes, notSelectedTimes } = req.body;

    try {
        // Delete not selected times
        if (notSelectedTimes.length > 0) {
            await db('vetschedule')
                .where('vetid', vetId)
                .whereIn('availibletime', notSelectedTimes)
                .del();
        }

        // Get existing times for the groomer
        const existingTimes = await db('vetschedule')
            .where('vetid', vetId)
            .select('availibletime');

        // Convert existing times to a Set for quick lookup
        const existingTimesSet = new Set(existingTimes.map(time => time.availibletime));

        // Filter selected times to get only new times that don't exist in the database
        const timesToAdd = selectedTimes.filter(time => !existingTimesSet.has(time));

        // Insert new selected times
        if (timesToAdd.length > 0) {
            const values = timesToAdd.map(time => ({
                vetid: vetId,
                availibletime: time
            }));
            await db('vetschedule').insert(values);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating groomer schedule:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/updategroomer-servicedetail', async (req, res) => {
    const { id, description, scheduling, price } = req.body;
    try {
        await db('groomers')
        .where('id', id)
        .update({
                description: description,
                scheduling: scheduling,
                price: price
            });
        res.status(200).json({ message: 'groomer information updated successfully' });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add this new route to handle updating groomer schedules
app.post('/api/updateGroomerSchedule', async (req, res) => {
    const { groomerId, selectedTimes, notSelectedTimes } = req.body;

    try {
        // Delete not selected times
        if (notSelectedTimes.length > 0) {
            await db('groomerschedule')
                .where('groomerid', groomerId)
                .whereIn('availibletime', notSelectedTimes)
                .del();
        }

        // Get existing times for the groomer
        const existingTimes = await db('groomerschedule')
            .where('groomerid', groomerId)
            .select('availibletime');

        // Convert existing times to a Set for quick lookup
        const existingTimesSet = new Set(existingTimes.map(time => time.availibletime));

        // Filter selected times to get only new times that don't exist in the database
        const timesToAdd = selectedTimes.filter(time => !existingTimesSet.has(time));

        // Insert new selected times
        if (timesToAdd.length > 0) {
            const values = timesToAdd.map(time => ({
                groomerid: groomerId,
                availibletime: time
            }));
            await db('groomerschedule').insert(values);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating groomer schedule:', error);
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
    // console.log("kgkgk");
    // console.log(gender);
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
    // console.log(password);

    db.select('id','name', 'email', 'status')
    .from('users')
    .where({
        email: email,
        password: password
    })
    .returning(["id", "name", "email", "status"])
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



app.listen(3000, (req, res) => {
    console.log('listening on port 3000....')
})
})
.catch(err => {
  console.error('Database connection failed:', err);
  // Handle the error here (e.g., terminate the application)
  process.exit(1); // Exit with an error code
});