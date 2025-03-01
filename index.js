// Suggested code may be subject to a license. Learn more: ~LicenseLog:1037282693.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:184618879.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:4174825624.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:659788713.
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Schema } from 'mongoose';

dotenv.config();

const app = express();
app.use(express.json());

//create user schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

//create user model
const User = mongoose.model("User", userSchema);

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user.save()
  res.status(201).json(user)
});


// MongoDB connection URI
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});


const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});