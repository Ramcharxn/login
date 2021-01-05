const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

// User model
const User = require('../models/User')

//Login
router.get('/login',(req,res)=> res.render('login'))

//Register
router.get('/register',(req,res)=> res.render('register'))

//Regisrter handle
router.post('/register',(req,res)=>{
    const {name, email, password, password2} = req.body
    let errors = [];

    // Check Required fields
    if(!name || !email || !password || !password2){
        errors.push({msg:'PLease fill all fields'})
    }

    // Check pass match
    if(password != password2){
        errors.push({msg:'Password does not match'})
    }

    // Check pass Length
    if(password.length < 6){
        errors.push({msg:'password must be at least 6 characters'})
    }
    if(errors.length > 0 ) {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        //validation passed
        User.findOne({ email: email })
        .then(user => {
            if(user) {
                // User exist
                errors.push({msg:'Email already registered'})
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2 
                })
            }
            else{
                const newUser = new User({
                    name,
                    email,
                    password,
                    password2
                })
                //hash
                bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    //set pass to hashed
                    newUser.password = hash;
                    //save user
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg','you are now registered and can login ')
                        res.redirect('/users/login')
                    })
                    .catch(err => console.log(err))
                }))
            }
        })
    }
})

// Login Handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
})

// Logout handles
router.get('/logout', (req,res)=>{
    req.logout()
    req.flash('success_msg','you are logged out')
    res.redirect('/users/login')
})

module.exports = router;