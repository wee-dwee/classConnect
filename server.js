const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const uri = "mongodb+srv://dweej26:test123@cluster0.wgtewyq.mongodb.net/";
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


const User = mongoose.model('User', {
  username: String,
  password: String,
});
const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  bio: String,
  image: String,
});
const Profile = mongoose.model('Profile', profileSchema);
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

    const newProfile = await Profile.create({ username, email, bio, image });
    res.json(newProfile);
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
app.get('/profiles/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a profile by ID
app.put('/profiles/:id', async (req, res) => {
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a profile by ID
app.delete('/profiles/:id', async (req, res) => {
  try {
    await Profile.findByIdAndDelete(req.params.id);
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, password: hashedPassword });

  user.save()
  .then(() => {
    //console.log(user.username);
    res.status(200).send('User registered successfully');
    
  })
  .catch((err) => {
    res.status(500).send('Error registering new user');
  });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      //console.log("User not found");
      return res.status(401).send('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      //console.log("invalid")
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ username }, 'secret-key', { expiresIn: '1h' });
    //res.json({ token });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
