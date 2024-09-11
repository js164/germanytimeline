const dotenv=require('dotenv').config({path: __dirname + '/.env' })
const { MailtrapClient } = require("mailtrap");


const mailTrapClient = new MailtrapClient({
  token: process.env.MAILTRAPTOKEN,
});

const mailTrapSender = {
    email: "germanytimeline@demomailtrap.com",
    name: "Germany Timeline",
};

module.exports = {mailTrapClient, mailTrapSender}