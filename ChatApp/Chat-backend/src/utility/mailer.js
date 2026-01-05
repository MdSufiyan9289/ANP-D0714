const nodemailer=require('nodemailer');
require('dotenv').config();

const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }
})

const sendVerificationLink=(email,token,subject)=>{
    const url=`http://localhost:5173/verify?token=${token}&subject=${subject}`;
    console.log(url);
    const newSubject=subject.split('_').join(" ");
    const mailerOptions={
        to:email,
        from:process.env.EMAIL_USER,
        subject:"To "+newSubject,
        html:`click <a href="${url}"> here</a> to ${newSubject}`
    }
    // console.log(url);
    return transporter.sendMail(mailerOptions);
}
const sendVerificationOtp=(email,otp)=>{
    const mailerOptions={
        to:email,
        from:process.env.EMAIL_USER,
        subject:"To verify user",
        html:`Your otp(one time password) to sign in is <b>${otp}</b> <br>This otp will expire in 10 minutes.please do not share this otp with others<br>If you did not made this request,please disregard this this email.`
    }
    return transporter.sendMail(mailerOptions);
}

module.exports={sendVerificationLink,sendVerificationOtp}