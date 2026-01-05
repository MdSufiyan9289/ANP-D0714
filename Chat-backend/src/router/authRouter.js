const { signUp, signIn, verifyLink, verifyOtp, forgetPassword, resetPassword, changePassword, verifyLinkForgetPassword, logout } = require("../controller/authController");
const authentication = require("../middleware/authentication");

const authRouter=require("express").Router();

authRouter.post("/sign-up",signUp);
authRouter.post("/sign-in",signIn);
authRouter.get("/logout",authentication,logout);
authRouter.get("/verify-link/:token",verifyLink);
authRouter.get("/verify-link-forget-password/:token",verifyLinkForgetPassword);
authRouter.post("/verify-otp",verifyOtp);
authRouter.post("/forget-password",forgetPassword);
authRouter.post("/reset-password",resetPassword);
authRouter.post("/change-password",authentication,changePassword);

module.exports=authRouter;