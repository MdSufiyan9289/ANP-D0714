import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import Loader from '../components/Loader';
import { DataContext } from '../context/AppContext';

const VerifyEmail = () => {
    useEffect(() => {
        if (!currState) {
            showAlert("You cannot access this page", false);
            navigate("/");
        }
    }, [])
    const [isButtonShow, setBtnVis] = useState(true);
    const { showAlert, currState, setState } = useContext(DataContext);
    const [text, setText] = useState("")
    const navigate = useNavigate();
    const onChange = (e) => {
        setText(e.target.value);
    }
    const onSubmitBtn = async (e) => {
        e.preventDefault();
        setBtnVis(false)
        if (currState === "email") {
            const res = await fetch("http://localhost:1000/auth/forget-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: text })
            });
            const json = await res.json();
            if (json.status) {
                localStorage.setItem("token", json.token);
            }
            showAlert(json.message);
            
        }
        else {
            const res = await fetch("http://localhost:1000/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: localStorage.getItem("token"), password: text })
            });
            const json = await res.json();
            showAlert(json.message, json.status, 2000)
            if (json.status) {
                setState("");
                navigate("/");
            }
        }
        setBtnVis(true);
    }
    return (
        <div className="w-full h-screen flex justify-center items-center bg-[url('/background.png')] bg-cover bg-center ">
            <div className='w-[80%] md:w-[30%] bg-white rounded-xl flex flex-col gap-2 items-center p-4 '>
                <div className='flex justify-between w-full'>
                    <h1 className='text-sm min-[400px]:text-lg font-semibold mx-3 text-black'>{currState === "email" ? "Email verification" : "Password reset"}</h1>
                    <Link className='text-[10px] min-[400px]:text-[12px] text-purple-600 hover:underline cursor-pointer' to="/">Go to Signup</Link>
                </div>

                <img className=' w-[28%] h-[18%] mt-2' src={assets.logo_icon} alt="logo" />
                <form className='flex flex-col w-[95%] items-center px-3 pt-2 pb-5 gap-3' onSubmit={onSubmitBtn}>
                    <input className='px-2 py-2 outline-[#077EFF] border border-gray-400 rounded-md w-full text-center' type={`${currState === "email" ? "text" : "password"}`} placeholder={`${currState === "email" ? "Enter your email" : "Enter new password"}`} onChange={onChange} value={text} />
                    {isButtonShow && <button type='submit' className=' w-full py-2 bg-blue-500 text-white mt-1 rounded-md' >{currState === "email" ? "Send Email" : "Reset password"}</button>}
                    {!isButtonShow && <div className='w-full flex justify-center'><Loader /></div>}
                </form>
            </div>

        </div >
    )
}

export default VerifyEmail
