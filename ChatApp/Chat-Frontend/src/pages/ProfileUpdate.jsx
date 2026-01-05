import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import assets from '../assets/assets'
import { DataContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const ProfileUpdate = () => {
  const { setUserData, showAlert, userData } = useContext(DataContext);
  const [isBtn, setBtn] = useState(true);
  const [profileData, setProfileData] = useState({ image: false, name: "", about: "" });
  // useEffect(() => {
  //   if (!localStorage.getItem("token")) {
  //     showAlert("You cannot access this page", false);
  //     navigate("/");
  //   }
  //   else
  //     setProfileData({ name: userData.profile.name, about: userData.profile.about ? userData.profile.about : "" })
  // }, [])
  const navigate = useNavigate();
  const onChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: [e.target.value] })
  }
  const setProfile = async () => {
    setBtn(false)
    const formData = new FormData();
    formData.append("file", profileData.image);
    formData.append("name", profileData.name.toString());
    formData.append("about", profileData.about.toString());
    const res = await fetch("http://localhost:1000/user/update-profile", {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: formData,
    });
    const json = await res.json();
    if (json.status) {
      setUserData(json.data);
      showAlert(json.message);
      navigate("/chat");
    }
    else
      showAlert(json.message, false);
    setBtn(true);
  }
  return (
    <>
      {
        <div className='min-h-[100vh] bg-[url(/background.png)] bg-cover flex items-center justify-center'>
          <div className='bg-white flex md:flex-row flex-col items-center justify-between w-[80%] md:w-[700px] rounded-sm px-10 py-8 '>
            <form className='flex flex-col  gap-5 h-full ' onSubmit={e => { e.preventDefault(); setProfile() }}>
              <h3 className='font-semibold'>Profile Details</h3>
              <label className='flex flex-col md:flex-row items-center gap-3 text-gray-400 cursor-pointer' htmlFor="avtar">
                <input onChange={e => setProfileData({ ...profileData, image: e.target.files[0] })} type="file" id='avtar' accept='.png,.jpg,.jpeg' hidden />
                <img className='w-10 md:w-12 aspect-[1/1] rounded-full object-cover object-center' src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" alt="avtar icon" />
                upload avtar image
              </label>
              <input className='p-3 w-[250px] md:w-[300px] border-[1px] border-[#c9c9c9] rounded-md' name='name' value={profileData.name} onChange={onChange} type="text" placeholder='Your name' required />
              <textarea className='p-3 w-[250px] md:w-[300px] border-[1px] border-[#c9c9c9] rounded-md' placeholder='write profile bio' required name='about' value={profileData.about} onChange={onChange}></textarea>
              {isBtn && <button className='w-full border-none text-white bg-blue-500 p-3 text-base cursor-pointer rounded-md' type='submit'>Save</button>}
              {!isBtn && <div className='w-full flex justify-center'><Loader /></div>}
            </form>
            <div className='flex flex-col'>
              <div className=' flex md:gap-2 w-full gap-10 ml-6 mt-6 md:mt-0'>
                <Link className='min-[200px]:text-[11px] underline md:text-[13px] md:w-[30%] md:p-2 rounded-sm md:bg-blue-700 md:hover:bg-gray-600 hover:font-semibold md:text-white text-purple-500 text-center' to="/chat" >Home</Link>
                <Link className='min-[200px]:text-[11px] underline md:text-[12px] text-center md:p-2  rounded-sm md:bg-blue-700 md:hover:bg-gray-600 text-purple-500 hover:font-semibold md:text-white' to="/change-password" >Change Password</Link>
              </div>
              <img className='hidden md:flex w-60 aspect-[1/1] md:my-5 my-9 mx-auto rounded-full ' src={assets.logo_icon} alt="logo" />
            </div>
          </div>
        </div>}
    </>
  )
}

export default ProfileUpdate
