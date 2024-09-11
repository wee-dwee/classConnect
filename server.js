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
  files: [String], 
  messages: [
    {
      content: {
        type: String,
        required: true,
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      }
    }
  ]
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


app.use(bodyParser.json());


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
app.post("/profiles", upload.single("image"), async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    const imageBuffer = req.file.buffer;
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

    const profile = await Profile.findOneAndUpdate(
      { _id: profileId },
      { name, email, bio },
      { new: true } 
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

app.get("/classes/:profileid", async (req, res) => {
  try {
    const { profileid } = req.params;

    
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
    const classes = await Class.findOne({ _id: classId }).populate("owner");

    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/classes", async (req, res) => {
  try {
    const { name, OwnerUserID, bio, classcode } = req.body;
    const existingClass = await Class.findOne({ classcode });
    if (existingClass) {
      return res
        .status(400)
        .json({ error: "Class with same code already exists" });
    }
    const ownerProfile = await Profile.findById(OwnerUserID);
    if (!ownerProfile) {
      return res.status(404).json({ error: "Owner profile not found" });
    }
    if (!ownerProfile.isInstructor) {
      console.log("Not Authorized to create class:", ownerProfile.email);
      return res.status(403).json({ error: "Not authorized to create class" });
    }
    const newClass = new Class({
      name,
      owner: OwnerUserID,
      bio,
      classcode,
    });
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
    const classObj = await Class.findOne({ classcode });
    if (!classObj) {
      return res.status(404).json({ error: "Class not found" });
    }
    const studentProfile = await Profile.findById(profileId);
    if (!studentProfile) {
      return res.status(404).json({ error: "Student profile not found" });
    }
    if (studentProfile.isInstructor) {
      return res.status(400).json({ error: "You are an instructor" });
    }
    if (classObj.students.includes(profileId)) {
      return res
        .status(400)
        .json({ error: "You are already added to the class" });
    }
    classObj.students.push(profileId);
    await classObj.save();
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
app.post("/unenroll-class", async (req, res) => {
  try {
    const { classId, profileId } = req.body;
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ error: "Class not found" });
    }

    const studentProfile = await Profile.findById(profileId);
    if (!studentProfile) {
      return res.status(404).json({ error: "Student profile not found" });
    }
    if (studentProfile.isInstructor) {
      return res.status(400).json({ error: "Instructors cannot unenroll from classes" });
    }
    if (!classObj.students.includes(profileId)) {
      return res.status(400).json({ error: "You are not enrolled in this class" });
    }
    await Class.findByIdAndUpdate(classId, { $pull: { students: profileId } });
    await Profile.findByIdAndUpdate(profileId, { $pull: { joinedClasses: classId } });

    res.status(200).json({ message: "You have been unenrolled from the class successfully" });
  } catch (error) {
    console.error("Error unenrolling student from class:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/show-classes/:profileId", async (req, res) => {
  try {
    const profileId = req.params.profileId;
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    let classes = [];

    if (profile.isInstructor) {
      classes = await Class.find({ owner: profileId });
    } else {
      classes = await Class.find({ students: profileId }).populate("owner");
    }

    res.status(200).json({ profile, classes });
  } catch (error) {
    console.error("Error retrieving classes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/classes/:classId", async (req, res) => {
  try {
    const { classId } = req.params;
    const deletedClass = await Class.findByIdAndDelete(classId);

    if (!deletedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    
    await Profile.updateMany(
      { $or: [{ joinedClasses: classId }, { _id: deletedClass.owner }] },
      { $pull: { joinedClasses: classId } }
    );

    console.log("Class deleted:", deletedClass);
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/classes/:classId/announcements", async (req, res) => {
  try {
    const classId = req.params.classId;
    const foundClass = await Class.findById(classId)
      .populate({
        path: "announcements",
        populate: {
          path: "messages.sender",
          select: "name email",
        },
      })
      .populate("owner", "name"); 

    if (!foundClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    const announcementsWithClassOwner = foundClass.announcements.map(
      (announcement) => ({
        ...announcement.toObject(),
        classOwner: foundClass.owner.name, 
      })
    );
    
    res.json(announcementsWithClassOwner); 
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post(
  "/classes/:classId/add-announcements",
  upload.array("files"),
  async (req, res) => {
    const classId = req.params.classId;
    const { title, content, createdBy } = req.body; 
    const files = req.files.map((file) => file.originalname); 
    
    try {
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
        files: files,
      };
      const announcement = await Announcement.create(newAnnouncement);
      const updatedClass = await Class.findByIdAndUpdate(
        classId,
        { $push: { announcements: announcement } },
        { new: true }
      ).populate("announcements.createdBy", "name email"); 
      const studentIds = updatedClass.students;
      const owner = await Profile.findById(updatedClass.owner);
      if (!updatedClass) {
        return res.status(404).json({ message: "Class not found" });
      }
      const students = await Profile.find({ _id: { $in: studentIds } });
      const studentEmails = students.map(student => student.email);
      studentEmails.forEach(async (email) => {
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'New Announcement in Your Class',
          text: `Hello,\n\nA new announcement has been posted in your class ${updatedClass.name}.\n\n${content}\n\nRegards,\n${owner.name}`
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
      });

      res.status(201).json(updatedClass); 
    } catch (error) {
      console.error("Error adding announcement:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
app.post('/classes/:classId/announcements/:announcementId/add-message', async (req, res) => {
  try {
    const { classId, announcementId } = req.params;
    const { messageContent } = req.body;

    if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(announcementId)) {
      return res.status(400).json({ error: 'Invalid classId or announcementId' });
    }

    const announcement = await Announcement.findOne({ _id: announcementId });
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    announcement.messages.push({
      content: messageContent,
      sender: req.body.sender,
      createdAt: new Date(),
    });

    await announcement.save();

    const parentClass = await Class.findOne({ _id: classId });
    if (!parentClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const announcementIndex = parentClass.announcements.findIndex(a => a._id.toString() === announcementId);
    if (announcementIndex === -1) {
      return res.status(404).json({ error: 'Announcement not found in class' });
    }

    parentClass.announcements[announcementIndex] = announcement;

    await parentClass.save();

    res.json(announcement); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post("/api/register", async (req, res) => {
  try {
    const { name, username, password, isInstructor } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .send("Username already exists. Please choose a different username.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword, isInstructor });
    await user.save();

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

    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const profile = await Profile.findOne({ email: username });
    const profileId = profile._id;
    const token = jwt.sign({ userId: user._id, username }, "secret-key", {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ user, profileId, username: profile.email });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, "secret-key");
    const userId = decoded.username;
    const profile = await Profile.findOne({ username: userId });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/update-password", async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
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
          .json({ error: "Failed to send OTP. Please try again." }); 
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "OTP sent successfully", otp: otp }); 
      }
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


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
app.get('/classes/:classId/students', async (req, res) => {
  const classId = req.params.classId;
  
  try {
    
    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const studentIds = classData.students; 
    const studentNames = [];

    
    for (const studentId of studentIds) {
      
      console.log(studentId);
      const user = await Profile.findById(studentId);
      if (user) {
        studentNames.push(user.name); 
      }
    }

    res.json(studentNames);
  } catch (error) {
    console.error('Error fetching class data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
