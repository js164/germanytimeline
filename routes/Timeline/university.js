const express = require('express')
const route = express.Router()
const { jwtauth, adminAuth } = require('../../AuthMiddlewere')
const path = require('path');
const fs = require('fs');
const universityTimeline = require('../../models/Timeline/university')
const timelineUser = require("../../models/Auth/user");
const Contact = require('../../models/Timeline/Contact');

route.get('/all/:sortby', async function(req,res){
    if (!res.headersSent) {
        try{
            if(req.params.sortby === "courseName"){
                const uni= await universityTimeline.find().sort( { courseName: 1 } ).lean()
                console.log(uni);
                var promises = uni.map(async (u,idx)=>{
                    const contact = await Contact.findOne({ user: u.user._id })
                    if(contact && contact.isPublic === "Public"){
                        u["contact"]=contact
                    }
                    return u
                })
                Promise.all(promises).then(function(uni) {
                    res.send(200, { success: true, data: uni })
                })
            }else{
                const uni= await universityTimeline.find().sort( { universityName: 1 } ).lean()
                console.log(uni);
                var promises = uni.map(async (u,idx)=>{
                    const contact = await Contact.findOne({ user: u.user._id })
                    if(contact && contact.isPublic === "Public"){
                        u["contact"]=contact
                    }
                    return u
                })
                Promise.all(promises).then(function(uni) {
                    res.send(200, { success: true, data: uni })
                })
            }
        }catch(err){
            console.log(err)
            res.send(500, { success: false, message: "Bad Request!" })
        }
    }
})

route.get('/myuniversity/all/', jwtauth, async function(req,res){
    if (!res.headersSent) {
        try{
            const a= await universityTimeline.find({user:req.user._id})
            res.send(200, { success: true, data: a })
        }catch(err){
            console.log(err)
            res.send(500, { success: false, message: "Bad Request!" })
        }
    }
})

route.post('/addUniversity', jwtauth, async function (req, res, next) {
    if (!res.headersSent) {
        try{
            const user = await timelineUser.findOne({_id: req.user._id})
        const { universityName, courseCategory, courseName, applicationDate, examDate, interviewDate, resultDate, result, yourResponse} = req.body;
        const universityId=new Date().toISOString().replaceAll(/[-.:TZ]/g, '') + Math.random().toString().substring(2,7);
        const univeristy = new universityTimeline({
            user, universityId, universityName, courseCategory, courseName, applicationDate, examDate, interviewDate, resultDate, result, yourResponse
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

route.post('/updateUniversity/:id', jwtauth, async function (req, res, next) {
    if (!res.headersSent) {
        try{
            const uni = await universityTimeline.findById(req.params.id)
            if(uni){
                const { universityName, courseName, applicationDate, examDate, interviewDate, resultDate, result, yourResponse} = req.body;
                const data = { universityName, courseCategory, courseName, applicationDate, examDate, interviewDate, resultDate, result, yourResponse }
                const univeristy = await universityTimeline.findByIdAndUpdate(req.params.id, data);
                res.send(200, { success: true, data: univeristy , message:"University successfully updated!" })
            }
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