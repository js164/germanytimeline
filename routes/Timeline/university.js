const express = require('express')
const route = express.Router()
const { jwtauth, adminAuth } = require('../../AuthMiddlewere')
const path = require('path');
const fs = require('fs');
const generateUniqueId = require('generate-unique-id');
const universityTimeline = require('../../models/Timeline/university')

route.get('/all/:id',async function(req,res){
    if (!res.headersSent) {
        try{
            const a= await universityTimeline.find({user:req.params.id})
            res.send(200, { success: true, data: a })
        }catch(err){
            console.log(err)
            res.send(500, { success: false, message: "Bad Request!" })
        }
    }
})

route.post('/addUniversity',async function (req, res, next) {
    if (!res.headersSent) {
        const { user, universityName, applicationDate, examDate, interviewDate, result, yourResponse} = req.body;
        const universityId=new Date().toISOString().replaceAll(/[-.:TZ]/g, '') + Math.random().toString().substring(2,7);
        const univeristy = new universityTimeline({
            user, universityId, universityName, applicationDate, examDate, interviewDate, result, yourResponse
        });
        univeristy.save().then(data => {
            console.log(data);
            res.send(200, { success: true, data: data , message:"University successfully added!" })
        }).catch(err => {
            console.log(err);
            res.send(500, { success: false, message: err.message })
        })
    }

});

module.exports = route;