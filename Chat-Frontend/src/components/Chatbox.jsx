import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { IoClose } from "react-icons/io5";
import { DataContext } from '../context/AppContext'
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';
import { messageActions } from '../store/slices/messageSlice';
let socket = io("ws://localhost:1000", { transports: ["websocket"], withCredentials: true });
const Chatbox = () => {
  let prev=null;
  const messages = useSelector(store => store.messages);
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const { currFriendId, userData, showAlert } = useContext(DataContext);
  const friend = currFriendId ? userData.usersData.find(user => user.friendId === currFriendId) : null;
  const [message, setMessage] = useState("");
  const [msgImage, setMsgImage] = useState(false);
  const loadMessages = async (friendId) => {
    const res = await fetch("http://localhost:1000/message/get-all-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ friendId: friendId })
    });
    const json = await res.json();
    if (json.status) {
      return json.data;
    }
    else
      showAlert(json.message, false);
  }
  const fetchAllMesages = async () => {
    try {
      const promises = userData.usersData.map(async (friend) => {
        const res = await loadMessages(friend.friendId);
        dispatch(messageActions.addMessages({ id: friend.friendId, messages: res }));
      })
      await Promise.all(promises);
    }
    catch (error) {
      showAlert(error.message, false);
    }
  }
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  }, [messages]);

  useEffect(() => {
    socket.emit("register", userData._id);
    socket.on("receiveMessage", ({ senderId, receiverId, message, image, timestamp, _id }) => {
      dispatch(messageActions.addNewMessage({ senderId, receiverId, message, image, timestamp, _id }))
      messages[currFriendId].map((m)=>{

      })
    });
    fetchAllMesages();
  }, []);

  const getTime = (timestamp) => {
    const date = new Date(timestamp)
    let hours = Number(date.getHours());
    if (hours > 12)
      hours = hours - 12;
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes} ${Number(date.getHours()) > 12 ? "PM" : "AM"}`
  }
  const onHandleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setMsgImage(reader.result);
      }
    }
  }

  const onDeleteMessage = async (id) => {
    const res = await fetch(`http://localhost:1000/message/delete-single-message/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    const json = await res.json();
    dispatch(messageActions.deleteMessage({ id: currFriendId, mId: id }));
    showAlert(json.message, json.status);
  }
  const sendMessage = () => {
    prev=Date.now();
    if (!socket.connected)
      socket = io("ws://localhost:1000", { transports: ["websocket"], withCredentials: true });
    socket.emit("sendPrivateMessage", { senderId: userData._id, receiverId: currFriendId, message: message, image: msgImage ? msgImage.split(",")[1] : null })
    setMsgImage(false);
    setMessage("");
  }
  return (
    <>
      <div className='h-[84vh] relative bg-[#f1f5ff] overflow-hidden'>

        {friend && <div className='py-[10px] px-[15px] flex items-center gap-[10px] border border-b-gray-400' >
          <img className="w-[35px] rounded-full aspect-[1/1]  object-center" src={friend.friendImage ? `http://localhost:1000/user/get-image/${friend.friendImage}` : assets.avatar_icon} alt="profile" />
          <p className=' font-semibold text-md'>{friend.friendName}</p>
          <img className='w-[25px] rounded-full aspect-[1/1]' src={assets.help_icon} alt="help icon" />
        </div >}
        {currFriendId ?
          <div className='flex flex-col-reverse'>
            <div className='overflow-y-scroll h-[420px] pb-12 pt-6 flex flex-col gap-2 px-4'>
              {messages[currFriendId] ? messages[currFriendId].map((chat, index) => {
                return chat.senderId === userData._id ?
                  <div key={index} className=' flex flex-row-reverse items-end py-2 justify-end'>
                    <div className='flex flex-col min-h-4 pl-[7px] pr-[3px] pb-[7px] items-center bg-blue-500  max-w-64 min-w-28 rounded-[8px_8px_8px_0px] mb-10 r-msg  '>
                      <div className='w-full h-4 flex justify-end mt-[1px] '>
                        <IoClose className='w-4 text-end cursor-pointer p-[1px] mt-[1px] rounded-sm hover:bg-blue-300 cross' title='Delete this message' onClick={e => onDeleteMessage(chat._id)} />
                      </div>
                      {chat.image && <img className='w-64 h-64 object-center rounded-md bg-white mb-3 mr-1' src={`http://localhost:1000/user/get-image/${chat.image}`} alt="image"></img>}
                      <p className='text-white text-[14px] ml-[4px] mr-[10px] -mt-2'>{chat.message}</p>
                    </div>
                    <div className='ml-3'>
                      <img className='w-[30px]  aspect-[1/1] rounded-full object-cover object-center ' src={userData.profile.image ? `http://localhost:1000/user/get-image/${userData.profile.image}` : assets.avatar_icon} alt="prof img" />
                      <p ref={scrollRef} className='text-[10px]'>{getTime(chat.timestamp)}</p>
                    </div>
                  </div> :
                  (<div key={index} className=' w-full flex justify-end items-end py-2'>
                    <div className='bg-purple-600 pl-[3px] pr-[3px] pb-[7px] flex flex-col items-center rounded-[8px_8px_0px_8px] mb-10 justify-center max-w-64 min-w-28 min-h-4 s-msg'>
                      <div className='w-full h-4 flex justify-end '>
                        <IoClose className='w-4 p-[1px] mt-[1px] hover:bg-purple-300 cursor-pointer rounded-sm r-cross' onClick={e => onDeleteMessage(chat._id)} title='Delete this message' />
                      </div>
                      {chat.image && <img className='w-64 h-64 object-center rounded-md object-fit bg-white mx-3  mb-3' src={`http://localhost:1000/user/get-image/${chat.image}`} alt='image'></img>}
                      <p className='text-white  text-[14px] mx-2  -mt-2 '>{chat.message}</p>
                    </div>
                    <div className='flex flex-col justify-end'>
                      <img className=' ml-1 w-[30px] aspect-[1/1] rounded-full object-cover object-center ' src={friend && friend.friendImage ? `http://localhost:1000/user/get-image/${friend.friendImage}` : assets.avatar_icon} alt="prof img" />
                      <p ref={scrollRef} className='text-[10px]'>{getTime(chat.timestamp)}</p>
                    </div>
                  </div>)
              }) : <div className='flex items-center justify-center font-semilbold text-black h-full'>No messages</div>
              }
            </div>
          </div> : <div className='flex w-full h-full items-center justify-center font-semilbold text-black'>Please select a friend</div>}
        {currFriendId &&
          <div className='flex items-center gap-[12px] py-[10px] px-[15px] bg-gray-200 rounded-2xl absolute bottom-0 left-0 right-0' >
            <input className='flex-1 flex border-none outline-none bg-[transparent]' type="text" onChange={e => setMessage(e.target.value)} value={message} placeholder='Send a message' />
            {msgImage && <p className='text-[11px] w-12 text-center font-semibold text-blue-600 '>Image uploaded</p>}{msgImage && <IoClose className='text-gray-600 cursor-pointer rounded-full hover:bg-gray-300 ' onClick={e => setMsgImage(false)} />}
            <input type="file" id='image' accept='image/png, image/jpeg' hidden onChange={onHandleImage} />
            <label className='flex' htmlFor="image">
              <img className='rounded-sm w-[22px] cursor-pointer object-cover object-center' src={msgImage ? msgImage : assets.gallery_icon} alt="gallery icon" />
            </label>
            <button className="w-[33px] h-[33px] cursor-pointer bg-cover bg-center disabled:opacity-40 " style={{ backgroundImage: `url(${assets.send_button})` }} onClick={e => { e.preventDefault(); sendMessage() }} disabled={message.length === 0 && !msgImage} />
          </div>}
      </div >
    </>
  )

}

export default Chatbox
