import { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { DataContext } from '../context/AppContext';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { messageActions } from '../store/slices/messageSlice';
const Login = () => {
  useEffect(()=>{
    localStorage.setItem("token","");
  },[]);
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const { showAlert,setUserData,setState } = useContext(DataContext);
  const [otpForm, setOtpForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isBtnVis, setBtnVis] = useState(true);
  const [SignUpState, setSignUpState] = useState(true);
  const inId=useRef(null);
  const [userDeatils, setUserDetails] = useState({ userName: "", email: "", createPassword: "",confirmPassword: "", isChecked: true, otp: "" });
 const startTimer = () => {
  inId.current= setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1)
    }, 1000);
  }
  const stopInterval=()=>{
    clearInterval(inId.current);
    inId.current=null;
  }
  const onChange = (e) => {
    setUserDetails({ ...userDeatils, [e.target.name]: [e.target.value] })
  }
  const onChecked = (e) => {
    setUserDetails({ ...userDeatils, isChecked: !userDeatils.isChecked })
  }
  const onSubmitBtn = async (e) => {
    e.preventDefault();
    setBtnVis(false);
    if (SignUpState) {
      const res = await fetch("http://localhost:1000/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userName: userDeatils.userName.toString(), email: userDeatils.email.toString(), password: userDeatils.createPassword.toString() })
      });
      const json = await res.json();
      if (json.status) {
        showAlert(json.message, true, 2000);
        setBtnVis(true);
        localStorage.setItem("token",json.token);
        setState("email");
      }
      else {
        showAlert(json.message, false, 2000);
        setBtnVis(true)
      }
    }
    else {
      const res = await fetch("http://localhost:1000/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: userDeatils.email.toString(), password: userDeatils.createPassword.toString() })
      });
      const json = await res.json();
      if (json.status) {
        showAlert(json.message, true, 2000)
        setOtpForm(true);
        startTimer();
        setBtnVis(true);
      }
      else {
        setBtnVis(true)
        showAlert(json.message, false, 2000)
      }
    }
  }
  const onOtpVerify = async (e) => {
    e.preventDefault();
    setBtnVis(false);
    const res =await fetch("http://localhost:1000/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify({email:userDeatils.email.toString(),otp:userDeatils.otp.toString()})
    })
    const json=await res.json();
    if(json.status){
      showAlert(json.message,true,2000);
      setUserData(json.user)
      localStorage.setItem("token",json.user.token);
      setTimeout(()=>{
        dispatch(messageActions.addEmptyMessage(json.user._id));
        navigate("/chat")
      },1000)
    }
    else
      showAlert(json.message,false,2000)
    setBtnVis(true)
  }
  return (
    <div className="flex  flex-col md:flex-row md:justify-evenly md:items-center justify-start items-center min-h-[100vh] bg-[url('/background.png')] bg-cover bg-center w-full py-4">
      <img src={assets.logo_big} alt="logo" className='w-36 h-32 sm:w-44 sm:h-40  md:w-[38%] md:h-[35%]' />
      <form className="w-[85%] sm:w-[60%] min-[480px]:w-[76%] md:w-[25%] mt-8 flex flex-col gap-4 bg-white py-[20px] px-[30px] rounded-md" onSubmit={onSubmitBtn}>
        <h2 className='font-semibold text-xl'>{SignUpState ? "Sign Up" : "Login"}</h2>
        {SignUpState && <input className='px-[10px] py-[8px] border-gray-500 border-[1px] rounded-sm outline-[#077EFF]' placeholder='User name' required type="text" name='userName' onChange={onChange} value={userDeatils.userName.toString()} />}
        <input type="email" name='email' className='px-[10px] py-[8px] border-gray-500 border-[1px] rounded-sm outline-[#077EFF]' placeholder='Email Address' onChange={onChange} value={userDeatils.email.toString()} />
        <input type="password" name='createPassword' className='px-[10px] py-[8px] border-gray-500 border-[1px] rounded-sm outline-[#077EFF]' placeholder={`${SignUpState?"Create Password":"Enter Password"}`} onChange={onChange} value={userDeatils.createPassword.toString()} />
        {SignUpState&&<input type="password" name='confirmPassword' className='px-[10px] py-[8px] border-gray-500 border-[1px] rounded-sm outline-[#077EFF]' placeholder='Confirm Password' onChange={onChange} value={userDeatils.confirmPassword.toString()} />}
        {SignUpState&&<div className='flex gap-1 text-sm text-gray-600'>
          <input type="checkbox" onChange={onChecked} />
          <p>Agree the term and conditions</p>
        </div>}
        {!SignUpState && <span className='text-blue-600 text-[12px] hover:underline cursor-pointer' onClick={e => { setState("email"); navigate("/verify-email") }}>forget password</span>}

        {isBtnVis && <button disabled={(SignUpState&&(userDeatils.isChecked||userDeatils.confirmPassword.toString()!==userDeatils.createPassword.toString()||userDeatils.userName.toString().length===0))||userDeatils.createPassword.toString().length===0||userDeatils.email.toString().length===0} className='bg-blue-500 text-white w-full rounded-md text-md py-2 cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed' type='submit'>{SignUpState ? "Create account" : "Login now"}</button>}
        {!isBtnVis && !otpForm && <div className='w-full flex justify-center'><Loader /></div>}
        <div className='flex flex-col gap-1'>
          <p className='text-sm text-gray-700'>{SignUpState ? "Already have an account " : "Create an account"}<span onClick={e => {setSignUpState(!SignUpState);setUserDetails({ userName: "", email: "", createPassword: "",confirmPassword: "", isChecked: true, otp: "" });setOtpForm(false);stopInterval();setTimeLeft(600)}} className='font-semibold text-blue-500 ml-1 cursor-pointer hover:underline'>{SignUpState ? "Login" : "click"} here</span></p>
        </div>
        {!SignUpState && otpForm &&
          <div>
            <p className='w-full text-center mt-2'>Otp will expire in : <span className='font-semibold'>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span> : minutes</p>
            <input type="text" placeholder='Enter the otp ' className=' mt-4 outline-[#077EFF] border-gray-500 border-[1px]  w-full py-2 px-4 text-center' name='otp' onChange={onChange} value={userDeatils.otp} />
            {isBtnVis &&  <button disabled={userDeatils.otp.toString().length < 6} className="bg-blue-500 py-2 text-white rounded-md mt-5 w-full text-md disabled:bg-blue-300 disabled:cursor-not-allowed" onClick={onOtpVerify}>Submit Otp</button>}
            {!isBtnVis && <div className='w-full flex mt-5 justify-center'><Loader /></div>}
          </div>}
      </form>
    </div>
  )
}

export default Login
