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

const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

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
    const newProfile = new Profile({ name, email: username });
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
app.post('/upload_image/:username',async(req,res)=>{
  try{
      {
        const username = req.params.username;
        const file = req.body.file;
        if (!file) {
          return res.status(400).json({ error: 'No file part in the request' });
        }
        if (!['.jpg', '.jpeg', '.png'].includes(file.originalname.slice(-4).toLowerCase())) {
          return res.status(400).json({ error: 'Unsupported file format. Only .jpg, .jpeg, .png are allowed.' });
        }
        const base64Data = fs.readFileSync(file.path, { encoding: 'base64'});
        const result = await Profile.findOneAndUpdate(
          { email: username },
          { $set: { image: base64Data } }
        )
        if (!result.value) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ success: true, message: 'Image uploaded and user profile updated successfully' });
        } 
    }
  catch(error)
  {
      res.status(500).json({error:error.message});
  }
})
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
