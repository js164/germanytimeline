const mongoose=require('mongoose')

const universityTimeline= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    universityId:{
        type:String,
        require:true
    },
    universityName:{
        type: String,
        require:true
    },
    applicationDate:{
        type: Date,
    },
    examDate:{
        type:Date,
    },
    interviewDate:{
        type: Date,
    },
    result:{
        type: String,
        require:true
    },
    yourResponse:{
        type: String,
        default: "No"
    },
    createdAt:{
        type: Date,
        default:Date.now
    },
})

module.exports=mongoose.model('universityTimeline',universityTimeline)