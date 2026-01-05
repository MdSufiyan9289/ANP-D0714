import React, { useContext, useState,useEffect } from 'react'
import assets from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/AppContext';
import Loader from './Loader';

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({ password: "", newPassword: "" });
    const navigate = useNavigate();
    const [isBtn,setBtn]=useState(true);
    const { showAlert } = useContext(DataContext);
    const onChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: [e.target.value] })
    }
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            showAlert("You cannot access this page", false);
            navigate("/");
        }
    }, []);
    const onSubmitBtn = async (e) => {
        e.preventDefault();
        setBtn(false);
        const res = await fetch("http://localhost:1000/auth/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ password: passwords.password.toString(), newPassword: passwords.newPassword.toString() })
        });
        const json = await res.json();
        if (json.status) {
            showAlert(json.message);
            navigate("/chat");
        }
        else
            showAlert(json.message, false);
        setBtn(true);
    }
    return (
        <>
            { <div className="w-full h-screen flex justify-center items-center bg-[url('/background.png')] bg-cover bg-center ">
                <div className='w-[72%] md:w-[35%] bg-white rounded-xl flex flex-col gap-2 items-center p-4 '>
                    <div className='w-full flex justify-between'>
                        <h1 className=' text-[13px] min-[450px]:text-xl font-semibold mx-3 text-black'>Change Password</h1>
                        <Link className=' text-[10px] min-[450px]:text-sm hover:underline cursor-pointer mx-3 text-purple-600' to="/chat">Home</Link>

                    </div>
                    <img className=' w-[28%] h-[18%] mt-2' src={assets.logo_icon} alt="logo" />
                    <form className='flex flex-col w-[95%] items-center px-3 pt-2 pb-5 gap-3' onSubmit={onSubmitBtn}>
                        <input className='px-2 py-2 outline-[#077EFF] border border-gray-400 rounded-md w-full text-center' type="password" placeholder="Enter current password" name='password' onChange={onChange} />
                        <input className='px-2 py-2 outline-[#077EFF] border border-gray-400 rounded-md w-full text-center' type="password" placeholder="Enter new password" name='newPassword' onChange={onChange} />

                        {isBtn&&<button type='submit' className=' w-full disabled:bg-blue-300 disabled:cursor-not-allowed py-2 bg-blue-500 text-white mt-1 rounded-md' disabled={passwords.password.toString().length === 0} >Change Password</button>}
                        {!isBtn && <div className='w-full flex justify-center'><Loader /></div>}
                    </form>
                </div>
            </div >}
        </>
    )
}

export default ChangePassword
