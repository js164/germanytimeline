const mongoose=require('mongoose')

const APSTimeline= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    appliedDate:{
        type: Date,
    },
    receivedDate:{
        type: Date,
    },
    additionalInfo:{
        type: String,
    },
    createdAt:{
        type: Date,
        default:Date.now
    },
})

module.exports=mongoose.model('APSTimeline',APSTimeline)