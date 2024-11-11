const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User =require('./models/User.js')
const Place =require('./models/Place.js')
const Booking = require('./models/Booking.js'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const imageDownloader = require('image-downloader');
const multer  = require('multer')
const fs = require('fs');
const { extname } = require('path');



const bcryptSalt =bcrypt.genSaltSync(10);
const jwtSecret = 'rajefsaeiubf';
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server after successful database connection
    app.listen(4000, () => {
      console.log('Server is running on http://localhost:4000');
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
  function getUserDataFromReq(req){
    return new Promise((resolve,reject) => {
      jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
        if(err) throw err;
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

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}



app.post('/register', async (req, res) => {
    const {name,email,password} = req.body;

    try {
      const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
      });
      res.json(userDoc);
    } catch (e) {
      res.status(422).json(e);
    }
  
  });

  

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id,
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});



app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
          if (err) throw err;
          const {name,email,_id}=await User.findById(userData.id);
          res.json({name,email,_id});
        });

      } else {
        res.json(null);
      }
 });

 app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true);
});

app.post('/upload-by-link', (req, res) => {
  const newName = 'photo' + Date.now() + '.jpg';
  const { link } = req.body;

  imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName,  
  });

  res.json(newName);
});
const photosMiddleware = multer({dest:'uploads/'});

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const ext = extname(originalname);  // Get the file extension
    const newPath = path + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads/', ''));
  }
  res.json(uploadedFiles);
});


app.post('/places',(req, res) => {
  const { token } = req.cookies;
  const {
    title,address,photos:addedPhotos,description,price,
    perks,extraInfo,checkIn,checkOut,maxGuests,
  } = req.body;
  
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
  const placeDoc= await Place.create({
      owner:userData.id,
      title,address,photos:addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,price

    })
    res.json(placeDoc);
  });
   
});

app.get('/user-places',(req,res)=>{
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id}=userData;
    res.json( await Place.find({owner:id}));

  });
})

app.get('/places/:id',async (req, res) => {
  const {id} = req.params;
  res.json( await Place.findById(id))
  
})

app.put('/places', async (req,res) => {
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/places' ,async (req,res) => {
  res.json(await Place.find());
})
  
app.post('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
  } = req.body;
  Booking.create({
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});



app.get('/bookings', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place') );
});


// we will install bcrypt to store the password in ecnvrypted format 