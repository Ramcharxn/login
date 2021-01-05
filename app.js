const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express();

// Passport Config
require('./config/passport')(passport)

//bodyParse
app.use(express.urlencoded({extended:false}))

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized:true,
}))

//Passport MiddleWare
app.use(passport.initialize())
app.use(passport.session())

//connect flash
app.use(flash())

// Global vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//EJS
app.use(expressLayouts)
app.set('view engine','ejs')

//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/user'))

const PORT = process.env.PORT || 3000

app.listen(PORT,console.log(PORT))