const ChatUser = require("../model/userSchema");
const Message = require("../model/messageSchema");
const path = require('path');
const fs = require('fs');
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await ChatUser.find({});
        res.status(200).send({ status: true, data: allUsers });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const deleteAllUsers = async (req, res) => {
    try {
        const allDeletedUsers = await ChatUser.deleteMany({});
        res.status(200).send({ status: true, data: allDeletedUsers })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await ChatUser.findByIdAndDelete(id);
        res.status(200).send({ status: true, data: deletedUser })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const deleteImage = async (req, res) => {
    try {
        const id = req.userId;
        const user = await ChatUser.findById(id);
        user.profile.image = "";
        fs.unlinkSync(user.profile.image);
        await user.save();
        res.status(200).send({ status: true, message: "Successfully deleted image" })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }

}
const getAllUsersData = async (req, res) => {
    try {

        const id = req.userId;
        const allUsersData = await ChatUser.find({ _id: { $ne: id } }, { "profile.name": 1, "profile.image": 1, _id: 1, lastMsg: 1 });
        res.status(200).send({ status: true, data: allUsersData });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }

}
const deleteUserData = async (req, res) => {
    try {
        const id = req.userId;
        const { friendId } = req.body;
        if (!friendId)
            res.status(400).send({ status: false, message: "Friend Id is required" });

        const user = await ChatUser.findById(id);
        let newFriends = user.usersData.filter(friend => friend.friendId !== friendId)
        user.usersData = newFriends;
        await Message.deleteMany({$or:[{ senderId: id, receiverId: friendId },{receiverId:id,senderId:friendId}]});
        const updatedUser = await user.save();
        res.status(200).send({ status: true, data: updatedUser, message: "User deleted from friends list" });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const updateFriendName = async (req, res) => {
    try {
        const {id,newName}=req.body;
        if(!id||!newName)
            res.status(400).send({status:false,message:"Id and new name is required"});
        await ChatUser.updateOne({_id:req.userId,"usersData.friendId":id},{$set:{"usersData.$.friendName":newName}});
        res.status(200).send({ status: true ,message:"Name Changed successfully"});
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }

}
const addUserData = async (req, res) => {
    try {
        const { friendName, friendId, friendImage } = req.body;
        if (!friendId)
            res.status(400).send({ status: false, message: "friendId is required" });
        if (!friendName)
            res.status(400).send({ status: false, message: "friendId is required" });
        const userId = req.userId
        const user = await ChatUser.findById(userId);
        if (user.usersData.some(friend => friend.friendId === friendId))
            return res.status(409).send({ status: false, message: "User already present in your friends list" });
        const userData = {
            friendId: friendId,
            friendName: friendName,
            friendImage: friendImage ? friendImage : ""
        }
        user.usersData.push(userData);
        const updatedUser = await user.save();
        res.status(200).send({ status: true, data: updatedUser })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const getImage = (req, res) => {
    try {
        const filePath = req.params.filePath;
        if (!filePath)
            res.status(400).send({ status: false, message: "File path is required" });
        const fPath = path.resolve(__dirname, "../../uploads", filePath)
        res.status(200).sendFile(fPath);
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const updateProfile = async (req, res) => {
    try {
        const { name, about } = req.body;
        const id = req.userId;

        const user = await ChatUser.findById(id);
        if (user.profile.image && req.file) {
            fs.unlink(path.resolve(__dirname, "../../uploads", user.profile.image), (error) => {
            });
        }
        const finalName = name ? name : user.profile.name
        const finalImage = req.file ? req.file.filename : user.profile.image ? user.profile.image : ""
        const finalAbout = about ? about : user.profile.about ? user.profile.about : ""
        await ChatUser.findByIdAndUpdate(id, {
            profile: {
                name: finalName,
                image: finalImage,
                about: finalAbout
            }
        })
        await ChatUser.updateMany(
            {
                "usersData.friendId": id,
            },
            {
                $set: { "usersData.$[elem].friendImage": finalImage },
                $set: { "usersData.$[elem].friendName": name }
            },
            {
                arrayFilters: [{ "elem.friendId": id }]
            }
        );
        const updatedUser = await ChatUser.findById(id)
        res.status(200).send({ status: true, message: "Successfully updated profile", data: updatedUser })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = {updateFriendName, deleteUserData, getAllUsersData, getAllUsers, deleteUser, updateProfile, addUserData, getImage, deleteAllUsers, deleteImage }
// try{
//       res.status(200).send({status:true,data:})
// }
// catch(error){
//     res.status(500).send({status:false,message:error.message});
// }