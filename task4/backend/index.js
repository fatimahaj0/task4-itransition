const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.router.js");
const cookieParser = require('cookie-parser');
const path = require('path');
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use('/', userRouter);

const clientDistPath = path.resolve(__dirname, 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
