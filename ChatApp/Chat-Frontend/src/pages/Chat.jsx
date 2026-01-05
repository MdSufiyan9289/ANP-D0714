import React, { useContext, useEffect, useState } from 'react'
import LeftSideBar from '../components/LeftSideBar'
import Chatbox from '../components/Chatbox'
import RightSideBar from '../components/RightSideBar'
import { useNavigate } from 'react-router-dom'
import { DataContext } from '../context/AppContext'
import { IoClose } from "react-icons/io5";
const Chat = () => {
  const { userData, showAlert, setMenuId, setUserData, setCurrFriendId } = useContext(DataContext);
  const [modal, setModal] = useState({ message: "", isOpen: false, subject: "", fId: "" });
  const [name, setName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    // if (userData)
    //   localStorage.setItem("token", userData.token)
    if (!localStorage.getItem("token")) {
      showAlert("You are not signed up", false);
      navigate("/");
    }
  }, [])
  
  const logout = async () => {
    const res = await fetch("http://localhost:1000/auth/logout", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    const json = await res.json()
    if (json.status) {
      localStorage.setItem("token", "");
      setCurrFriendId("");
      navigate("/");
    }
    else
      showAlert(json.message, json.status)
  }
  const onHandelClick = async () => {
    if (modal.subject === "Remove") {
      const res = await fetch("http://localhost:1000/user/delete-user-data", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ friendId: modal.fId })
      });
      const json = await res.json();
      if (json.status) {
        showAlert(json.message);
        setUserData((prev) => ({ ...prev, usersData: prev.usersData.filter(f => f.friendId !== modal.fId) }));
        setCurrFriendId("");
      }
      else
        showAlert(json.message, false);
    }
    else if(modal.subject==="Change"){
      const res = await fetch("http://localhost:1000/user/change-friend-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ id: modal.fId, newName: name })
      })
      const json = await res.json();
      if (json.status) {
        showAlert(json.message)
        setUserData(prev => ({ ...prev, usersData: prev.usersData.map(f => f.friendId === modal.fId ? { ...f, friendName: name } : f) }));
      }
      else
        showAlert(json.message, false, 4000);
    }
    else{
      showAlert("Reported chat successfully",false,3000);
    }
    setModal("");
  }
  return (
    <>
      {modal.isOpen && <div className='px-10 py-5 items-center justify-center z-10 bg-white border border-black border-[2px] rounded-md absolute top-[30%] left-[30%] w-[40%] shadow-lg bg-gray-200'>
        <div className=' flex w-full justify-end my-1'>
          <IoClose className=' w-7 h-7 p-1 hover:bg-gray-300 rounded-md' onClick={e => setModal((prev) => ({ ...prev, isOpen: false }))} />
        </div>
        <p className='text-lg'>{modal.message}</p>
        {modal.subject === "Change" && <input className=' mt-2 w-full px-3 py-2 rounded-md border border-gray-400 outline-blue-600' type="text" placeholder='Enter new name' value={name} onChange={e => setName(e.target.value)} />}
        <div className='flex gap-2 w-full justify-end mt-5'>
          <button className='bg-blue-500 px-4 py-2 text-white rounded hover:bg-gray-500' onClick={e => onHandelClick()}>{modal.subject}</button>
          <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-gray-500' onClick={e => setModal((prev) => ({ ...prev, isOpen: false }))}>Cancel</button>
        </div>
      </div>}
      {userData && <div className={`min-h-[100vh] grid place-items-center bg-gradient-to-r from-[#596AFF] to-[#383699] ${modal.isOpen ? "pointer-events-none opacity-50 bg-gray-200" : ""}`} onClick={e => { setMenuId("") }} >
        <div className='w-[90%] h-[84vh] max-w-[1100px] bg-[aliceblue] grid grid-cols-[1fr_2fr_1fr]'>
          <LeftSideBar setModal={setModal} logout={logout} setName={setName} />
          <Chatbox />
          <RightSideBar logout={logout}  />
        </div>
      </div>}
    </>
  )
}

export default Chat
