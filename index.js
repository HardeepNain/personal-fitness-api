import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  if(user.password !== password){
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  res.status(200).json(user)
});

//chat schema
const chatSchema = new Schema({
  chatSessionId: { type: String, required: true },
  role: { type: String, required: true },
  message: { type: String, required: true },
  ChatName: { type: String, required: true }
});

//create chat model
const Chat = mongoose.model("Chat", chatSchema);

app.post("/chat", async (req, res) => {
  const { role, message, chatSessionId, chatName } = req.body;
  let session = chatSessionId;

  if (!session) {
    session = uuidv4();
  }

  const chat = new Chat({
    chatSessionId: session,
    role,
    message,
    chatName
  });
  await chat.save();
  res.status(201).json({
    chatSessionId: session,
    role,
    message,
    chatName
  });
});

app.get("/chat/:chatSessionId", async (req, res) => {
  const chatSessionId = req.params.chatSessionId;

  const chats = await Chat.find({ chatSessionId });
  if (chats.length === 0) {
    return res.status(404).json({ message: 'No chat found with this chat session id' });
  }
  res.status(200).json(chats);
});

app.delete("/chat/:chatSessionId", async (req, res) => {
  const chatSessionId = req.params.chatSessionId;

  const deletedChats = await Chat.deleteMany({ chatSessionId });
  
  res.status(200).json({message:`${deletedChats.deletedCount} messages have been deleted`});
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