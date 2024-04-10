const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const uri = process.env.URI;
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const PORT = process.env.PORT || 3002;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

//--------------------------------------------------SCHEMAS DEFINED HERE--------------------------------------------------

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isInstructor: Boolean,
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
});
const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  bio: String,
  image: String,
  isInstructor: Boolean,
  joinedClasses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
});

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  files: [String], // Array of strings named 'files'
});

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
});

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  bio: String,
  classcode: {
    type: String,
    required: true,
    unique: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
  ],
  announcements: [announcementSchema],
  assignments: [assignmentSchema],
});

const User = mongoose.model("User", userSchema);
const Profile = mongoose.model("Profile", profileSchema);
const Class = mongoose.model("Class", classSchema);
const Announcement = mongoose.model("Announcement", announcementSchema);
const Assignment = mongoose.model("Assignment", assignmentSchema);

// Get all profiles
app.use(bodyParser.json());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
}); // You can adjust storage settings as needed
const upload = multer({ storage: storage });
//--------------------------------------------------PROFILE SECTION--------------------------------------------------
// Create a new profile with an image
app.post("/profiles", upload.single("image"), async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    const imageBuffer = req.file.buffer;

    // Here you can save the image to your preferred storage solution (e.g., AWS S3, Firebase Storage)
    // For simplicity, we are just encoding the image buffer as base64 and storing it in the database
    const image = `data:image/png;base64,${imageBuffer.toString("base64")}`;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/profiles", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific profile by ID
app.get("/profiles/:profileId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.profileId });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put("/editprofile/:profileId", async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    const profileId = req.params.profileId;
    console.log(profileId);
    // Find the user's profile by username
    const profile = await Profile.findOneAndUpdate(
      { _id: profileId },
      { name, email, bio },
      { new: true } // Return the updated document
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//--------------------------------------------------CLASS CREATION AND JOINING--------------------------------------------------
app.get("/classes/:profileid", async (req, res) => {
  try {
    const { profileid } = req.params;

    // Assuming you want to find classes owned by a specific user
    const profile_ins = await Profile.find({ _id: profileid });
    const classes = await Class.find({ OwnerUser: profile_ins.email });

    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/classesbyId/:classId", async (req, res) => {
  try {
    const { classId } = req.params;

    // Assuming you want to find classes owned by a specific user
    const classes = await Class.findOne({ _id: classId }).populate("owner");

    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/classes", async (req, res) => {
  try {
    // Extract class details from the request body
    const { name, OwnerUserID, bio, classcode } = req.body;

    // Check if the classcode is unique
    const existingClass = await Class.findOne({ classcode });
    if (existingClass) {
      return res
        .status(400)
        .json({ error: "Class with same code already exists" });
    }

    // Find the profile of the class owner
    const ownerProfile = await Profile.findById(OwnerUserID);
    if (!ownerProfile) {
      return res.status(404).json({ error: "Owner profile not found" });
    }

    // Ensure the owner is authorized to create the class
    if (!ownerProfile.isInstructor) {
      console.log("Not Authorized to create class:", ownerProfile.email);
      return res.status(403).json({ error: "Not authorized to create class" });
    }

    // Create a new class instance
    const newClass = new Class({
      name,
      owner: OwnerUserID,
      bio,
      classcode,
    });

    // Save the new class to the database
    await newClass.save();
    console.log("New class created:", newClass);
    res.status(201).json({ message: "Class created successfully", newClass });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/join-class", async (req, res) => {
  try {
    const { classcode, profileId } = req.body;

    // Find the class by class code
    const classObj = await Class.findOne({ classcode });
    if (!classObj) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Find the student profile by ID
    const studentProfile = await Profile.findById(profileId);
    if (!studentProfile) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    // Check if the user is an instructor
    if (studentProfile.isInstructor) {
      return res.status(400).json({ error: "You are an instructor" });
    }

    // Check if the student is already added to the class
    if (classObj.students.includes(profileId)) {
      return res
        .status(400)
        .json({ error: "You are already added to the class" });
    }

    // Add the student to the class
    classObj.students.push(profileId);
    await classObj.save();

    // Add the class to the student's joinedClasses array
    studentProfile.joinedClasses.push(classObj._id);
    await studentProfile.save();

    res
      .status(200)
      .json({ message: "You are added to the class successfully" });
  } catch (error) {
    console.error("Error adding student to class:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Assuming you're using Express.js

app.get("/show-classes/:profileId", async (req, res) => {
  try {
    const profileId = req.params.profileId;

    // Find the profile
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    let classes = [];

    if (profile.isInstructor) {
      // If the profile is an instructor, find classes taught by the instructor
      classes = await Class.find({ owner: profileId });
    } else {
      // If the profile is a student, find classes joined by the student and populate the owner field
      classes = await Class.find({ students: profileId }).populate("owner");
    }

    res.status(200).json({ profile, classes });
  } catch (error) {
    console.error("Error retrieving classes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//--------------------------------------------------ANNOUNCEMENTS--------------------------------------------------
app.get("/classes/:classId/announcements", async (req, res) => {
  try {
    const classId = req.params.classId;

    // Find the class by its ID and populate the announcements field and owner field
    const foundClass = await Class.findById(classId)
      .populate("announcements.createdBy", "name email") // Populate createdBy field with Profile data
      .populate("owner", "name"); // Populate owner field with Profile data

    if (!foundClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    const {students} = foundClass.students;
    
    // Map over the announcements and add the classOwner name to each announcement object
    const announcementsWithClassOwner = foundClass.announcements.map(
      (announcement) => ({
        ...announcement.toObject(),
        classOwner: foundClass.owner.name, // Add classOwner name to each announcement
      })
    );

    res.json(announcementsWithClassOwner); // Return the announcements along with classOwner name
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to add an announcement to a class
app.post(
  "/classes/:classId/add-announcements",
  upload.array("files"),
  async (req, res) => {
    const classId = req.params.classId;
    const { title, content, createdBy } = req.body; // Extract announcement details from the request body
    const files = req.files.map((file) => file.originalname); // Extract filenames from the request files
    
    try {
      // Create a new announcement object including the filenames
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
        secure: false,
      });
      const newAnnouncement = {
        title,
        content,
        createdBy,
        files: files, // Include the filenames in the announcement object
      };

      // Create a new announcement document in the database
      const announcement = await Announcement.create(newAnnouncement);

      // Find the class by its ID and push the new announcement
      const updatedClass = await Class.findByIdAndUpdate(
        classId,
        { $push: { announcements: announcement } },
        { new: true }
      ).populate("announcements.createdBy", "name email"); // Populate createdBy field with Profile data
      
      const studentIds = updatedClass.students;
      const owner = await Profile.findById(updatedClass.owner);
      if (!updatedClass) {
        return res.status(404).json({ message: "Class not found" });
      }

      // Fetch student documents and extract emails
      const students = await Profile.find({ _id: { $in: studentIds } });
      const studentEmails = students.map(student => student.email);

      // Send email to each student
      studentEmails.forEach(async (email) => {
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'New Announcement in Your Class',
          text: `Hello,\n\nA new announcement has been posted in your class ${updatedClass.name}.\n\n${content}\n\nRegards,\n${owner.name}`
        };
        
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
      });

      res.status(201).json(updatedClass); // Return the updated class with the new announcement
    } catch (error) {
      console.error("Error adding announcement:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
//--------------------------------------------------LOGIN AND REGISTER--------------------------------------------------
app.post("/api/register", async (req, res) => {
  try {
    const { name, username, password, isInstructor } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .send("Username already exists. Please choose a different username.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ username, password: hashedPassword, isInstructor });
    await user.save();

    // Save profile
    const newProfile = new Profile({
      name,
      email: username,
      bio: `Hi there i am using classconnect`,
      isInstructor,
    });
    await newProfile.save();

    res.status(200).send("User registered successfully and profile created!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering new user or creating profile");
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    // If user doesn't exist or password doesn't match, return error
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Find user profile
    const profile = await Profile.findOne({ email: username });
    const profileId = profile._id; // Get profile ID
    console.log(profileId);

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username }, "secret-key", {
      expiresIn: "1h",
    });

    // Set cookie with token
    res.cookie("token", token, { httpOnly: true });

    // Return user data and profile ID
    res.status(200).json({ user, profileId, username: profile.email });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Profile API
app.get("/api/profile", async (req, res) => {
  try {
    // Check if token is present in cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify token
    const decoded = jwt.verify(token, "secret-key");
    const userId = decoded.username;

    // Find user profile using userId
    const profile = await Profile.findOne({ username: userId });

    // If profile not found, return error
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Return profile data
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/update-password", async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});
//--------------------------------------------------FORGET PASSWORD SECTION--------------------------------------------------
app.post("/api/send-otp", async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const otp = Math.floor(1000 + Math.random() * 9000);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      secure: false,
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: username,
      subject: "OTP for Password Reset",
      text: `Your OTP for password reset is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res
          .status(500)
          .json({ error: "Failed to send OTP. Please try again." }); // Send error response if email fails
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "OTP sent successfully", otp: otp }); // Send success response with OTP
      }
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Update profile by username

app.post("/api/verify-otp", async (req, res) => {
  const { otp, mailOTP } = req.body;
  try {
    if (otp === mailOTP) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post(
  "/upload-image/:username",
  upload.single("image"),
  async (req, res) => {
    try {
      const username = req.params.username;
      const image = req.file.filename;

      const profile = await Profile.findOneAndUpdate(
        { email: username },
        { image: image }
      );

      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      return res.json({ message: "Image uploaded successfully", profile });
    } catch (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
app.post("/remove-image/:username", async (req,res)=>{
  try {
    const email = req.params.username;
    const profile = await Profile.findOneAndUpdate(
      { email:email },
      { image:null }
    );
    if (!profile) 
    {
      return res.status(404).json({ error: "Profile not found" });
    }
    return res.json({ message: "Image uploaded successfully", profile });
  } 
  catch (error) {
    console.error("Error removing error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
