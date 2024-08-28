const express = require('express')
const route = express.Router()
const { jwtauth, adminAuth } = require('../../AuthMiddlewere')
const timelineUser = require("../../models/Auth/user")
const Contact = require("../../models/Timeline/Contact")

route.get('/',jwtauth, async function(req, res, next){
    if (!res.headersSent) {
        try{
            const contact = await Contact.findOne({ user: req.user._id })
            console.log(contact);
            res.send(200, { success: true, data: contact, message: "Contact Successfully fetched!" })
        }catch(err){
            console.log(err);
            res.send(500, { success: false, message: err.message })
        }
    }
})

route.post('/save', jwtauth, async function (req, res, next) {
    if (!res.headersSent) {
        const user = await timelineUser.findOne({ _id: req.user._id })
        const contact = await Contact.findOne({ user: user })
        try {
            if (contact) {
                const updateContact = await Contact.findByIdAndUpdate(contact._id, req.body);
                res.send(200, { success: true, data: updateContact, message: "Contact Successfully saved!" })
            } else {
                const newContact = new Contact({...req.body,user});
                newContact.save().then(data => {
                    res.send(200, { success: true, data: data, message: "Contact Successfully saved!" })
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