const { getAllUsers, deleteUser, updateProfile, addUserData, getImage, deleteAllUsers, deleteImage, getAllUsersData, deleteUserData, updateFriendName } = require('../controller/userController');
const upload = require('../config/fileStorage');
const authentication =require('../middleware/authentication')
const userRouter=require('express').Router();

userRouter.get("/get-all-users",getAllUsers);
userRouter.get("/get-all-users-data",authentication,getAllUsersData);
userRouter.post("/change-friend-name",authentication,updateFriendName);
userRouter.get("/get-image/:filePath",getImage);
userRouter.delete("/delete-user/:id",deleteUser);
userRouter.delete("/delete-all-users",deleteAllUsers);
userRouter.delete("/delete-image",authentication,deleteImage)
userRouter.patch("/update-profile",authentication,upload.single("file"),updateProfile);
userRouter.patch("/add-user-data",authentication,addUserData);
userRouter.patch("/delete-user-data",authentication,deleteUserData);


module.exports =userRouter;