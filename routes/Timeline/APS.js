const express = require('express')
const route = express.Router()
const { jwtauth, adminAuth } = require('../../AuthMiddlewere')
const timelineUser = require("../../models/Auth/user")
const APSTimeline = require("../../models/Timeline/APS")

route.get('/',jwtauth, async function(req, res, next){
    if (!res.headersSent) {
        try{
            const aps = await APSTimeline.findOne({ user: req.user._id })
            console.log(aps);
            res.send(200, { success: true, data: aps, message: "APS Successfully fetched!" })
        }catch(err){
            console.log(err);
            res.send(500, { success: false, message: err.message })
        }
    }
})

route.get('/all', async function(req, res, next){
    if (!res.headersSent) {
        try{
            const aps = await APSTimeline.find().sort( { appliedDate: -1 } ).lean()
            console.log(aps);
            res.send(200, { success: true, data: aps, message: "Visa Successfully fetched!" })
        }catch(err){
            console.log(err);
            res.send(500, { success: false, message: err.message })
        }
    }
})

route.post('/save', jwtauth, async function (req, res, next) {
    if (!res.headersSent) {
        const user = await timelineUser.findOne({ _id: req.user._id })
        const aps = await APSTimeline.findOne({ user: user })
        try {
            if (aps) {
                const updateAPS = await APSTimeline.findByIdAndUpdate(aps._id, req.body);
                res.send(200, { success: true, data: updateAPS, message: "APS Successfully saved!" })
            } else {
                const newAPS = new APSTimeline({...req.body,user});
                newAPS.save().then(data => {
                    res.send(200, { success: true, data: data, message: "APS Successfully saved!" })
                }).catch(err => {
                    console.log(err);
                    res.send(500, { success: false, message: err.message })
                })
            }
        }
        catch (err) {
            console.log(err);
            res.send(500, { success: false, message: err.message })
        }
    }

});


module.exports = route;