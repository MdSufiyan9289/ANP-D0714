import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { DataContext } from '../context/AppContext';
import { useDispatch, useSelector } from 'react-redux';
import { messageActions } from '../store/slices/messageSlice';
import { IoMdNotificationsOff } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";
import { MdReport } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
const LeftSideBar = ({ logout, setModal, setName }) => {

    const [allCurrUsers, setAllCurrUsers] = useState(null);
    const messages = useSelector(store => store.messages);
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const { setCurrFriendId, userData, setUserData, showAlert, showMenuId, setMenuId } = useContext(DataContext);
    const [showMute, setMute] = useState({});
    const [showBlock, setBlock] = useState({});
    const loadAllUsersData = async () => {
        const res = await fetch("http://localhost:1000/user/get-all-users-data", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        });
        const json = await res.json();
        if (json.status)
            setAllCurrUsers(json.data)
        else
            showAlert(json.message, false)
    }
    useEffect(() => {
        loadAllUsersData();
    }, []);
    const onAddUser = async (user) => {
        const res = await fetch("http://localhost:1000/user/add-user-data", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ friendName: user.profile.name, friendId: user._id, friendImage: user.profile.image })
        });
        const json = await res.json();
        if (json.status) {
            setCurrFriendId(user._id);
            dispatch(messageActions.addEmptyMessage(user._id));
            setUserData(json.data);
        }
        else
            showAlert(json.message, false);
        setSearch("");
    }

    const navigate = useNavigate();
    return (
        <div className='bg-[#001030] text-white h-[84vh]'>
            <div className='p-3'>
                <div className='flex justify-between items-center'>
                    <img className='max-w-[140px]' src={assets.logo} alt="logo" />
                    <div className='relative py-3 px-0 menu '>
                        <img className=' max-h-[20px] opacity-6 cursor-pointer ' src={assets.menu_icon} alt="menu" />
                        <div className='absolute top-50 right-3 w-32 py-2 bg-white rounded-sm text-black hidden sub_menu z-10'>
                            <div className=' p-2 flex items-center justify-between cursor-pointer hover:bg-blue-600 hover:text-white' onClick={e => { setCurrFriendId(""); navigate("/profile") }}><p>Edit Profile</p><FaEdit className='w-4 h-4' /></div>
                            <hr className='border-none h-[1px] bg-[#afafaf] my-1' />
                            <div className='p-2 flex items-center justify-between cursor-pointer hover:bg-blue-600 hover:text-white' onClick={e => { logout(); }}><p>Logout</p><IoMdLogOut></IoMdLogOut></div>
                        </div>
                    </div>
                </div>
                <div className='flex bg-[#002670] items-center gap-1 py-2 px-3 mt-3'>
                    <img className='w-[16px]' src={assets.search_icon} alt="search" onClick={e => onSearchClicked} />
                    <input className='bg-[transparent] border-none outline-none text-white text-sm rounded-sm ml-1 placeholder-[#c8c8c8]' type="text" placeholder='Search here...' onChange={e => setSearch(e.target.value)} value={search} />
                </div>
            </div>

            <div className='flex flex-col h-[70%] overflow-y-scroll'>
                {!search ? userData.usersData.length === 0 ? <div className='text-white text-center mt-10 font-semibold w-full'>No Friend Present</div> : userData.usersData.sort((a, b) => a.friendName.localeCompare(b.friendName)).map((friend, index) => {
                    return (
                        <div key={index} className='relative flex items-center gap-1 py-2 px-2 cursor-pointer text-[13px] hover:bg-blue-700' onClick={e => setCurrFriendId(friend.friendId)} onContextMenu={e => { e.preventDefault(); setMenuId(friend.friendId) }}>
                            <img className='w-[35px] aspect-[1/1] rounded-full object-cover object-center' src={friend.friendImage ? `http://localhost:1000/user/get-image/${friend.friendImage}` : assets.avatar_icon} alt="profile image" />

                            <div className='flex flex-col ml-2'>
                                <p>{friend.friendName}</p>
                                <div className='flex gap-2 px-2 mt-1 items-center'>{messages[friend.friendId]?.at(-1)?.image && <img className='rounded-sm  w-[15px] bg-[#9f9f9f]' src={assets.gallery_icon}></img>}<span className='text-[#9f9f9f] text-[11px] truncate w-32 overflow-hidden'>{messages[friend.friendId]?.at(-1) ? messages[friend.friendId].at(-1)?.message : ""}</span></div>
                            </div>
                            <div className=' flex gap-2 w-full justify-end px-1'>
                                {showMute[friend.friendId] && <IoMdNotificationsOff />}
                                {showBlock[friend.friendId] && <MdBlock />}
                            </div>
                            <div className={`absolute top-5 w-[50%] left-24 py-2 rounded-sm bg-white flex flex-col border border-black border-[1px] gap-1 z-10 ${showMenuId !== friend.friendId ? "hidden" : ""} text-black`}>
                                <div className='flex justify-between items-center hover:bg-pink-500 hover:text-white text-[13px] p-2' onClick={e => { e.preventDefault(); setModal({ message: "Change Name", subject: "Change", isOpen: true, fId: friend.friendId }); setName(friend.friendName) }} >
                                    <p>Change name</p>
                                    <FaEdit className='' />
                                </div>

                                <div className=' flex justify-between items-center hover:bg-pink-500 hover:text-white  p-2 w-full' onClick={e => { e.preventDefault(); setMenuId(""); setModal({ message: "Are you sure you want to remove?", subject: "Remove", isOpen: true, fId: friend.friendId }) }}>
                                    <p>Delete Chat</p>
                                    <MdDeleteSweep className='w-4 h-4' />
                                </div>

                                <div className=' flex justify-between items-center hover:bg-pink-500 hover:text-white p-2' onClick={e => { showMute[friend.friendId] ? setMute((prev) => ({ ...prev, [friend.friendId]: false })) : setMute((prev) => ({ ...prev, [friend.friendId]: true })) }}>
                                    <p>{showMute[friend.friendId] ? "Unmute Chat" : "Mute Chat"}</p>
                                    {showMute[friend.friendId] ? <IoMdNotifications className="w-4 h-4" /> : <IoMdNotificationsOff className="w-4 h-4"></IoMdNotificationsOff>}
                                </div>

                                <div className=' flex justify-between items-center hover:bg-pink-500 hover:text-white p-2' onClick={e => { showBlock[friend.friendId] ? setBlock((prev) => ({ ...prev, [friend.friendId]: false })) : setBlock((prev) => ({ ...prev, [friend.friendId]: true })) }}><p>{showBlock[friend.friendId] ? "Unblock Chat" : "Block Chat"}</p><MdBlock className=' w-4 h-4' />
                                </div>

                                <div className=' flex justify-between items-center hover:bg-pink-500 hover:text-white p-2'  onClick={e => { e.preventDefault(); setModal({ message: "The last 5 messages from this chat will be forwarded to Chat app and strict actions would be taken in case of any violation.", subject: "Report", isOpen: true, fId: friend.friendId }); setName(friend.friendName) }}  ><p>Report Chat</p><MdReport className="w-4 h-4" /></div>
                            </div>
                        </div>
                    )
                }) : allCurrUsers.filter((allUsers) => allUsers.profile.name.toLowerCase().includes(search.toLowerCase())).map((user, index) => {
                    return (
                        <div key={index} className='flex items-center gap-1 py-2 px-2 cursor-pointer text-[13px] hover:bg-blue-700' onClick={e => onAddUser(user)}>
                            <img className='w-[35px] aspect-[1/1] rounded-full object-cover object-center' src={user.profile.image ? `http://localhost:1000/user/get-image/${user.profile.image}` : assets.avatar_icon} alt="profile image" />
                            <div className='flex flex-col ml-2'>
                                <p>{user.profile.name}</p>
                            </div>

                        </div>
                    )
                })}

            </div>
        </div>
    )
}
export default LeftSideBar
