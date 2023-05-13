const express = require('express');
var cors = require('cors'); //communicate with client
const { default: mongoose } = require('mongoose');
const User = require('./models/User'); //alias of UserModel
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); //read cookies

require('dotenv').config();

const app = express();

/* middlewares */
app.use(express.json()); //parse json data
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  }),
);
app.use(cookieParser()); //read cookies

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

app.listen(4000);
