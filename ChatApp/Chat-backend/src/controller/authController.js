const User = require("../model/userSchema");
const { sendVerificationLink, sendVerificationOtp } = require('../utility/mailer');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const signUp = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!password)
            res.status(400).send({ status: false, message: "Password cannot be empty" })
        if (password.length < 6)
            res.status(403).send({ status: false, message: "Password must contain at least 6 charaters" });
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            userName: userName,
            email: email,
            password: hashPassword,
            profile: {
                name: userName
            }
        });
        const token = jwt.sign({ email: email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });
        if (sendVerificationLink(email, token, "verify_email_id")) {
            user.token = token;
            await user.save();
            res.status(200).send({ status: true, message: "Please cheack youe email to verify yourself", token: token })
        }
        else
            throw new Error("Cannot send email,something went wrong")
    }
    catch (error) {
        res.status(500).send({ status: false, message: "Error:" + error.message });
    }
}
const verifyLink = async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded)
            res.status(401).send({ status: false, message: "Unauthorized user" })

        const user = await User.findOne({ email: decoded.email });
        // if (user.isVerified)
        //     res.status(400).send({ status: false, message: "you are already verified" });
        user.isVerified = true
        await user.save();
        res.status(200).send({ status: true, message: "Your are verified", user: user })
    }
    catch (error) {
        res.status(500).send({ status: false, message: 'error:' + error.message });
    }
}
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email)
            res.status(400).send({ status: false, message: "Email is required" })
        if (!otp)
            res.status(400).send({ status: false, message: "Otp is required" })
        const user = await User.findOne({ email: email });
        if (!user)
            res.status(404).send({ status: false, message: "User not found" });
        if (otp !== user.otp)
            res.status(400).send({ status: false, message: "Incorrect otp" });
        if (user.otpExpire < Date.now())
            res.status(408).send({ status: false, message: "Otp expired" });
        user.otp = undefined;
        user.otpExpire = undefined;
        const token = jwt.sign({ email: email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });
        user.token = token;
        await user.save();
        res.status(200).send({ status: true, message: "Otp verified successfully", user: user })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const signIn = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email)
            res.status(400).send({ status: false, message: "Email is required" })
        if (!password)
            res.status(400).send({ status: false, message: "Password is required" })
        const findUser = await User.findOne({ email: email });
        if (!findUser)
            res.status(404).send({ status: false, message: "User not found" });
        if (!findUser.isVerified)
            res.status(403).send({ status: false, message: "Unauthorized user" });
        const isPassMatch = await bcrypt.compare(password, findUser.password)
        if (!isPassMatch)
            res.status(400).send({ status: false, message: "Incorrect password" })
        const otp = Math.floor(Math.random() * 900000 + 100000);
        const otpExpireTime = Date.now() + 1000 * 60 * 10;
        if (sendVerificationOtp(email, otp)) {
            console.log(otp);
            findUser.otp = otp;
            findUser.otpExpire = otpExpireTime;
            await findUser.save();
            res.status(200).send({ status: true, message: "Please verify the otp that we have sent you to your email." })
        }
        else
            throw new Error("Cannot send mail, something wrong");
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const verifyLinkForgetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        if (!token)
            res.status(400).send({ status: false, message: "Token not found" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded)
            res.status(401).send({ status: false, message: "Unauthorized user" })
        const user = await User.findById(decoded.userId);
        user.token = token;
        await user.save();
        res.status(200).send({ status: true, message: "You are verified" });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            res.status(400).send({ status: false, message: "Email is required" })
        const user = await User.findOne({ email: email });
        if (!user)
            res.status(404).send({ status: false, message: "User not found" });
        const token = jwt.sign({ email: email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });
        if (sendVerificationLink(email, token, "change_the_password"))
            res.status(200).send({ status: true, message: "please check youe email to change your password", token: token })
        else
            throw new Error("Cannot send email,someting went wrong")
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!password)
            res.status(400).send({ status: false, message: "Password cannot be empty" })
        if (password.length < 6)
            res.status(403).send({ status: false, message: "Password must contain at least 6 charaters" });
        if (!token)
            res.status(400).send({ status: false, message: "Token is required" })

        const user = await User.findOne({ token: token });
        if (!user)
            res.status(404).send({ status: false, message: "Unauthorized user" })
        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        user.token = ""
        await user.save();
        res.status(200).send({ status: true, message: "Password reset successfully" });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const changePassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        const id = req.userId;
        if (!password)
            res.status(400).send({ status: false, message: "Password is required" })
        if (!newPassword)
            res.status(400).send({ status: false, message: "Password cannot be empty" });
        if (newPassword.length < 6)
            res.status(403).send({ status: false, message: "Password must contain at least 6 charaters" });

        const user = await User.findById(id);
        if (!user)
            res.status(404).send({ status: false, message: "User not found for this email" });
        const isPassMatch = await bcrypt.compare(password, user.password)
        if (!isPassMatch)
            res.status(400).send({ status: false, message: "Incorrect password" })
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        res.status(200).send({ status: true, message: "Password updated successfully" })
    }
    catch (error) {
        res.status(500).send({ status: false, message: "Error:" + error.message });
    }
}
const logout = async (req, res) => {
    try {
        const id = req.userId;
        const user = await User.findById(id);
        user.token = "";
        await user.save()
        res.status(200).send({ status: true, message: "Successfully logged out" })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
module.exports = { logout, signUp, verifyLinkForgetPassword, verifyLink, signIn, verifyOtp, forgetPassword, resetPassword, changePassword }
// try{
//       res.status(200).send({status:true,data:})
// }
// catch(error){
//     res.status(500).send({status:false,message:error.message});
// }