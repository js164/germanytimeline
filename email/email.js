// import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate";
// import { mailTrapClient, mailTrapSender } from "./mailtrap.config";
const Templates = require("./emailTemplate");
const { mailTrapClient, mailTrapSender } = require("./mailtrap.config");



const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];
	console.log(email);
	console.log(verificationToken);

	try {
		const response = await mailTrapClient.send({
			from: mailTrapSender,
			to: recipient,
			subject: "Verify your email",
			html: Templates.VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification",
		})

		console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
};

module.exports = sendVerificationEmail