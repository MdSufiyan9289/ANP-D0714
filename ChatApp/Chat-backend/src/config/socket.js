const { Server } = require("socket.io");
const Message = require("../model/messageSchema");
const User = require("../model/userSchema");
const fs = require("fs");
const users = {};
const setupSocket = (server) => {
    const io = new Server(server, { cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] } });
    io.on("connection", (socket) => {
        socket.on("register", (userId) => {
            users[userId] = socket.id;
        });
        socket.on("sendPrivateMessage", async ({ senderId, receiverId, message, image }) => {
            const newMessage = new Message({
                message: message,
                senderId: senderId,
                receiverId: receiverId
            });
            let imagePath="";
            if (image) {
                const buffer = Buffer.from(image, "base64");
                imagePath = `${Date.now()}-${senderId}.jpg`
                fs.writeFile("uploads/"+imagePath, buffer, (error) => {
                    if (error)
                        console.log("Error Saving image", error);
                })
                newMessage.image=imagePath
            }               
            await newMessage.save();
            const friend = await User.findById(receiverId);
            if (!friend.usersData.some(fr => fr.friendId === senderId)) {
                const user = await User.findById(senderId);
                friend.usersData.push({ friendId: senderId, friendName: user.profile.name, friendImage: user.profile.image ? user.profile.image : "" });
                await friend.save();
            }
            const receiverSocketId = users[receiverId];
            const senderSocketId = users[senderId];
            if (senderSocketId){
                io.to(senderSocketId).emit("receiveMessage", { senderId, receiverId, message, image:image ?newMessage.image : "", timestamp: newMessage.timestamp,_id:newMessage._id })
            }
            if (receiverSocketId){
                io.to(receiverSocketId).emit("receiveMessage", { senderId, receiverId, message, image: image ?newMessage.image : "", timestamp: newMessage.timestamp,_id:newMessage._id  })
            }
        });
        socket.on("disconnect", () => {
            for (const userId in users) {
                if (users[userId] === socket.id) {
                    delete users[userId];
                    break;
                }
            }
        });
    });
    return io;
}
module.exports = setupSocket;