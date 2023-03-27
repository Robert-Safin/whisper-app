import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './database.js'


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs')


app.listen(3000, () => {
  console.log('Server started on port 3000...');
});


connectDB()






app.get("/", async(req, res) => {
  try {
  res.render('home')
  } catch(error) {
    console.log(error);
  }
});

app.get("/login", async(req, res) => {
  try {
  res.render('login')
  } catch(error) {
    console.log(error);
  }
});

app.get("/register", async(req, res) => {
  try {
  res.render('register')
  } catch(error) {
    console.log(error);
  }
});
