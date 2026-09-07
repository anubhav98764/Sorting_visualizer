const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://singhanubhav00013_db_user:Anubhav2026@cluster0.zcfarae.mongodb.net/3d_sort_db?appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas: 3d_sort_db'))
  .catch(err => console.error('Database connection error:', err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: {type:Date, required:true},
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// REGISTER ROUTE
app.post('/api/register', async (req, res) => {
  console.log('RECEIVED REGISTER DATA:', req.body);

  try {
    const { name, email, password,dob } = req.body;

    if (!name || !email || !password || !dob) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const newUser = new User({ name, email, password,dob });
    await newUser.save();

    console.log('USER SAVED TO MONGODB ATLAS!');
    res.status(201).json({ message: 'User created successfully', user: newUser });

  } catch (err) {
    console.error('SERVER ERROR WHEN SAVING USER:', err);
    res.status(500).json({ error: 'Failed to create user in database.' });
  }
});

// LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  console.log('RECEIVED LOGIN DATA:', req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(5000, () => console.log('Backend server running on port 5000'));