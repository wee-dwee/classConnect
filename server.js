const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const uri = process.env.URI;
const app = express();
const multer  = require('multer');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3002;

app.use(
  cors({
    origin:true,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  bio: String,
  image: String,
});

const Profile = mongoose.model('Profile', profileSchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isInstructor:Boolean,
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  },
});

const User = mongoose.model('User', userSchema);

// Get all profiles
app.use(bodyParser.json());

// Set up multer for handling file uploads
const storage = multer.memoryStorage(); // You can adjust storage settings as needed
const upload = multer({ storage: storage });

// Create a new profile with an image
app.post('/profiles', upload.single('image'), async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    const imageBuffer = req.file.buffer;

    // Here you can save the image to your preferred storage solution (e.g., AWS S3, Firebase Storage)
    // For simplicity, we are just encoding the image buffer as base64 and storing it in the database
    const image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

    
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/profiles', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific profile by ID
app.get('/profiles/:username', async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.username });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, username, password, isInstructor } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists. Please choose a different username.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ username, password: hashedPassword, isInstructor });
    await user.save();

    // Save profile
    const newProfile = new Profile({ name, email: username,bio:`Hi there i am using classconnect` });
    await newProfile.save();

    res.status(200).send('User registered successfully and profile created!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering new user or creating profile');
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    // If user doesn't exist or password doesn't match, return error
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Find user profile
    const profile = await Profile.findOne({ email: username });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username }, 'secret-key', { expiresIn: '1h' });

    // Set cookie with token
    res.cookie('token', token, { httpOnly: true }).json({ user, profile });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Profile API
app.get('/api/profile', async (req, res) => {
  try {
    // Check if token is present in cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify token
    const decoded = jwt.verify(token, 'secret-key');
    const userId = decoded.username;

    // Find user profile using userId
    const profile = await Profile.findOne({ username: userId });

    // If profile not found, return error
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Return profile data
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/api/update-password', async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});



app.post('/api/send-otp', async (req, res) => {
  const { username } = req.body; 
  
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      },
      secure: false
    });
    
    const mailOptions = {
      from: process.env.EMAIL,
      to: username,
      subject: 'OTP for Password Reset',
      text: `Your OTP for password reset is ${otp}`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send OTP. Please try again.' }); // Send error response if email fails
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'OTP sent successfully', otp: otp }); // Send success response with OTP
      }
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Update profile by username
app.put('/editprofile/:username', async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    const username = req.params.username;

    // Find the user's profile by username
    const profile = await Profile.findOneAndUpdate(
      { email: username },
      { name, email, bio },
      { new: true } // Return the updated document
    );

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { otp, mailOTP } = req.body;
  try {
    if (otp === mailOTP) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/upload-image', async (req, res) => {
  try {
    const { username, image } = req.body;

    // Find the profile by email (username) and update its image
    const profile = await Profile.findOneAndUpdate(
      { email: username },
      { image: image },
    );

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.json({ message: 'Image updated successfully', profile });
  } catch (error) {
    console.error('Error updating image:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
