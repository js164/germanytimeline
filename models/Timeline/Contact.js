const mongoose=require('mongoose')

const Contact= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    profile:{
        type: String,
    },
    isPublic:{
        type: String,
        default: "Private"
    },
    createdAt:{
        type: Date,
        default:Date.now
    },
})

module.exports=mongoose.model('Contact',Contact)