import React, { createContext, useState } from 'react'

export const DataContext = createContext();

const AppContext = ({ children }) => {
  const [currFriendId, setCurrFriendId] = useState("");
  const [currState, setState] = useState("");
  const [showMenuId, setMenuId]=useState("");
  const [alert, setAlert] = useState("");
  const [userData, setUserData] = useState(null);
  const showAlert = (message = "message", success = true, time = 1500) => {
    setAlert({ message: message, success: success });
    setTimeout(() => {
      setAlert("")
    }, time)
  }
  const value = {
    currFriendId,
    setCurrFriendId,
    alert,
    showAlert,
    currState,
    setState,
    userData,
    setUserData,
    showMenuId, 
    setMenuId
  }

  return (
    <div>
      <DataContext.Provider value={value}>
        {children}
      </DataContext.Provider>
    </div>
  )
}

export default AppContext
