const express = require('express')
const route = express.Router()
const passport = require('passport')
const { hashSync, compareSync } = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy;
const timelineUser = require('../../models/Auth/user')
var jwt = require('jsonwebtoken');
require('../../passport')
const { jwtauth } = require('../../AuthMiddlewere')
const sendVerificationEmail = require('../../email/email')

route.get('/profile', jwtauth, function (req, res, next) {
    if (!res.headersSent) {
        res.send("welcome")
    }

});

route.post('/signup', async function (req, res) {

    const userCheck = await timelineUser.findOne({ email: req.body.email })
    if (userCheck) {
        res.send({
            status: 400,
            success: false,
            message: "User Already Exist!",
        })
    } else {

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const usermodel = new timelineUser({
            email: req.body.email,
            username: req.body.username,
            password: hashSync(req.body.password, 10),
            userId: new Date().toISOString().replaceAll(/[-.:TZ]/g, '') + Math.random().toString().substring(2, 7),
            isActive: false,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        })
        usermodel.save().then(async (user) => {

            // await sendVerificationEmail(req.body.email, verificationToken)

            res.send({
                success: true,
                message: "New User Successfully Created!",
                user: {
                    email: user.email,
                    userId: user.userId,
                    isActive: user.isActive
                }
            })
        }).catch(err => {
            res.send({
                success: false,
                message: "Something wents wrong!",
                error: err
            })
        })
    }

})

route.post('/verifyotp', async function (req, res) {
    try {
        const user = await timelineUser.findOne({
            userId: req.body.userId,
            verificationToken: req.body.otp,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        console.log(user);
        if (user) {
            if (user.verificationToken === req.body.otp) {

                await timelineUser.findByIdAndUpdate(user._id, { isActive: true })

                let payload = {
                    email: user.email,
                    username: user.username,
                    _id: user._id
                }

                const access_token = jwt.sign(payload, process.env.JWTtoken, { expiresIn: "30m" });
                const refresh_token = jwt.sign(payload, process.env.JWTRefreshToken, { expiresIn: "30d" });
                res.send({
                    success: true,
                    message: "User Successfully Verified!",
                    user: {
                        email: user.email,
                        username: user.username,
                        access_token: access_token,
                        refresh_token: refresh_token,
                        userId: user.userId,
                        isActive: user.isActive
                    }
                })
            }
        }
        else {
            res.send({
                status: 400,
                success: false,
                message: "Invalid or expired verification code!",
            })
        }
    } catch {
        res.send({
            success: false,
            message: "Something wents wrong!",
        })
    }
})

route.post('/resendotp', async function (req, res) {
    console.log("resend.....");
    console.log(res.body);
    try {
        const user = await timelineUser.findOne({ email: req.body.email })
        console.log(user);
        if (!user) {
            res.send({
                status: 400,
                success: false,
                message: "User with this email id not found!",
            })
        } else {
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
            const updatedUser = await timelineUser.findByIdAndUpdate(user._id,{
                verificationToken: verificationToken,
                verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            })

            // await sendVerificationEmail(updatedUser.email, verificationToken)

            res.send({
                success: true,
                message: "OTP successfully sent!",
                user: {
                    email: user.email,
                    userId: user.userId
                }
            })
        }

    } catch {
        res.send({
            success: false,
            message: "Something wents wrong!",
        })
    }
})

route.post('/login', (req, res) => {
    timelineUser.findOne({ email: req.body.email }).then((user, err) => {
        if (err) {
            return res.send({
                success: false,
                message: "Something wents wrong!",
                error: err
            })
        }
        if (!user) {
            return res.send({
                success: false,
                message: "no user found!"
            })
        } else {
            if (!compareSync(req.body.password, user.password)) {
                return res.send({
                    success: false,
                    message: "password not match!"
                })
            }

            if (user.isActive) {
                let payload = {
                    email: user.email,
                    username: user.username,
                    _id: user._id
                }

                const access_token = jwt.sign(payload, process.env.JWTtoken, { expiresIn: "30m" });
                const refresh_token = jwt.sign(payload, process.env.JWTRefreshToken, { expiresIn: "30d" });
                return res.send({
                    success: true,
                    message: "your are Successfully Logged In!",
                    user: {
                        email: user.email,
                        username: user.username,
                        access_token: access_token,
                        refresh_token: refresh_token,
                        userId: user.userId,
                        isActive: user.isActive
                    }
                })
            } else {
                return res.send({
                    success: true,
                    message: "your email verification is pending!",
                    user: {
                        email: user.email,
                        userId: user.userId,
                        isActive: user.isActive
                    }
                })
            }

        }
    })
});



route.post('/refresh', function (req, res) {
    if (!req.body["refresh_token"]) {
        res.send(401, "refresh token not available")
    } else {
        jwt.verify(req.body['refresh_token'], process.env.JWTRefreshToken, function (err, data) {
            if (err) {
                res.send({
                    success: false,
                    message: "Invalid refresh token",
                    status: 403,
                    error: err.message
                })
            }
            if (data) {
                let payload = {
                    username: data.username,
                    _id: data._id
                }

                const access_token = jwt.sign(payload, process.env.JWTtoken, { expiresIn: "30m" });

                return res.send({
                    success: true,
                    user: {
                        username: data.username,
                        access_token: access_token,
                        userId: data.userId
                    }
                })
            }
        })

    }

})



route.get('/logout', jwtauth, (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.send(200, { success: true })
    });
})

module.exports = route;