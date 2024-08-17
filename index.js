const express=require('express')
const app=express()
const passport=require('passport')
require('./passport.js')(passport)
const dotenv=require('dotenv').config()
const mongoose=require('mongoose')
const session=require('express-session')
const MongoStore=require('connect-mongo')
const cors = require('cors');
app.use(cors({
    origin: '*'
}));


app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store:MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
  }))

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth',require('./routes/Auth/signup'))
app.use('/university',require('./routes/Timeline/university'))
app.use('/aps',require('./routes/Timeline/APS'))
app.use('/visa',require('./routes/Timeline/Visa'))

port=process.env.PORT || 8000
const connectDB=require('./db')
connectDB()


app.listen(port,
    console.log(`server started on port ${port}`)
)
