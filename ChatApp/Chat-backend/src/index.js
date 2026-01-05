const express=require('express');
const databaseConnection = require('./config/db');
const userRouter = require('./router/userRouter');
const authRouter = require('./router/authRouter');
const http=require("http");
const messageRouter = require('./router/msgRouter');
const setupSocket = require('./config/socket');
const cors=require("cors");
const app=express();
const server=http.createServer(app);
const PORT=process.env.PORT||5000;
app.use(cors({origin:"*"}));
setupSocket(server);
app.use(express.json({
    limit:'50mb'
}));
app.use(express.urlencoded({
    extended:true,limit:'50mb'
}))
app.use("/user",userRouter)
app.use("/auth",authRouter);
app.use("/message",messageRouter);
app.get("/",(req,res)=>{
    res.send("server running")
})
server.listen(PORT,()=>{
    databaseConnection();
    console.log(`app started at http://localhost:${PORT}`);
})