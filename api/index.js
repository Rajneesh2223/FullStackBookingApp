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
const app = express();
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const { extname } = require('path');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'rajefsaeiubf';
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Connect to MongoDB once
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

// Define getUserDataFromReq only once
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) reject(err);  // Changed from throw to reject
      resolve(userData);
    });
  });
}

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));

app.get('/test', (req, res) => {
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
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
  try {
    const userDoc = await User.findOne({email});
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign({
          email: userDoc.email,
          id: userDoc._id,
        }, jwtSecret, {}, (err, token) => {
          if (err) throw err;
          res.cookie('token', token).json(userDoc);
        });
      } else {
        res.status(422).json('pass not ok');
      }
    } else {
      res.status(404).json('user not found');  // Changed status code
    }
  } catch (err) {
    res.status(500).json('server error');
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name, email, _id} = await User.findById(userData.id);
      res.json({name, email, _id});
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {  // Made async
  try {
    const newName = 'photo' + Date.now() + '.jpg';
    const { link } = req.body;
    await imageDownloader.image({
      url: link,
      dest: __dirname + '/uploads/' + newName,  
    });
    res.json(newName);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download image' });
  }
});

const photosMiddleware = multer({dest: 'uploads/'});

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const ext = extname(originalname);
    const newPath = path + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads\\', ''));  // Fixed path separator
  }
  res.json(uploadedFiles);
});

app.post('/places', async (req, res) => {  // Made async
  try {
    const { token } = req.cookies;
    const {
      title, address, photos: addedPhotos, description, price,
      perks, extraInfo, checkIn, checkOut, maxGuests,
    } = req.body;
    
    const userData = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) reject(err);
        resolve(userData);
      });
    });

    const placeDoc = await Place.create({
      owner: userData.id,
      title, address, photos: addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests, price
    });
    res.json(placeDoc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create place' });
  }
});

app.get('/user-places', async (req, res) => {  // Made async
  try {
    const userData = await getUserDataFromReq(req);
    const places = await Place.find({owner: userData.id});
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

app.get('/places/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch place' });
  }
});

app.put('/places', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const {
      id, title, address, addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests, price
    } = req.body;
    
    const placeDoc = await Place.findById(id);
    if (!placeDoc) {
      return res.status(404).json({ error: 'Place not found' });
    }
    
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos: addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price
      });
      await placeDoc.save();
      res.json('ok');
    } else {
      res.status(403).json({ error: 'Not authorized' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update place' });
  }
});

app.get('/places', async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

app.post('/bookings', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const {
      place, checkIn, checkOut, numberOfGuests, name, phone, price,
    } = req.body;
    
    const booking = await Booking.create({
      place, checkIn, checkOut, numberOfGuests, name, phone, price,
      user: userData.id,
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.get('/bookings', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const bookings = await Booking.find({user: userData.id}).populate('place');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});