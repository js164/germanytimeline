const express = require('express')
const route = express.Router()
const { jwtauth, adminAuth } = require('../../AuthMiddlewere')
const path = require('path');
const fs = require('fs');
const universityTimeline = require('../../models/Timeline/university')
const timelineUser = require("../../models/Auth/user")

route.get('/all/', jwtauth, async function(req,res){
    if (!res.headersSent) {
        try{
            console.log("check");
            console.log((req.user));
            const a= await universityTimeline.find({user:req.user._id})
            console.log(a);
            res.send(200, { success: true, data: a })
        }catch(err){
            console.log(err)
            res.send(500, { success: false, message: "Bad Request!" })
        }
    }
})

route.post('/addUniversity',jwtauth,async function (req, res, next) {
    if (!res.headersSent) {
        try{
            const user = await timelineUser.findOne({_id: req.user._id})
        const { universityName, courseName, applicationDate, examDate, interviewDate, resultDate, result, yourResponse} = req.body;
        const universityId=new Date().toISOString().replaceAll(/[-.:TZ]/g, '') + Math.random().toString().substring(2,7);
        const univeristy = new universityTimeline({
            user, universityId, universityName, courseName, applicationDate, examDate, interviewDate, resultDate, result, yourResponse
        });
        univeristy.save().then(data => {
            res.send(200, { success: true, data: data , message:"University successfully added!" })
        }).catch(err => {
            console.log(err);
            res.send(500, { success: false, message: err.message })
        })
    }
        catch(err){
            console.log(err);
            res.send(500, { success: false, message: err.message })
        }
    }

});


route.delete('/delete/:id', jwtauth, async function(req,res){
    if (!res.headersSent) {
        try{
            const a= await universityTimeline.findById(req.params.id)
            if(a){
                await universityTimeline.findByIdAndDelete(req.params.id)
                res.send(200, { success: true, message: "University successfully deleted!"})
            }
        }catch(err){
            console.log(err)
            res.send(500, { success: false, message: "Bad Request!" })
        }
    }
})

module.exports = route;