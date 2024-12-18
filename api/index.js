const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const app = express();


const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'rajefsaeiubf';
const TOKEN_EXPIRATION = '24h';


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware setup
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(uploadsDir));

// CORS Configuration
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

// Helper Functions
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const { token } = req.cookies;
    if (!token) {
      reject(new Error('No token provided'));
      return;
    }
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

// Database connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(4000, () => {
      console.log('Server is running on http://localhost:4000');
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// File Upload Configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const photosMiddleware = multer({ storage });

app.get('/test', (req, res) => {
  res.json('test ok');
});

// Authentication Routes
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          
          // Include the token in the JSON response
          res.cookie('token', token).json({
            user: userDoc,
            token: token 
          });
        }
      );
    } else {
      res.status(422).json('Password is incorrect');
    }
  } else {
    res.status(404).json('User not found');
  }
});


app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  console.log(req.cookies)
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

// File Upload Routes
app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  try {
    await imageDownloader.image({
      url: link,
      dest: path.join(uploadsDir, newName),
    });
    res.json(newName);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download image' });
  }
});

app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  const uploadedFiles = [];
  for (let file of req.files) {
    uploadedFiles.push(file.filename);
  }
  res.json(uploadedFiles);
});

// Places Routes
app.post('/places', async (req, res) => {
  const { token } = req.cookies;
  const {
    title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title, address, photos:addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests, price,
    });
    res.json(placeDoc);
  });
});

app.get('/user-places', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;
    res.json(await Place.find({ owner:id }));
  });
});

app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
  const { token } = req.cookies;
  const {
    id, title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos:addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/places', async (req, res) => {
  res.json(await Place.find());
});

// Booking Routes
app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const {
    place, checkIn, checkOut, numberOfGuests, name, phone, price,
  } = req.body;
  Booking.create({
    place, checkIn, checkOut, numberOfGuests, name, phone, price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});

app.get('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place') );
});

