import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { DataContext } from "../context/AppContext"
import Loader from '../components/Loader';
import { useDispatch } from 'react-redux';
import { messageActions } from '../store/slices/messageSlice';

const Verify = () => {
    const host = "http://localhost:1000"
    const dispatch = useDispatch();
    const { setUserData, setState, showAlert } = useContext(DataContext)
    const [isLoader, setLoader] = useState(false)
    const [msg, setMsg] = useState("Please wait while we are verifying you");
    const location = useLocation();
    const navigate = useNavigate();
    const verifyToSignedUp = async (token, subject) => {
        const res = await fetch(`${host}/auth/verify-link${subject == "change_the_password" ? "-forget-password" : ""}/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const json = await res.json();
        if (json.status) {
            setTimeout(() => {
                setLoader(false);
                if (subject == "verify_email_id")
                    setUserData(json.user);
                setMsg(json.message);
                setState("resetPassword")
            }, 2000)
            setTimeout(() => {
                if (subject == "verify_email_id") {
                    setUserData(json.user);
                    setState("");
                    localStorage.setItem("token", token);
                    dispatch(messageActions.addEmptyMessage(json.user._id));
                    navigate("/chat");
                }
                else
                    navigate("/verify-email")
            }, 3500)
        }
        else {
            setLoader(false)
            setMsg(json.message);
        }
    }
    useEffect(() => {
        setLoader(true)
        const queryParams = new URLSearchParams(location.search);
        const subject = queryParams.get("subject");
        const token = queryParams.get("token");
        if (!token || !localStorage.getItem("token") || localStorage.getItem("token") !== token) {
            setLoader(false);
            showAlert("Invalid token", false);
            navigate("/");
        }
        else
            verifyToSignedUp(token, subject);
    }, [location])
    return (
        <div className="w-full h-screen flex justify-center items-center bg-[url('/background.png')] bg-cover bg-center ">
            <div className='w-[80%] md:w-[45%] bg-white rounded-xl flex flex-col items-center py-6 px-3 '>
                <div className='flex justify-between w-full items-center'>
                    <h1 className='text-[12px] md:text-xl font-semibold mx-3 text-black w-full text-start'>Email Verification</h1>
                    <span className='text-blue-600 hover:underline text-[9px] md:text-[13px] w-[30%] cursor-pointer ' onClick={e => {setState("");navigate("/")}}>Go to home</span>
                </div>
                <img className=' w-[28%] h-[21%] mt-2' src={assets.logo_icon} alt="logo" />
                <p className='text-center text-[12px] md:text-xl text-blue-600 text-md my-6'>{msg}</p>
                {isLoader && <Loader />}
            </div>
        </div>
    )
}
export default Verify;
