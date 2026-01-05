import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Chat from "./pages/Chat"
import ProfileUpdate from "./pages/ProfileUpdate"
import VerifyEmail from "./pages/VerifyEmail"
import Alert from "./components/Alert"
import Verify from "./pages/Verify"
import ChangePassword from "./components/ChangePassword"
function App() {
  return (
    <div className="relative">
      <Alert />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/change-password" element={<ChangePassword/>}/>
        <Route path="/profile" element={<ProfileUpdate />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify" element={<Verify/>} />
      </Routes>
    </div>
  )
}

export default App
