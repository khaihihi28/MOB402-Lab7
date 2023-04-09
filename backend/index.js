const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { engine } = require('express-handlebars');
const bodyParser = require("body-parser");


//connect đến mongodb
const connectDB = require('./config/db');

//import routes
const authRoute = require('./ROUTES/auth');
const userRoute = require('./ROUTES/user');
const bookRoute = require('./ROUTES/book');

const app = express()

//connect đến mongodb
connectDB();

//bodyparser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//cấu hình pug, handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', '../frontend/views')

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//ROUTES
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/book', bookRoute);

app.get('/', (req, res) => {
    res.render('home');
});

const port = 3000
app.listen(port, () => console.log(`server is running ${port}!`))

