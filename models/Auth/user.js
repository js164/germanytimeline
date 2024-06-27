const mongoose=require('mongoose')

const timelineUser= new mongoose.Schema({
    googleID:{
        type: String,
        default:JSON.stringify(Date.now),
    },
    userId:{
        type: String,
        require:true
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
    image:{
        type: String,
    },
    createdAt:{
        type: Date,
        default:Date.now
    },
})

const User=mongoose.model('timelineUser',timelineUser)
User.createIndexes()
module.exports=User