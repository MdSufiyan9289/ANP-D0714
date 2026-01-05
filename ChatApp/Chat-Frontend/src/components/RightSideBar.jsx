import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { DataContext } from '../context/AppContext'
import { useSelector } from 'react-redux'
import Loader from './Loader'

const RightSideBar = ({ logout }) => {
  const messages = useSelector(store => store.messages);
  const [isBtn,setBtn]=useState(true);
  const { userData, currFriendId } = useContext(DataContext);
  return (
    <div className='text-white bg-gray-800 relative h-[84vh] overflow-y-scroll'>
      <div className='pt-16 flex flex-col items-center max-w-[85%] m-auto'>
        <img className='w-[110px] aspect-[1/1] rounded-full object-cover object-center' src={userData.profile.image ? `http://localhost:1000/user/get-image/${userData.profile.image}` : assets.avatar_icon} alt="profile" />
        <h3 className=' ml-3 flex items-center text-white font-semibold py-1  text-center '>{userData.profile.name}</h3>
        <p className='text-sm text-center text-white'>{userData.profile.about}</p>
      </div>
      <hr className='border border-#ffffff50 my-4 ' />
      <div className='px-8 text-sm'>
        <p className='text-white'>Media</p>


        <div className='right_bar_images grid grid-row-auto mt-3 overflow-y-scroll h-32 '>
          {
            messages[currFriendId] && messages[currFriendId].map((chat, index) => {
              return (
                chat.image && <img className=' h-[50px] bg-white  object-center' key={index} src={`http://localhost:1000/user/get-image/${chat.image}`}></img>
              )
            })
          } </div>
        {isBtn&&<button className='absolute bottom-5 left-[50%] -translate-x-1/2 bg-blue-500 text-white border-none text-sm rounded-2xl cursor-pointer py-[6px] px-[47px]' onClick={e => { e.preventDefault();setBtn(false); logout();setBtn(true) }}>Logout</button>}
        {!isBtn && <div className='w-full flex justify-center'><Loader /></div>}
        </div>
    </div>
  )
}

export default RightSideBar
