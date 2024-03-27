const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  if(!req.body.img)
  {
    req.body.img="https://picsum.photos/200/300";
  }
  const { username, email, password ,img} = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword,img:img });
    
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
   
    res.status(500).json({ error: "Internal server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
   
    if (!user) {
      
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare passwords
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      
      return res.status(401).json({ error: "Invalid username or password" });
    }
    

    // Generate access token
    const accessToken = jwt.sign(
      { id: user._id.ObjectId, isAdmin: user.isAdmin },
      "vishesh",
      { expiresIn: "3d" }
    );

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(200).json({ ...userWithoutPassword, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
