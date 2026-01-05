const Message = require('../model/messageSchema');

const getAllMsg = async (req, res) => {
    try {
        const { friendId } = req.body;
        const id = req.userId;
        const allMsgs = await Message.find({ $or: [{ senderId: id, receiverId: friendId }, { receiverId: id, senderId: friendId }] });
        res.status(200).send({ status: true, data: allMsgs });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const deleteAllMsgs = async (req, res) => {
    try {
        const deletedChats = await Message.deleteMany({});
        res.status(200).send({ status: true, data: deletedChats })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const deleteSingleMessage = async (req, res) => {
    try {
        const id=req.params.id;
        if(!id)
            res.status(400).send({status:false,message:"Id is required"});
        await Message.findByIdAndDelete(id);
        res.status(200).send({ status: true, message:"Message deleted successfully"})
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

const getAllUsersChats = async (req, res) => {
    try {
        const allUsersChats = await Message.find({});
        res.status(200).send({ status: true, data: allUsersChats })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
module.exports = { deleteSingleMessage,getAllMsg, getAllUsersChats, deleteAllMsgs }

// try{
//       res.status(200).send({status:true,data:})
// }
// catch(error){
//     res.status(500).send({status:false,message:error.message});
// }