const express = require('express')
const route = express.Router()
const { jwtauth, adminAuth } = require('../../AuthMiddlewere')
const timelineUser = require("../../models/Auth/user")
const VisaTimeline = require("../../models/Timeline/Visa")

route.get('/',jwtauth, async function(req, res, next){
    if (!res.headersSent) {
        try{
            const Visa = await VisaTimeline.findOne({ user: req.user._id })
            console.log(Visa);
            res.send(200, { success: true, data: Visa, message: "Visa Successfully fetched!" })
        }catch(err){
            console.log(err);
            res.send(500, { success: false, message: err.message })
        }
    }
})

route.get('/all', async function(req, res, next){
    if (!res.headersSent) {
        try{
            const Visa = await VisaTimeline.find().sort( { appliedDate: -1 } ).lean()
            console.log(Visa);
            res.send(200, { success: true, data: Visa, message: "Visa Successfully fetched!" })
        }catch(err){
            console.log(err);
            res.send(500, { success: false, message: err.message })
        }
    }
})


route.post('/save', jwtauth, async function (req, res, next) {
    if (!res.headersSent) {
        const user = await timelineUser.findOne({ _id: req.user._id })
        const Visa = await VisaTimeline.findOne({ user: user })
        try {
            if (Visa) {
                const updateVisa = await VisaTimeline.findByIdAndUpdate(Visa._id, req.body);
                res.send(200, { success: true, data: updateVisa, message: "Visa Successfully saved!" })
            } else {
                const newVisa = new VisaTimeline({...req.body,user});
                newVisa.save().then(data => {
                    res.send(200, { success: true, data: data, message: "Visa Successfully saved!" })
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