const mongoose=require('mongoose')

const timelineUser= new mongoose.Schema({
    userId:{
        type: String,
        require:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    displayName:{
        type: String,
    },
    username:{
        type: String,
    },
    password:{
        type:String,
    },
    isActive:{
        type: Boolean,
        default: false
    },
    verificationToken:{
        type: String,
    },
    verificationTokenExpiresAt:{
        type : Date
    },
    createdAt:{
        type: Date,
        default:Date.now
    },
})

const User=mongoose.model('timelineUser',timelineUser)
User.createIndexes()
module.exports=User