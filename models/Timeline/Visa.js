const mongoose=require('mongoose')

const VisaTimeline= new mongoose.Schema({
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
    resultValue:{
        type: String
    },
    VFSlocation:{
        type: String
    },
    createdAt:{
        type: Date,
        default:Date.now
    },
})

module.exports=mongoose.model('VisaTimeline',VisaTimeline)