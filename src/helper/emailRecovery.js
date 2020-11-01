const nodemailer = require('nodemailer');
const sendRecoveryEmail = async (user, token) => {
    let transporter = await nodemailer.createTransport({
        host: 'smtp.chmail.ir',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAILUSER,
            pass: process.env.EMAILPASSWORD,
        },
    });

    let mailOptions = {
        from: process.env.EMAILUSER,
        to: user.email.toString(),
        subject: 'recoveryPassword',
        text: `for reset password please click on below link  \n\n
        http://localhost:3000/reset/${token}`,
    };
    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = sendRecoveryEmail;
