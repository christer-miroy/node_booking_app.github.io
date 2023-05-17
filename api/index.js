const express = require('express');
var cors = require('cors'); //communicate with client
const { default: mongoose } = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); //read cookies
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs'); //rename files on the server

/* import models */
const User = require('./models/User'); //alias of UserModel
const Place = require('./models/Place'); //place model

require('dotenv').config();

const app = express();

/* middlewares */
app.use(express.json()); //parse json data
app.use(cookieParser()); //read cookies
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  }),
);

//connect to database
mongoose.connect(process.env.MONGO_URL);

//password encryption
const bcryptSalt = bcrypt.genSaltSync(10);

//secret data for jwt
const jwtSecret = 'ijgpbajr6952165gqswd725pinemnqiemc';

//test
app.get('/test', async (req, res) => {
  res.json('test ok');
});

/* register user endpoint */
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //newly created user
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(user);
  } catch (e) {
    res.status(422).json(e);
  }
});

/* login user endpoint */
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  //find user via email
  const userDoc = await User.findOne({ email });

  //existing email check
  if (userDoc) {
    //if true, password check
    const passwordOk = bcrypt.compareSync(password, userDoc.password);
    if (passwordOk) {
      //if true, login user
      //create token (using json web token)
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          //callback function
          if (err) throw err;
          res.cookie('token', token).json(userDoc);
        },
      );
    } else {
      res.status(422).json('password not okay');
    }
  } else {
    res.json('not found');
  }
});

/* user profile endpoint */
app.get('/profile', (req, res) => {
  //get request headers cookie
  const { token } = req.cookies;
  if (token) {
    //decrypt token with secret salt key
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      //get id from userData
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

//logout endpoint
app.post('/logout', (req, res) => {
  //reset cookie
  res.cookie('token', '').json(true);
});

//upload image from link endpoint
app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body; //grab link
  const newName = 'photo' + Date.now() + '.jpg'; //change name

  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName, //destination
  });

  res.json(newName);
});

//define upload functionality
const photosMiddleware = multer({ dest: 'uploads/' });

//upload photos from file (install multer)
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  //create an array of uploaded files
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    //grab extension name of the file
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];

    //get path of the specific file (require fs)
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    //add to uploadedFiles array
    uploadedFiles.push(newPath.replace('uploads\\', ''));
  }
  res.json(uploadedFiles);
});

/* add new place/accommodation */
app.post('/places', (req, res) => {
  //get the logged in user data
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuest,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id, //logged-in id == owner
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuest,
    });

    res.json(placeDoc);
  });
});

/* display all places */
app.get('/places', (req, res) => {
  //get the user details
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    //get the user id
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.listen(4000);
