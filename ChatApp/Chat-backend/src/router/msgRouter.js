const { getAllMsg, createMsg, deleteMsg, getAllUsersChats, deleteAllMsgs, deleteSingleMessage } = require('../controller/messageController');
const authentication = require('../middleware/authentication');

const messageRouter=require('express').Router();

messageRouter.post("/get-all-messages",authentication,getAllMsg);
messageRouter.get("/get-all-users-messages",getAllUsersChats);
messageRouter.delete("/delete-single-message/:id",authentication,deleteSingleMessage);
messageRouter.delete("/delete-all-messages",deleteAllMsgs);
module.exports=messageRouter;