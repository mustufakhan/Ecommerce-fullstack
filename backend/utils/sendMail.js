const nodemailer = require('nodemailer');
const sendEmail = async(options)=>{
	const transpoter = nodemailer.createTransport({
			service:  process.env.SMPT_SERVICE,
			auth:{
					user:  process.env.SMPT_MAIL,
					pass:  process.env.SMPT_PASSWORD,
			}
	})
	
	const mailOptions = {
		from:  process.env.SMPT_MAIL,
		to: options.email,
		text: options.message,
		subject: options.subject
	}
	await transpoter.sendMail(mailOptions)
};

module.exports = sendEmail;